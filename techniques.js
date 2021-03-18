const { techniques } = require('fluid-music')

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

class StutterRampIntensityDown extends Stutter {
  constructor(subdivisions, technique) {
    super(subdivisions, {
      use(context) {
        context = {...context}
        context.d = {...context.d}
        if (typeof context.d.intensity !== 'number') context.d.intensity = 1
        context.d.intensity *= ((subdivisions - context.data.stutter.i) / subdivisions)
        technique.use(context)
      }
    })
  }
}

/**
 * Each time this technique is used in a pattern, it will rotate through the
 * supplied techniques in order. It will reset to the first technique at the
 * beginning of each pattern string. 
 */
class Sequence {
  constructor(techniques) {
    if (!Array.isArray && typeof techniques.use === 'function') techniques = [techniques]
    if (!Array.isArray(techniques) || !techniques.length) throw new Error('Sequence expects an array of techniques, or a single technique')
    this.techniques = techniques
  }

  /**
  * @param {import('fluid-music').UseContext} context
  */
  use(context) {
    if (typeof context.data.sequenceIndex !== 'number') context.data.sequenceIndex = 0
    const index = context.data.sequenceIndex++ % this.techniques.length
    const technique = this.techniques[index]
    technique.use(context)
  }
}

/**
 * Retrigger midi notes
 * @param {number[]} notes
 * @returns {Sequence}
 */
function makeMidiNoteSequence(notes) {
  const techniques = notes.map(note => new techniques.MidiNote({note}))
  return new Sequence(techniques)
}

const keys36 = '1234567890'.split('')
function makeMidiNoteSequenceStutterTLibrary(notes) {
  const noteTechniques = notes.map(note => {
    return {
      use(context) {
        const stutterTechnique = new StutterRampIntensityDown(context.data.myStutterIndex, new techniques.MidiNote({note}))
        stutterTechnique.use(context)
      }
    }
  })

  const tLibrary = {}

  const sequenceTechnique = new Sequence(noteTechniques)

  for (let i = 1; i <= 35; i++) {
    tLibrary[keys36[i - 1]] = function () {
      return {
        use(context) {
          context.data.myStutterIndex = i
          sequenceTechnique.use(context)
        }
      }
    }()
  }

  return tLibrary
}

function tLibraryMap(tLib, func) {
  const tLibrary = {}
  for (const [key, technique] of Object.entries(tLib)) {
    tLibrary[key] = func(technique)
  }
  return tLibrary
}

/**
 * Use the supplied technique across child tracks. Use with Sequence to put
 * something slightly different on each track. 
 */
class DelayAcrossTracks {
  constructor(delayWholeNotes, technique, parentTrack, callLimit) {
    this.delayWholeNotes = delayWholeNotes
    this.technique = technique
    this.parentTrack = parentTrack
    this.callLimit = Math.min(callLimit || parentTrack.children.length, parentTrack.children.length)
  }
  use(context) {
    const delaySeconds = context.session.timeWholeNotesToSeconds(this.delayWholeNotes)
    for (let i = 0; i < this.callLimit; i++) {
      const newContext = {...context}
      if (newContext.data.midiClip) delete newContext.data.midiClip
      newContext.track = this.parentTrack.children[i]
      new techniques.Nudge(delaySeconds * i, this.technique).use(newContext)
    }
  }
}

module.exports = {
  Stutter,
  StutterSoftOddEvents,
  StutterRampIntensityDown,
  Sequence,
  makeMidiNoteSequence,
  makeMidiNoteSequenceStutterTLibrary,
  tLibraryMap,
  DelayAcrossTracks,
}
