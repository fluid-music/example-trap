
const fluid = require("fluid-music")
const { MidiChord } = fluid.techniques

// Open voicings
const chords = [
  new MidiChord({
    name: "GMaj9",
    notes: [55, 62, 69, 71, 78],
  }),
  new MidiChord({
    name: "CMaj7/G",
    notes: [55, 60, 67, 74, 76],
  })
]

module.exports = chords
