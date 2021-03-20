const fluid = require('fluid-music')
const { techniques, FluidSession } = fluid
const tr808 = require('@fluid-music/tr-808')
const rides = require('@fluid-music/rides')

// local packages
const { Arpeggiator, DelaysOnOtherTracks, Stutter, StutterSoftOddEvents, StutterRampIntensityDown, Sequence, makeMidiNoteSequenceStutterTLibrary, tLibraryMap, DelayAcrossTracks, makeArpTLibrary, makeArpScore } = require('./techniques')
const { zebralette } = require('./presets')
const { dLibrary } = require('./d-library')
const { MidiNote, PluginAutomationRamp } = require('fluid-music/built/techniques')

const tLibraryBass = {
  g: tr808.bass.g,
  a: techniques.AudioFile.copy(tr808.bass.g, { pitchSemitones: 2 })
}

const tLibrarySynth = fluid.tLibrary.midiScale()
tLibrarySynth.s = new StutterRampIntensityDown(7, new MidiNote(57))
tLibrarySynth.a = new techniques.SendAutomation({ to: 'verb', value: 0})
tLibrarySynth.b = new techniques.SendAutomation({ to: 'verb', value: -6, curve: -0.5 })
tLibrarySynth.c = new techniques.SendAutomation({ to: 'verb', value: -12, curve: -0.5 })
tLibrarySynth.d = new techniques.SendAutomation({ to: 'v2', value: -12, curve: -0.5 })
tLibrarySynth.e = new techniques.SendAutomationRamp({ to: 'verb', value: 1.2345 })

const tLibraryZebraTune = {
  0: new PluginAutomationRamp(fluid.plugins.ZebraletteVst2.makeAutomation.osc1Tune(0)),
  1: new PluginAutomationRamp(fluid.plugins.ZebraletteVst2.makeAutomation.osc1Tune(1)),
  2: new PluginAutomationRamp(fluid.plugins.ZebraletteVst2.makeAutomation.osc1Tune(2)),
  3: new PluginAutomationRamp(fluid.plugins.ZebraletteVst2.makeAutomation.osc1Tune(3)),
  4: new PluginAutomationRamp(fluid.plugins.ZebraletteVst2.makeAutomation.osc1Tune(4)),
  5: new PluginAutomationRamp(fluid.plugins.ZebraletteVst2.makeAutomation.osc1Tune(5)),
  6: new PluginAutomationRamp(fluid.plugins.ZebraletteVst2.makeAutomation.osc1Tune(6)),
  7: new PluginAutomationRamp(fluid.plugins.ZebraletteVst2.makeAutomation.osc1Tune(7)),

  a: new PluginAutomationRamp(fluid.plugins.ZebraletteVst2.makeAutomation.osc1Tune(0)),
  b: new PluginAutomationRamp(fluid.plugins.ZebraletteVst2.makeAutomation.osc1Tune(7)),
  c: new PluginAutomationRamp(fluid.plugins.ZebraletteVst2.makeAutomation.osc1Tune(14)),
  d: new PluginAutomationRamp(fluid.plugins.ZebraletteVst2.makeAutomation.osc1Tune(21)),

  e: new PluginAutomationRamp(fluid.plugins.ZebraletteVst2.makeAutomation.osc1Tune(7)),
  f: new PluginAutomationRamp(fluid.plugins.ZebraletteVst2.makeAutomation.osc1Tune(11)),
  g: new PluginAutomationRamp(fluid.plugins.ZebraletteVst2.makeAutomation.osc1Tune(14)),
  h: new PluginAutomationRamp(fluid.plugins.ZebraletteVst2.makeAutomation.osc1Tune(18)),

  i: new PluginAutomationRamp(fluid.plugins.ZebraletteVst2.makeAutomation.osc1Tune(3)),
  j: new PluginAutomationRamp(fluid.plugins.ZebraletteVst2.makeAutomation.osc1Tune(14)),
  k: new PluginAutomationRamp(fluid.plugins.ZebraletteVst2.makeAutomation.osc1Tune(15)),
  l: new PluginAutomationRamp(fluid.plugins.ZebraletteVst2.makeAutomation.osc1Tune(19)),
}

fluid.plugins.ZebraletteVst2.parameterLibrary.env1ReleasePercent
const bpm = 68
const session = new FluidSession({ bpm, dLibrary }, [
  { name: 'vox4', children: [
    { name: 'p1', pan: -0.5, plugins: [zebralette.cPop2({ osc1Tune: 0, env1ReleasePercent: 70 })], tLibrary: tLibraryZebraTune, children: [
      { name: 'n1', tLibrary: tLibrarySynth }
    ] },
    { name: 'p2', pan: -0.123, plugins: [zebralette.cPop2({ osc1Tune: 0, env1ReleasePercent: 70 })], tLibrary: tLibraryZebraTune, children: [
      { name: 'n2', tLibrary: tLibrarySynth }
    ] },
    { name: 'p3', pan: 0.123, plugins: [zebralette.cPop2({ osc1Tune: 0, env1ReleasePercent: 70 })], tLibrary: tLibraryZebraTune, children: [
      { name: 'n3', tLibrary: tLibrarySynth }
    ] },
    { name: 'p4', pan: 0.5 ,plugins: [zebralette.cPop2({ osc1Tune: 0, env1ReleasePercent: 70 })], tLibrary: tLibraryZebraTune, children: [
      { name: 'n4', tLibrary: tLibrarySynth }
    ] },
  ] },
  { name: 'arps', plugins: [new fluid.plugins.RoughRider3Vst2({ externalSidechainEnable: 1 }).sidechainWith('bass')], children: [
    { name: 'arp', plugins: [zebralette.cMono()] },
    { name: 'arpD1', gainDb: -8, pan: -.5, plugins: [zebralette.cMono()] },
    { name: 'arpD2', gainDb: -8, pan: 0.5, plugins: [zebralette.cMono()] },
    { name: 'arpD3', gainDb: -8, pan: -1., plugins: [zebralette.cMono()] },
    { name: 'arpD4', gainDb: -8, pan: 1.0, plugins: [zebralette.cMono()] },
  ]},
  { name: 'bass', tLibrary: tr808.bass, tLibrary: tLibraryBass },
  { name: 'verb', plugins: [ new fluid.plugins.DragonflyHallVst2({ lateLevelPercent: 100, sizeMeters: 10 })] },
  { name: 'v2' },
])
const quarterNote = 1 / bpm * 60
const delay2 = quarterNote * 1/4
const delay1 = delay2 * .96

const transpose = 3
session.insertScore([
  {
    r:    '123412341234',
    d:     '6   ',
    bass:   ['a---    ', 'a---'],
    n1:     ['0---    ', '0--------', '0--------'],
    n2:     ['0---    ', '0--------', '0--------'],
    n3:     ['0---    ', '0--------', '0--------'],
    n4:     ['0---    ', '0--------', '0--------'],
    p1:     ['a       ', '  e-  a- ', ' i--     '],
    p2:     ['b       ', '  f-  b- ', ' j--     '],
    p3:     ['c       ', '  g-  c- ', ' k--     '],
    p4:     ['d       ', '  h-  d- ', ' l--     '],
  }, {
    arp: [
      {
        tLibrary: {
          a: new Arpeggiator(6, [0, 11, 12, 16, 17, 18].map(n => new DelaysOnOtherTracks([delay1, delay2], new MidiNote(n + 48)))),
          b: new Arpeggiator(5, [0, 11, 12, 16, 17, 18].map(n => new DelaysOnOtherTracks([delay1, delay2], new MidiNote(n + 50)))),
          c: new Arpeggiator(4, [0, 11, 12, 16, 17, 18].map(n => new DelaysOnOtherTracks([delay1, delay2], new MidiNote(n + 57)))),
          A: new DelaysOnOtherTracks([delay1, delay2], new Arpeggiator(6, [0, 11, 12, 16, 17, 18].map(n => new MidiNote(n + 48)))),
          B: new DelaysOnOtherTracks([delay1, delay2], new Arpeggiator(5, [0, 11, 12, 16, 17, 18].map(n => new MidiNote(n + 50)))),
          C: new DelaysOnOtherTracks([delay1, delay2], new Arpeggiator(4, [0, 11, 12, 16, 17, 18].map(n => new MidiNote(n + 57)))),
        },
        r:   '1 2 3 4 ',
        arp: ['   A bc ', '   A BC'],
      },
      makeArpScore(48+transpose, [0, 11, 12, 16, 17], [delay1, delay2]),
      {
        tLibrary: makeArpTLibrary(48 + transpose, [5, 11, 12, 17], delay1, delay2),
        r:    '1 e + a 1 e + a 1 e + a 1 e + a',
        d:    '5123412331234123',
        arp: ['0123012301230123', '0123012301230123'],      
      }, {
        tLibrary: makeArpTLibrary(52 + transpose, [0, 11, 12, 17], delay1, delay2),
        r:    '1e+a1e+a1e+a1e+a',
        d:    '5123412331234123',
        arp: ['0123012301230123', '0123012301230123'],      
      }
    ]
  }
])

session.editCursorTime -= 6
session.finalize()
// session.saveAsTracktionFile('part3')
session.saveAsReaperFile('part4')
  .then(() => console.log('saved'))
  .catch(e => console.error('error:', e))
