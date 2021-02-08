class Stutter {
  /**
   * @param {number} subdivisions how many times to re-trigger the technique
   * @param {import('fluid-music').Technique} technique 
   */
  constructor(subdivisions, technique) {
    this.subTechnique = technique
    this.subdivisions = Math.floor(subdivisions)
  }

  /**
   * @param {import('fluid-music').UseContext} context 
   */
  use(context) {
    const original = context

    context = { ...context } // shallow copy
    context.duration = context.duration / this.subdivisions
    context.durationSeconds = context.durationSeconds / this.subdivisions

    if (!context.data.stutter) context.data.stutter = {}
    context.data.stutter.subdivisions = this.subdivisions
    
    let flip = false
    for (let i = 0; i < this.subdivisions; i++) {
      context.data.stutter.i = i
      context.data.stutter.odd = flip
      context.data.stutter.even = (flip = !flip)

      context.startTime = original.startTime + (i / this.subdivisions * original.duration)
      context.startTimeSeconds = original.startTimeSeconds + (i / this.subdivisions * original.durationSeconds)

      this.subTechnique.use(context)
      context.eventIndex++
      original.eventIndex++
    }
  }
}

class StutterSoftOddEvents extends Stutter {
  constructor(subdivisions, technique, softTrimDb = -5, softVelocity = -15) {
    super(subdivisions, {
      use(context) {
        if (context.data.stutter && context.data.stutter.odd) {
          context = {...context}
          context.d = {...context.d}
          if (typeof context.d.trimDb !== 'number') context.d.trimDb = 0
          context.d.trimDb += softTrimDb
          if (typeof context.d.velocity !== 'number')  context.d.velocity = 64
          context.d.velocity += softVelocity
        }
        technique.use(context)
      }
    })
  }
}

module.exports = {
  Stutter,
  StutterSoftOddEvents,
}
