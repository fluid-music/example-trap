const fluid = require('fluid-music')
const { techniques, FluidSession, converters } = fluid

const dLibrary = require('./d-library').dLibrary
const {
  Arpeggiator,
  ArrayToOtherTracks,
  DelaysOnOtherTracks,
  Multiple,
  MidiTranspose,
  MidiScale,
  Stutter,
  StutterSoftOddEvents,
  StutterRampIntensityDown,
  Sequence,
  makeMidiNoteSequenceStutterTLibrary,
  tLibraryMap,
  DelayAcrossTracks,
  makeArpTLibrary,
  makeArpScore,
  OnOtherTrack} = require('./techniques')

const { zebralette } = require('./presets')

function makeGlissTracks() {

  const glissandoTrack = { name: 'gliss', dLibrary, children: [
    { name: 'p', tLibrary: {
      0: new ArrayToOtherTracks([0, 0, 0, 0].map(n => new techniques.PluginAutomationRamp(fluid.plugins.ZebraletteVst2.makeAutomation.osc1Tune(n, -0.5)))),
      a: new ArrayToOtherTracks([0, 7, 14, 21].map(n => new techniques.PluginAutomationRamp(fluid.plugins.ZebraletteVst2.makeAutomation.osc1Tune(n, -0.5)))),
      b: new ArrayToOtherTracks([0, 4, 7, 10].map(n => new techniques.PluginAutomationRamp(fluid.plugins.ZebraletteVst2.makeAutomation.osc1Tune(n, -0.5)))),
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

function makeArp6TLibrary(bpm, delta1 = 0, delta2 = 0) {
  const quarterNote = 1 / bpm * 60
  const delay = quarterNote * 2/6
  const delay1 = delay * 0.96
  const delay2 = delay * 1.04
  const scale = new MidiScale(52, [delay1, delay2], [delta1, delta2])
  return {
    a: new Arpeggiator(6, [2, 8, 9, 10, 11, null].map(n => (n !== null) && scale.makeTechnique(n))),
    b: new Arpeggiator(6, [2, 8, 9, 11, 13, null].map(n => (n !== null) && scale.makeTechnique(n))),
    c: new Arpeggiator(6, [1, 2, 8, 9, 11, null].map(n => (n !== null) && scale.makeTechnique(n))),
    d: new Arpeggiator(6, [1, 2, 8, 9, 11, 13].map(n => (n !== null) && scale.makeTechnique(n))),
  }
}


function makeArp6Tracks(bpm) {
  const arpTrack = { name: 'arp', dLibrary, children: [
    { name: 'arp6', plugins: [zebralette.cMono()], tLibrary: fluid.tLibrary.fromArray([
      [0, 11, 12, 14, 16, null],
      [0, 11, 12, 16, 19, null],
      [-1, 0, 11, 12, 16, null],
      [-1, 0, 11, 12, 16, 19],
    ].map((intervals) => makeArp6TLibrary(bpm, 55, intervals)))},
    { name: 'arp61', gainDb: -8, pan: -.5, plugins: [zebralette.cMono()] },
    { name: 'arp62', gainDb: -8, pan: 0.5, plugins: [zebralette.cMono()] },
    { name: 'arp63', gainDb: -8, pan: -1., plugins: [zebralette.cMono()] },
    { name: 'arp64', gainDb: -8, pan: 1.0, plugins: [zebralette.cMono()] },
  ]}

  return arpTrack
}


module.exports = {
  makeArp6TLibrary,
  makeGlissTracks,
  makeArp6Tracks,
}
