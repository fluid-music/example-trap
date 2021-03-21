const fluid = require('fluid-music')
const { techniques, FluidSession } = fluid
const dLibrary = require('./d-library').dLibrary
const {
  Arpeggiator,
  ArrayToOtherTracks,
  DelaysOnOtherTracks,
  Stutter,
  StutterSoftOddEvents,
  StutterRampIntensityDown,
  Sequence,
  makeMidiNoteSequenceStutterTLibrary,
  tLibraryMap,
  DelayAcrossTracks,
  makeArpTLibrary,
  makeArpScore } = require('./techniques')

const { zebralette } = require('./presets')

function makeGlissTracks() {

  const glissandoTrack = { name: 'vox4', dLibrary, children: [
    { name: 'p', tLibrary: {
      0: new ArrayToOtherTracks([0, 0, 0, 0].map(n => new techniques.PluginAutomationRamp(fluid.plugins.ZebraletteVst2.makeAutomation.osc1Tune(n, -0.5)))),
      a: new ArrayToOtherTracks([0, 7, 14, 2].map(n => new techniques.PluginAutomationRamp(fluid.plugins.ZebraletteVst2.makeAutomation.osc1Tune(n, -0.5)))),
    } },
    { name: 'n', tLibrary : {
      n: new ArrayToOtherTracks([60, 60, 60, 60].map(n => new techniques.MidiNote(n))),
    } },
    { name: 'p1', pan: -0.5, plugins: [zebralette.cPop2({ osc1Tune: 0, env1ReleasePercent: 70 })], children: [
      { name: 'n1' }
    ] },
    { name: 'p2', pan: -0.123, plugins: [zebralette.cPop2({ osc1Tune: 0, env1ReleasePercent: 70 })], children: [
      { name: 'n2' }
    ] },
    { name: 'p3', pan: 0.123, plugins: [zebralette.cPop2({ osc1Tune: 0, env1ReleasePercent: 70 })], children: [
      { name: 'n3' }
    ] },
    { name: 'p4', pan: 0.5 ,plugins: [zebralette.cPop2({ osc1Tune: 0, env1ReleasePercent: 70 })], children: [
      { name: 'n4' }
    ] },
  ] }
  return glissandoTrack
}


function makeArpTracks(bpm) {

  const quarterNote = 1 / bpm * 60
  const delay2 = quarterNote * 1/4
  const delay1 = delay2 * .96

  const arpTrack = { name: 'arps', plugins: [], dLibrary, children: [
    { name: 'arp', plugins: [zebralette.cMono()], tLibrary: {
      a: new Arpeggiator(6, [0, 11, 12, 16, 17, 18].map(n => new DelaysOnOtherTracks([delay1, delay2], new techniques.MidiNote(n + 48)))),
      b: new Arpeggiator(5, [0, 11, 12, 16, 17, 18].map(n => new DelaysOnOtherTracks([delay1, delay2], new techniques.MidiNote(n + 50)))),
      c: new Arpeggiator(4, [0, 11, 12, 16, 17, 18].map(n => new DelaysOnOtherTracks([delay1, delay2], new techniques.MidiNote(n + 57)))),
      A: new DelaysOnOtherTracks([delay1, delay2], new Arpeggiator(6, [0, 11, 12, 16, 17, 18].map(n => new techniques.MidiNote(n + 48)))),
      B: new DelaysOnOtherTracks([delay1, delay2], new Arpeggiator(5, [0, 11, 12, 16, 17, 18].map(n => new techniques.MidiNote(n + 50)))),
      C: new DelaysOnOtherTracks([delay1, delay2], new Arpeggiator(4, [0, 11, 12, 16, 17, 18].map(n => new techniques.MidiNote(n + 57)))),
    } },
    { name: 'arp1', gainDb: -8, pan: -.5, plugins: [zebralette.cMono()] },
    { name: 'arp2', gainDb: -8, pan: 0.5, plugins: [zebralette.cMono()] },
    { name: 'arp3', gainDb: -8, pan: -1., plugins: [zebralette.cMono()] },
    { name: 'arp4', gainDb: -8, pan: 1.0, plugins: [zebralette.cMono()] },
  ] }

  return arpTrack
}


module.exports = {
  makeGlissTracks,
  makeArpTracks,
}
