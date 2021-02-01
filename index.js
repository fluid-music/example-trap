const { FluidSession, plugins, techniques } = require('fluid-music')
const tr808 = require('@fluid-music/tr-808')
const kit = require('@fluid-music/kit')

const copy = techniques.AudioFile.copy
const kit808 = tr808.kit
const hatPats = require('./hat-pats')

const trapKit = { ...tr808.kit }
const trapKick = copy(kit.tLibrary.D, {
  fadeOutSeconds: 0.2,  // cross fade with bass
  pitchSemitones: -1.59 // this just sounds good ¯\_(ツ)_/¯
})
// timing adjustments
trapKit.B = new techniques.AFOnset(trapKick, 0.01)
trapKit.p = new techniques.AFOnset(trapKit.p, 0.03)

// bass fades in
tr808.bass.f = copy(tr808.bass.g, { fadeInSeconds: 0.07 })
tr808.bass.F = copy(tr808.bass.G, { fadeInSeconds: 0.07 })

const ducker = new plugins.RoughRider3Vst2({
  externalSidechainEnable: 1,
  ratio: 8,
  sensitivityDb: -25,
  attackMs: 3,
  releaseMs: 223,
})

const bassComp = new plugins.RoughRider3Vst2({
  ratio: 4.2,
  sensitivityDb: -17,
  attackMs: 11,
  releaseMs: 116,
  makeupGainDb: 0,
  mixPercent: 94,
})

// Create a tLibrary filled with MIDI Chords
const chordLibrary = {
  a: new techniques.MidiChord({ notes: [64, 67, 71] }), // e minor
  b: new techniques.MidiChord({ notes: [64, 67, 69] }),
  c: new techniques.MidiChord({ notes: [59, 66, 69] }),
  d: new techniques.MidiChord({ notes: [59, 64, 67] }),
  e: new techniques.MidiChord({ notes: [59, 62, 64] }),
}

// Instantiate a Podolski VST2 plugin from a preset
const padSynthA = plugins.podolskiVst2Presets.brightPad()
const padSynthB = plugins.podolskiVst2Presets.brightPad()
padSynthA.parameters.vcf0Cutoff = 22
padSynthB.parameters.vcf0Cutoff = 2

const score = {
  r:      '1 + 2 + 3 + 4 + ',//1 + 2 + 3 + 4 + '
  snare: ['    K       K   ', '    K       K   '],
  clap:  ['    p       p   ', '    p       p   '],
  kick:  ['B  B         B B', 'B  B B   B B    '],
  bass:  ['g--          G--'],
  hat:   [hatPats[0],         hatPats[1]],
  // padA:  ['a-b---- ', 'c--c----', 'd---    ', '        '],
  // padB:  ['        ', '        ', '        ', 'e-------'],
}

// Create a Session, specifying beats-per-minute and track configuration
const session = new FluidSession({ bpm: 78, loopStartTime: 1, loopDuration: 2 }, [
  // In the first example, we specified a tLibrary in the score object. In this
  // example, tLibrary objects are specified in the track objects.
  { name: 'drums', gainDb: -6, tLibrary: trapKit, children: [
    { name: 'snare', gainDb: -3 },
    { name: 'clap' },
    { name: 'kick', gainDb: -4 },
    { name: 'hat' },
  ]},
  { name: 'bass', gainDb: -12, plugins: [bassComp], tLibrary: tr808.bass },
  // Notice the pad tracks have a .plugins array containing the synthesizer
  // preset. It also has a dedicated tLibrary containing MIDI chords.
  { name: 'pads', tLibrary: chordLibrary, plugins: [ducker], children: [
    { name: 'padA', plugins: [padSynthA] },
    { name: 'padB', plugins: [padSynthB] },
  ]}
])

// Insert the score object.
session.insertScore(score, { startTime: 1 })
session.finalize()
const sessionName = 'trap'
session.saveAsReaperFile(sessionName)
// session.sendToServer()
  .catch(e => console.error('Error:', e))
  .then(() => console.warn('Saved:',  sessionName))
