
const fluid = require('fluid-music')
const { MidiChord } = fluid.techniques

const chords = [
  new MidiChord({
    name: 'GM9/Gb',
    notes: [54, 55, 59, 62, 67, 69, 71],
  }),
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
