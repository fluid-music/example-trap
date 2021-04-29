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

const { zebralette, tEqualizer } = require('./presets')


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
    { name: 'p4', pan: 0.5, plugins: [zebralette.cPop2({ osc1Tune: 0, env1ReleasePercent: 70 })], children: [
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
    a: new Arpeggiator([2, 8, 9, 10, 11, null].map(n => (n !== null) && scale.makeTechnique(n))),
    b: new Arpeggiator([2, 8, 9, 11, 13, null].map(n => (n !== null) && scale.makeTechnique(n))),
    c: new Arpeggiator([1, 2, 8, 9, 11, null].map(n => (n !== null) && scale.makeTechnique(n))),
    d: new Arpeggiator([1, 2, 8, 9, 11, 13].map(n => (n !== null) && scale.makeTechnique(n))),
  }
}

function makeArp6TLibraryFromMidiChords(delayArray, degreeDeltaArray, forceSize, midiChords, scaleIntervals) {

  const scale = new MidiScale(52, delayArray, degreeDeltaArray, scaleIntervals)
  return fluid.tLibrary.fromArray(midiChords.map(chord => {
    let degrees = scale.midiChordToDegreeArray(chord)
    if (typeof forceSize === 'number') {
      const oldDegrees = degrees
      degrees = new Array(forceSize).fill(null).map((n, i) => {
        return (i < oldDegrees.length) ? oldDegrees[i] : null
      })
    }
    // fluid.random.shuffle(degrees)
    const arpTechnique = new Arpeggiator(degrees.map(n => {
      if (!n || !n.hasOwnProperty('degree')) return
      return scale.makeTechnique(n.degree)
    }))

    return arpTechnique
  }))
}

const tLibGainAuto = {};
[-Infinity, -25, -18, -13, -10, -5, -3, -2, 0, 4].forEach((value, i, all) => {
  tLibGainAuto[i] = new fluid.techniques.TrackGainAutomation(value)
})

function makeArp6Tracks(bpm) {
  const arpTrack = { name: 'arp', dLibrary, plugins: [tEqualizer.zero128()], children: [
    { name: 'arp6', gainDb: -6, plugins: [zebralette.cMono(), tEqualizer.zero128()], tLibrary: fluid.tLibrary.fromArray([
      [0, 11, 12, 14, 16, null],
      [0, 11, 12, 16, 19, null],
      [-1, 0, 11, 12, 16, null],
      [-1, 0, 11, 12, 16, 19],
    ].map((intervals) => makeArp6TLibrary(bpm, 55, intervals)))},
    { name: 'arp61', gainDb: -8, pan: -.6, plugins: [zebralette.cMono({ env1AttackPercent: 7 }), tEqualizer.zero128()] },
    { name: 'arp62', gainDb: -9, pan: 0.0, plugins: [zebralette.cMono({ env1AttackPercent: 8 }), tEqualizer.zero128()] },
    { name: 'arp63', gainDb: -10, pan: 0.6, plugins: [zebralette.cMono({ env1AttackPercent: 9 }), tEqualizer.zero128()] },
    { name: 'arp64', gainDb: -11, pan: -.6, plugins: [zebralette.cMono({ env1AttackPercent: 9 }), tEqualizer.zero128()] },
    // { name: 'arp65', gainDb: -12, pan: -.5, plugins: [zebralette.cMono({ env1AttackPercent: 9 })] },
    // { name: 'arp66', gainDb: -13, pan: 0.5, plugins: [zebralette.cMono({ env1AttackPercent: 9 })] },
  ]}

  const tLibArpSync = fluid.tLibrary.merge(tLibGainAuto, fluid.tLibrary.fromArray([
    [0, 11, 12, 14, 16, null],
    [0, 11, 12, 16, 19, null],
    [-1, 0, 11, 12, 16, null],
    [-1, 0, 11, 12, 16, 19],
  ].map((intervals) => makeArp6TLibrary(bpm, 55, intervals))))

  const arpTrackSync = { name: 'arpSync', gainDb: -10, width: -1, dLibrary, plugins: [tEqualizer.zero128()], children: [
    { name: 'arp6S', gainDb: -6, plugins: [zebralette.cMonoSync(), tEqualizer.zero128()], tLibrary: tLibArpSync },
    { name: 'arp6S1', gainDb: -8, pan: 0.0, tLibrary: tLibGainAuto, plugins: [zebralette.cMonoSync({ env1AttackPercent: 7 }), tEqualizer.zero128()] },
    { name: 'arp6S2', gainDb: -11, pan: -.6, tLibrary: tLibGainAuto, plugins: [zebralette.cMonoSync({ env1AttackPercent: 8 }), tEqualizer.zero128()] },
    { name: 'arp6S3', gainDb: -14, pan: 0.6, tLibrary: tLibGainAuto, plugins: [zebralette.cMonoSync({ env1AttackPercent: 9 }), tEqualizer.zero128()] },
    { name: 'arp6S4', gainDb: -17, pan: -.6, tLibrary: tLibGainAuto, plugins: [zebralette.cMonoSync({ env1AttackPercent: 9 }), tEqualizer.zero128()] },
    // { name: 'arp6S5', gainDb: -12, pan: -.5, plugins: [zebralette.cMonoSync({ env1AttackPercent: 9 })] },
    // { name: 'arp6S6', gainDb: -13, pan: 0.5, plugins: [zebralette.cMonoSync({ env1AttackPercent: 9 })] },
  ]}

  const arpTrackPoly = { name: 'arpPoly', gainDb: -10, plugins: [zebralette.cPop()] }
  return { name: 'All arp tracks', children: [arpTrack, arpTrackSync, arpTrackPoly] }
}


function copyTrackMidiClips(session, source, destination) {
  if (typeof source === 'string') source = session.getTrackByName(source)
  if (typeof destination === 'string') destination = session.getTrackByName(destination)

  for (const midiClip of source.midiClips) {
    destination.midiClips.push(midiClip)
  }
}

module.exports = {
  copyTrackMidiClips,
  makeArp6TLibrary,
  makeArp6TLibraryFromMidiChords,
  makeGlissTracks,
  makeArp6Tracks,
}
