const fluid = require('fluid-music')
const { MidiNote, MidiChord } = fluid.techniques
const { techniques, converters } = fluid
const { range } = converters

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

function makeArpTLibrary(root, intervals, ...delays) {
  const tLibrary = {}
  const noteTechniques = intervals.map(interval => new techniques.MidiNote({ note: root + interval }))

  // for (const [i, noteTechnique] of Object.entries(noteTechniques))
  noteTechniques.forEach((noteTechnique, i) => {
    noteTechnique = new DecreasingIntensity(noteTechnique, 0.8)
    tLibrary[i] = {
      use(context) {
        context = {...context}
        context.duration += 0.005
        noteTechnique.use(context)
        for (const [i, delay] of delays.entries()) {
          const trackName = context.track.name+(parseInt(i)+1)
          const onOtherTrack = new OnOtherTrack(trackName, noteTechnique)
          const nudged = new techniques.Nudge(delay, onOtherTrack)
          nudged.use(context)
        }
      }
    }
  })
  return tLibrary
}

class OnOtherTrack {
  constructor(trackOrTrackName, technique) {
    this.track = null
    this.trackName = null
    this.technique = technique

    if (trackOrTrackName instanceof fluid.FluidTrack) {
      this.track = trackOrTrackName
    } else if (typeof trackOrTrackName === 'string') {
      this.trackName = trackOrTrackName
    } else {
      throw new Error('invalid track:', + trackOrTrackName)
    }
  }

  /**
   * @param {import('fluid-music').UseContext} context
   */
  use(context) {
    const otherTrack = (this.track) ? this.track : context.session.getOrCreateTrackByName(this.trackName)
    context = {...context, ...{track: otherTrack}}
    this.technique.use(context)
  }
}

class DelaysOnOtherTracks {
  constructor(delays, technique) {
    this.technique = technique
    this.delays = delays
  }
  use(context) {
    this.technique.use(context)
    for (let i = 0; i < this.delays.length; i++) {
      const delay = this.delays[i]
      const trackName = context.track.name+(i+1)
      const nudged = new techniques.Nudge(delay, this.technique)
      const onOtherTrack = new OnOtherTrack(trackName, nudged)

      onOtherTrack.use(context)
    }
  }
}

class ArrayToOtherTracks {
  constructor(techniques) {
    this.techniques = techniques
  }
  use(context) {
    for (let i = 0; i < this.techniques.length; i++) {
      const trackName = context.track.name + (i+1)
      const technique = new OnOtherTrack(trackName, this.techniques[i])
      technique.use(context)
    }
  }
}

class DecreasingIntensity {
  constructor(technique, maxIntensity = 1) {
    this.technique = technique
    this.maxIntensity = maxIntensity
  }
  /** @param {import('fluid-music').UseContext} context */
  use(context) {
    // how far into the clip are we
    const complete = (context.startTime - context.clip.startTime) / context.clip.duration
    context.d.intensity = (1 - complete) * this.maxIntensity
    this.technique.use(context)
  }
}


function makeArpScore(root, intervals, delays) {
  const score = {
    tLibrary: makeArpTLibrary(root, intervals, ...delays),
    r: '1'+new Array(intervals.length-1).fill(null).map(() => '.').join(''),
    arp: new Array(intervals.length).fill(null).map((_, i) => i).join('')
  }
  score.r = new Array(4).fill(score.r).join('')
  score.arp = new Array(4).fill(score.arp).join('')
  console.log(score)
  return score
}

class Arpeggiator {
  /**
   * @param midiChordOrNotes can be a MidiChord, or an array. If it is an array,
   * it must may contain a combination of midi note numbers and techniques
   */
  constructor(midiChordOrNotes) {
    this.iterations = midiChordOrNotes.length

    if (midiChordOrNotes instanceof MidiChord) this.notes = midiChordOrNotes.notes.map(n => MidiNote(n))
    else if (Array.isArray(midiChordOrNotes)) this.notes = midiChordOrNotes.map(n => typeof n === 'number' ? new MidiNote(n) : n)
    else throw new Error('Unexpected Arppegiator technique: ' + JSON.stringify(midiChordOrNotes))
  }

  /** @param {import('fluid-music').UseContext} context */
  use(context) {

    context = {...context}
    const durationDeltaSeconds = 0.008
    const durationDelta = context.session.timeSecondsToWholeNotes(durationDeltaSeconds)
    const originalStartTimeSeconds = context.startTimeSeconds
    const originalStartTime = context.startTime
    const originalDuration = context.duration
    const originalDurationSeconds = context.durationSeconds
    const stepDuration = (originalDuration / this.iterations)
    const stepDurationSeconds = (originalDurationSeconds / this.iterations)
    const clipFraction = (context.startTime - context.clip.startTime) / context.clip.duration
    const initialIntensity = typeof context.d.intensity === 'number' ? context.d.intensity : 1

    for (let i = 0; i < this.iterations; i++) {
      const technique = this.notes[i % this.notes.length]
      if (technique === null || technique === undefined || technique === false || technique === NaN) continue
      const fraction = i / this.iterations
      context.startTime = originalStartTime + i * stepDuration
      context.startTimeSeconds = originalStartTimeSeconds + i + stepDurationSeconds
      context.duration = stepDuration + durationDelta
      context.durationSeconds = stepDurationSeconds + durationDeltaSeconds
      context.d = { ...context.d }
      context.d.intensity = (1-fraction) * (1-clipFraction) * initialIntensity
      technique.use(context)
    }
  }
}

class MidiTranspose {
  constructor(amount, techniqueOrNote) {
    if (typeof techniqueOrNote === 'number') {
      this.technique = new MidiNote(techniqueOrNote + amount)
    } else if (techniqueOrNote instanceof MidiNote) {
      this.technique = new MidiNote(techniqueOrNote)
      this.technique.note += amount
    }
  }
  use(context) {
    this.technique.use(context)
  }
}

class Multiple {
  constructor(...techniques){
    this.techniques = techniques
  }
  use(context) {
    for (const tech of this.techniques) tech.use(context)
  }
}

class MidiScale {
  /**
   * @param {number} root the MIDI note number that will be implied by degree = 0
   */
  constructor(root = 57, delays, deltas) {
    this.rootMidiNoteNumber = root
    this.scaleIntervals = [0, 2, 3, 5, 7, 8, 10] // minor scale
    this.scaleSize = 12 // intervals in an octave
    // this.notes = range(13).map(i => this.scaleIntervals.map(n => (n + i * this.scaleSize) % 128)).flat()
    this.delays = delays
    this.deltas = deltas || new Array(this.delays.length).fill(0)
  }

  degreeToMidiNoteNumber(degree) {
    const octave = Math.floor(degree / this.scaleIntervals.length)
    const degreeInOctave = (degree >= 0)
      ? degree % this.scaleIntervals.length
      : (degree + (Math.abs(Math.floor(degree / this.scaleIntervals.length)) * this.scaleIntervals.length)) % (this.scaleIntervals.length)

    // Now treat octave and degreeInOctave as relative to the root MIDI number
    return this.rootMidiNoteNumber + (octave * this.scaleSize) + this.scaleIntervals[degreeInOctave]
  }

  makeTechnique(degree) {
    /**
     * @param {import('fluid-music').UseContext} context
     */
    const use = (context) => {
      const mainNoteNumber = this.degreeToMidiNoteNumber(degree)
      const mainNote = new techniques.MidiNote(mainNoteNumber)
      mainNote.use(context)
      for (let i = 0; i < this.delays.length; i ++) {
        const delay = this.delays[i]
        const noteNumber = this.degreeToMidiNoteNumber(degree + (this.deltas[i] || 0))
        const midiNote = new techniques.MidiNote(noteNumber)
        const onOtherTrack = new OnOtherTrack(context.track.name + (i+1), midiNote)
        const nudged = new techniques.Nudge(delay, onOtherTrack)
        nudged.use(context)
      }
    }
    return { use }
  }

  midiNoteNumberToDegree(note) {
    const octave = Math.floor((note - this.rootMidiNoteNumber) / this.scaleSize)
    for (let degree = 0; degree < this.scaleIntervals.length; degree++) {
      const checkNote = this.degreeToMidiNoteNumber(this.scaleIntervals.length * octave + degree)
      if (checkNote === note) {
        return degree + octave * this.scaleIntervals.length
      }
    }
    return null
  }

  midiChordToDegreeArray(midiChord) {
    const inputNotesArray = (midiChord instanceof MidiChord) ? midiChord.notes : midiChord
    const degrees = [] // { note : number, degree? : number}
    for (const note of inputNotesArray) {
      const foundDegree = { note }
      const degree = this.midiNoteNumberToDegree(note)
      if (typeof degree === 'number') foundDegree.degree = degree
      degrees.push(foundDegree)
    }
    return degrees
  }
}

module.exports = {
  MidiScale,
  Arpeggiator,
  ArrayToOtherTracks,
  MidiTranspose,
  Multiple,
  Stutter,
  StutterSoftOddEvents,
  StutterRampIntensityDown,
  Sequence,
  OnOtherTrack,
  DelaysOnOtherTracks,
  makeArpScore,
  makeMidiNoteSequence,
  makeArpTLibrary,
  tLibraryMap,
  DelayAcrossTracks,
}
