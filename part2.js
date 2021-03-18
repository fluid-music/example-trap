
const fluid = require('fluid-music')
const { techniques } = fluid
const tr808 = require('@fluid-music/tr-808')
const rides = require('@fluid-music/rides')

// local packages
const { Stutter, StutterSoftOddEvents, StutterRampIntensityDown, Sequence, makeMidiNoteSequenceStutterTLibrary, tLibraryMap, DelayAcrossTracks } = require('./techniques')
const { zebralette } = require('./presets')
const { MidiNote } = require('fluid-music/built/techniques')

rides.rides.a.audioFile.gainDb = -10
const tLibRides = tLibraryMap(rides.rides, afo => {
  const technique = techniques.AudioFile.copy(afo.audioFile, { startInSourceSeconds: 0.1, fadeInSeconds: 0.1 })
  return  new techniques.Nudge(-0.1, technique)
})

const tLibrary = {
  ...tr808.tLibrary,
  ...{
    '1': new StutterRampIntensityDown(1, new techniques.MidiNote({ note: 39+12 })),
    '2': new StutterRampIntensityDown(2, new techniques.MidiNote({ note: 50+12 })),
    '3': new StutterRampIntensityDown(3, new techniques.MidiNote({ note: 40+12 })),
    '4': new StutterRampIntensityDown(4, new techniques.MidiNote({ note: 42+12 })),
    '5': new StutterRampIntensityDown(5, new techniques.MidiNote({ note: 52+12 })),
    '6': new StutterRampIntensityDown(6, new techniques.MidiNote({ note: 62+12 })),
    '7': new StutterRampIntensityDown(7, new techniques.MidiNote({ note: 52+12 })),
    '8': new StutterRampIntensityDown(8, new techniques.MidiNote({ note: 62+12 })),
    '9': new StutterRampIntensityDown(9, new techniques.MidiNote({ note: 42+12 })),
  }
}

const dLibrary = {
  6: { intensity: 6 / 6},
  5: { intensity: 5 / 6},
  4: { intensity: 4 / 6},
  3: { intensity: 3 / 6},
  2: { intensity: 2 / 6},
  1: { intensity: 1 / 6},
  0: { intensity: 0 / 6},
}

// Create n synth tracks
function pannedTracks(trackName, plugins) {
  return new Array(9).fill(null).map((_, i, all) => {
    const isOdd = !!(i % 2)
    const isFirst = !i
    const frac = i / Math.max(all.length - 1, 1)
    return {
      name: `${trackName}${i}`,
      pan: isFirst ? 0 : (0.65 + frac * 0.2) * (isOdd ? -1 : 1),
      plugins,
      gainDb: frac * -18,
    }
  })
}
const delayAcrossTracksTlib = {}
const session  = new fluid.FluidSession({ bpm: 100, r: 'hhhhh', tLibrary, dLibrary }, [
  { name: 'synA', children: pannedTracks('synA', [zebralette.cPop()]), tLibrary: delayAcrossTracksTlib },
  { name: 'synP', children: pannedTracks('synP', [zebralette.cPop2()]) },
  { name: 'drums', gainDb: -16, tLibrary: tr808.tLibrary, children: [
    { name: 'hat' },
    { name: 'kick' },
    { name: 'bass', tLibrary: tr808.bass },
    { name: 'ride', pan: -0.15, tLibrary: tLibRides },
    { name: 'ridr', pan: 0.15, tLibrary: rides.ridesReverse },
  ]},
])

delayAcrossTracksTlib['a'] = new DelayAcrossTracks(
  3/8,
  new Sequence([
    new StutterRampIntensityDown(7, new MidiNote(48)),
    new StutterRampIntensityDown(6, new MidiNote(48)),
    new StutterRampIntensityDown(5, new MidiNote(48)),
    new StutterRampIntensityDown(4, new MidiNote(50)),
    new StutterRampIntensityDown(3, new MidiNote(50)),
    new StutterRampIntensityDown(6, new MidiNote(50)),
    new StutterRampIntensityDown(7, new MidiNote(50)),
  ]),
  session.getTrackByName('synA'),
)
delayAcrossTracksTlib['b'] = new DelayAcrossTracks(
  3/8,
  new Sequence([
    new StutterRampIntensityDown(7, new MidiNote(47)),
    new StutterRampIntensityDown(6, new MidiNote(47)),
    new StutterRampIntensityDown(5, new MidiNote(47)),
    new StutterRampIntensityDown(4, new MidiNote(50)),
    new StutterRampIntensityDown(3, new MidiNote(50)),
    new StutterRampIntensityDown(6, new MidiNote(50)),
    new StutterRampIntensityDown(7, new MidiNote(50)),
  ]),
  session.getTrackByName('synA'),
)

const tLibA = makeMidiNoteSequenceStutterTLibrary([72, 68, 82, 72])
const tLibB = makeMidiNoteSequenceStutterTLibrary([70, 73, 79, 70])

session.insertScore([{
  tLibrary: tLibA,
  r:     '1 2 3 4 1 2 3 4 1 2 3 4 ',
  d:     '6  5  4  3  2  1  ',
  synA0: '7--      ',//9--',
  synA1: '   6--      ',//7--',
  synA2: '      5--      ',//4--',
  synA3: '         4--      ',//6--',
  synA4: '            3--',
  synA5: '               6--',
  synA6: '                  7--1--',
  synA7: '                        ',
  synA8: '                        ',
  bass: 'G-----',
  ride: '   a--b--c--d--a--b--',
  ridr: 'A--B--C--D--A--B--C--',
}, {
  tLibrary: tLibA,
  r:    '1 2 3 4 1 2 3 4 1 2 3 4 ',
  d:    '6  5  4  3  2  1  .  .  ',
  synA0: '723321',
  synA1: '   6--',
  synA2: '      5--   ',
  synA3: '         433522--',  
  synA4: '               6--7--',
  synA5: '                  7--',
  synA6: '                     8--',
  bass: 'G----',
  ride: '    a---b---c---d---a---',
  ridr: 'a---b---c---d---a---b---',
}, {
  r:    '1 2 3 4 1 2 3 4 1 2 3 4 ',
  synA: 'ab-'
}])

session.editCursorTime = 0
session.finalize()
session.saveAsReaperFile('part2.RPP')
  .then(() => {console.log('saved')})
  .catch(e => {console.log('error saving:', e)})
