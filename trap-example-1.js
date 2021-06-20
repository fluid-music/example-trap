const fs = require('fs')
const path = require('path')

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
const clap = trapKit.p
trapKit.B = new techniques.AFOnset(trapKick, 0.01)
trapKit.p = new techniques.AFOnset(clap, 0.03)
trapKit.o = copy(trapKit.h, { gainDb: -3.5 })       // offbeat hi-hat
trapKit.r = new techniques.AFReverse(clap, 0.03)    // reverse clap

// bass fades in
tr808.bass.b = copy(tr808.bass.g, { pitchSemitones: 4 })
tr808.bass.B = copy(tr808.bass.G, { pitchSemitones: 4 })
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

const mainComp = new plugins.RoughRider3Vst2({
  ratio: 1.5,
  sensitivityDb: -27,
  makeupGainDb: 0,
  attackMs: 2,
  mixPercent: 50,
  releaseMs: 350,
})

const verb = new plugins.DragonflyRoomVst2({
  dryLevelPercent: 0,
  decaySeconds: 1.8,
  lowBoostPercent: 0,
})

const delay16 = new plugins.ValhallaFreqEchoVst2({
  wetDryPercent: 100,
  sync: plugins.ValhallaFreqEchoVst2.parameterLibrary.sync.choices['1/16'],
})

// Create a tLibrary filled with MIDI Chords
const chordLibrary = {
  b: new techniques.MidiChord({ notes: [59, 64, 71] }),
  d: new techniques.MidiChord({ notes: [59, 64, 67] }),
  A: new techniques.MidiChord({ notes: [47, 50, 59] }),
  B: new techniques.MidiChord({ notes: [47, 52, 62] }),
}

// Instantiate a Podolski VST2 plugin from a preset
const padSynthA = plugins.podolskiVst2Presets.brightPad()
padSynthA.parameters.dly1CrossfeedPercent = 60
padSynthA.parameters.dly1MixPercent = 33
padSynthA.parameters.vcf0Cutoff = 22

const padSynthB = plugins.podolskiVst2Presets.brightPad()
padSynthB.parameters.vcf0Cutoff = 2
padSynthB.parameters.dly1MixPercent = 12

const padSynthSuper = new plugins.PodolskiVst2()
padSynthSuper.vst2.presetBase64 = fs.readFileSync(path.join(__dirname, 'presets', 'podo-superwave.FXP').toString('base64'))

const score = {
  r:      '1 + 2 + 3 + 4 + ',//1 + 2 + 3 + 4 + '
  snare: ['    K       K   ', '    K       K   ', '    K       K   ', '    K       K   '],
  clap:  ['    p       p   ', '    p       p-r-', '    p       p   ', '    p       p-r-'],
  kick:  ['B  B         B B', 'B  B B   B B    ', 'B  B         B B', 'B  B B   B B    '],
  bass:  ['g-------     B--', 'g-------        ', 'g-------     B--', 'g-------     B--'],
  hat:   hatPats.variations,
  pads: {
    r: '1 2 3 4 ',
    padA:  ['        ', 'b-      ', '        ', 'd-      '],
    padB:  ['A-      ', 'B-      ', 'A---    ', 'B---    '],
  }
}

// Create a Session, specifying beats-per-minute and track configuration
const session = new FluidSession({ bpm: 63, loopStartTime: 1, loopDuration: 4 }, [
  { name: 'main', plugins: [mainComp], children: [
    // In the first example, we specified a tLibrary in the score object. In this
    // example, tLibrary objects are specified in the track objects.
    { name: 'drums', gainDb: -6, tLibrary: trapKit, children: [
      { name: 'snare', gainDb: -3, sends: [{ to: 'verb', gainDb: 0 }]  },
      { name: 'clap', sends: [{ to: 'verb', gainDb: 0 }] },
      { name: 'kick', gainDb: -4, sends: [{ to: 'verb', gainDb: -8 }]  },
      { name: 'hat', gainDb: -10 },
    ]},
    { name: 'bass', gainDb: -12, plugins: [bassComp], tLibrary: tr808.bass },
    // Notice the pad tracks have a .plugins array containing the synthesizer
    // preset. It also has a dedicated tLibrary containing MIDI chords.
    { name: 'pads', gainDb: -8, tLibrary: chordLibrary, sends: [{ to: 'verb', gainDb: 0 }],  plugins: [ducker], children: [
      { name: 'padA', gainDb: -7, plugins: [padSynthA] },
      { name: 'padB', gainDb: 0, plugins: [padSynthB] },
      { name: 'padC', gainDb: -12, plugins: [padSynthSuper] },
    ]},
    { name: 'verb', gainDb: -15, plugins: [verb] },
    { name: 'delay16', gainDb: 0, plugins: [delay16] },
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
