const fluid = require('fluid-music')
const { techniques, FluidSession } = fluid
const tr808 = require('@fluid-music/tr-808')
const rides = require('@fluid-music/rides')

// local packages
const { Stutter, StutterSoftOddEvents, StutterRampIntensityDown, Sequence, makeMidiNoteSequenceStutterTLibrary, tLibraryMap, DelayAcrossTracks } = require('./techniques')
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

  i: new PluginAutomationRamp(fluid.plugins.ZebraletteVst2.makeAutomation.osc1Tune(3)), // this group is   boring
  j: new PluginAutomationRamp(fluid.plugins.ZebraletteVst2.makeAutomation.osc1Tune(14)),
  k: new PluginAutomationRamp(fluid.plugins.ZebraletteVst2.makeAutomation.osc1Tune(15)),
  l: new PluginAutomationRamp(fluid.plugins.ZebraletteVst2.makeAutomation.osc1Tune(19)),
}

fluid.plugins.ZebraletteVst2.parameterLibrary.env1ReleasePercent

const session = new FluidSession({ bpm : 100, dLibrary }, [
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
  { name: 'bass', tLibrary: tr808.bass, tLibrary: tLibraryBass },
  { name: 'verb', plugins: [ new fluid.plugins.DragonflyHallVst2({ lateLevelPercent: 100, sizeMeters: 10 })] },
  { name: 'v2' },
])

session.insertScore([
  {
    r:    '123412341234',
    d:     '6   ',
    bass:   ['a---    ', 'a---'],
    n1:     ['0---    ', '0--------', '0--------'],
    n2:     ['0---    ', '0--------', '0--------'],
    n3:     ['0---    ', '0--------', '0--------'],
    n4:     ['0---    ', '0--------', '0--------'],
    p1:     ['a       ', '  e-  a- ', ' i---   a'],
    p2:     ['b       ', '  f-  b- ', ' j--     '],
    p3:     ['c       ', '  g-  c- ', ' k--     '],
    p4:     ['d       ', '  h-  d- ', ' l-      '],
  }, {

  }
])

session.finalize()
// session.saveAsTracktionFile('part3')
session.saveAsReaperFile('part4')
  .then(() => console.log('saved'))
  .catch(e => console.error('error:', e))
