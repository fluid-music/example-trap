
const fluid = require('fluid-music')
const { MidiChord } = fluid.techniques

const chords = [
  /** a */
  new MidiChord({
    name: 'Dsus4',
    notes: [50, 57, 62, 67, 71],
  }),

  new MidiChord({
    name: 'Gadd11/D',
    notes: [50, 61, 62, 67, 71, 72],
  }),

  new MidiChord({
    name: 'B5/Gb',
    notes: [54, 55, 66, 67, 71],
  }),

  new MidiChord({
    name: 'Gsus4M7/Gb',
    notes: [54, 55, 62, 66, 69, 72],
  }),
  /** e */
  new MidiChord({
    name: 'A5',
    notes: [57],
  }),
  /** f */
  new MidiChord({
    name: 'GM9/Gb',
    notes: [54, 55, 59, 62, 67, 69, 71],
  }),
  /** g */
  new MidiChord({
    name: 'GM9/Gb',
    notes: [54, 55, 59, 62, 67, 69, 71],
  }),

  new MidiChord({
    name: 'Dsus413',
    notes: [50, 57, 62, 64, 67, 71, 72],
  }),

  new MidiChord({
    name: 'Gadd11/D',
    notes: [50, 55, 60, 62, 67, 71, 72],
  })
]

module.exports = chords
