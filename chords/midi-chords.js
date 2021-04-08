
const fluid = require('fluid-music')
const { MidiChord } = fluid.techniques

const chords = [

  new MidiChord({
    name: 'CM7',
    notes: [59, 60, 67, 71, 72, 76, 79],
  }),

  new MidiChord({
    name: 'D13',
    notes: [62, 71, 74, 76, 78, 81, 84],
  }),

  new MidiChord({
    name: 'Esus4',
    notes: [64, 66, 71, 76, 78, 81, 84],
  }),

  new MidiChord({
    name: 'CM13/E',
    notes: [64, 67, 72, 76, 81, 83, 86],
  })
]

module.exports = chords
