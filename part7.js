const fluid = require('fluid-music')
const { converters, random } = fluid
const { range } = converters
const dLibrary = require('./d-library').dLibrary
const kit = require('@fluid-music/kit')
const { dragonflyHall } = require('./presets')
const { makeGlissTracks, makeArp6Tracks, makeArp6TLibrary, makeArp6TLibraryFromMidiChords } = require('./components')
const chordLibraries = [
  require('./chords/seven-notes'),
  require('./chords/midi-chords'),
]

const bpm = 70
const quarterNote = 1 / bpm * 60
const delay32 = quarterNote / 8
const delay8 = quarterNote / 2
const delay7 = quarterNote / 7
const delays4times7over32 = [delay32 * 7, delay32 * 14, delay32 * 21, delay32 * 28]

const session = new fluid.FluidSession({ bpm, dLibrary }, [
  makeArp6Tracks(bpm),
  { name: 'drums', gainDb: -5.2, tLibrary: kit.tLibrary, children: [
    { name: 'kick' },
    { name: 'snare', gainDb: -8.5 },
    { name: 'hat', gainDb: -11 },
  ]},
  { name: 'verbLong', plugins: [dragonflyHall.long()] },
  { name: 'verbShort', gainDb: -25, plugins: [dragonflyHall.short()] },
])
session.getTrackByName('verbShort').addReceiveFrom(session.getTrackByName('arp6'))
session.getTrackByName('verbLong').addReceiveFrom(session.getTrackByName('arp64'), -17)

const scoreADefaultTLibrary = makeArp6TLibraryFromMidiChords([delay32 * 7, delay32 * 14, delay32 * 21, delay32 * 28], [7, -7, 2, 3], null, chordLibraries[0])
const scoreA = {
  tLibrary: scoreADefaultTLibrary,
  d:    '7',
  r:    '1...+...2...+...3...+...4...+...1...+...2...+...3...+...4...+...1...+...2...+...3...+...4...+...1...+...2...+...3...+...4...+...1...+...+...',
  arp6: 'a------                            b------                            c------                            d------                            ',
}
const scoreADrums = {
  drums: {
  kick: 'D------              d------       D             d------              D------              d------       D             d------              ',
  snare:'       s            s       s           sss                    s             s            s       s            ss             s           ss',
  hat: {
  hat:  ' tttttt tttttt tttttt tttttt tttttt tttttt tttttt tttttt tttttt tttttt tttttt tttttt tttttt tttttt tttttt tttttt tttttt tttttt tttttt tttttt',
  d:    ' 494847 494745 494745 494745 494745 494745 494847 494745 494745 494745 494745 349474 494847 494745 494745 494745 494745 494745 494847 494745',
  },
  tLibrary: kit.tLibrary,
  }
}


session.insertScore({
  tLibrary: makeArp6TLibraryFromMidiChords([delay7 * 4, delay7 * 7, delay7 * 11, delay7 * 15], [7, -7, 2, 3], null, chordLibraries[0]),
  d:    '7',
  r:    '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4 1++',//1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4 1++
  arp6: ['a-              b-    c-    d-    ', '        e             d-'],
})

scoreA.tLibrary = makeArp6TLibraryFromMidiChords(delays4times7over32, [7, -7, 2, 3], null, chordLibraries[0],  [0, 2, 3, 5, 7, 8, 3])
session.insertScore(scoreA)

scoreA.tLibrary = makeArp6TLibraryFromMidiChords(delays4times7over32, [7, -7, 2, 3], null, chordLibraries[0],  [0, 2, 3, 5, 7, 3])
session.insertScore(scoreA)

scoreA.tLibrary = makeArp6TLibraryFromMidiChords(delays4times7over32, [1, -1, 2, 3], null, chordLibraries[0],  [0, 3, 5, 10])
session.insertScore(scoreA)

scoreA.tLibrary = makeArp6TLibraryFromMidiChords(delays4times7over32, [7, -7, 2, 3], null, chordLibraries[0],  [0, 2, 3, 5, 7, 3])
session.insertScore(scoreA)


scoreA.drums = scoreADrums
scoreA.tLibrary = makeArp6TLibraryFromMidiChords(delays4times7over32, [7, -2, 2, 3], null, chordLibraries[0],  [0, 2, 3, 5, 7])
session.insertScore(scoreA)

scoreA.tLibrary = makeArp6TLibraryFromMidiChords(delays4times7over32, [1, -2, 2, -1], null, chordLibraries[0],  [0, -2, 2, 3, 7, 5, 8])
session.insertScore(scoreA)

session.insertScore({
  tLibrary: makeArp6TLibraryFromMidiChords([delay8, delay8 * 2, delay8 * 3, delay8 * 4], [7, -7, 2, 3], null, chordLibraries[0]),
  d:    '7',
  r:    '1...+...2...+...3...+...4...+...1...+...2...+...3...+...4...+...1...+...2...+...',
  arp6: 'a------             b------             c------             d------   ',
  drums: {
  kick: 'D------              D------    d---    D------              D------    d---    ',
  snare:'       s------      s       s         ss       s------      s       s         ss',
  hat: {
  hat:  ' tttttt tttttt tttttt tttttt tttttt tttt tttttt tttttt tttttt tttttt ttttttttttt',
  d:    ' 494847 494745 494745 494745 494745 4947 494847 494745 494745 494745 49474534947',
  },
  tLibrary: kit.tLibrary,
  }
})

session.insertScore({
  tLibrary: makeArp6TLibraryFromMidiChords([delay8, delay8 * 2, delay8 * 3, delay8 * 4], [7, -7, 2, 3], null, chordLibraries[0]),
  d:    '7',
  r:    '1...+...2...+...3...+...4...+...1...+...2...+...3...+...4...+...1...+...2...+...3...+...4...+...1...+...2...+...3...+...4...+...',
  arp6: 'e------             f------             g------             a------              ',
  drums: {
  kick: 'D------                 d------         D------                 d------          ',
  snare:'        s              s              ss        s              s              ss ',
  hat: {
  hat:  ' ttttttt ttttttt ttttttt ttttttttttttttt ttttttt ttttttt ttttttt ttttttttttttttt',
  d:    ' 4948474 4947454 4947454 494745424947454 4948474 4947454 4947454 494745424947454',
  },
  tLibrary: kit.tLibrary,
  }
})


// Random experiments after this point!

session.insertScore({
  tLibrary: makeArp6TLibraryFromMidiChords([delay8, delay8 * 2, delay8 * 3, delay8 * 4], [2, 0, -2, 0], null, chordLibraries[1]),
  d:    '7',
  r:    '1...+...2...+...3...+...4...+...1...+...2...+...3...+...1...+...2...+...3...+...',
  arp6: 'a------             b------             c------             d------   ',
  drums: {
  kick: 'D------                 d------         D------                 d------         ',
  snare:'        s              s              ss        s              s              ss',
  hat: {
  hat:  ' ttttttt ttttttt ttttttt ttttttttttttttt ttttttt ttttttt ttttttt ttttttttttttttt',
  d:    ' 4948474 4947454 4947454 494745424947454 4948474 4947454 4947454 494745424947454',
  },
  tLibrary: kit.tLibrary,
  }
})

session.insertScore({
  tLibrary: makeArp6TLibraryFromMidiChords([delay8, delay8 * 2, delay8 * 3, delay8 * 4], [-1,-2,-3,-4], null, chordLibraries[0]),
  d:    '7',
  r:    '1...+...2...+...3...+...4...+...1...+...2...+...3...+...1...+...2...+...3...+...',
  arp6: 'a------             b------             c------             d------   ',
  drums: {
  kick: 'D------                 d------         D------                 d------         ',
  snare:'        s              s              ss        s              s              ss',
  hat: {
  hat:  ' ttttttt ttttttt ttttttt ttttttttttttttt ttttttt ttttttt ttttttt ttttttttttttttt',
  d:    ' 4948474 4947454 4947454 494745424947454 4948474 4947454 4947454 494745424947454',
  },
  tLibrary: kit.tLibrary,
  }
})

session.insertScore({
  tLibrary: makeArp6TLibraryFromMidiChords([delay7 * 2, delay7 * 4, delay7 * 6], [-1,-2,-3], null, chordLibraries[1]),
  d:    '7',
  r:    '1......+......2......+......3......+......4......+......1......+......2......+......3......+......',
  arp6: '              a------             b                   b------             d------   ',
})  


delay5 = delay7 / 2 * 5
session.insertScore({
  tLibrary: makeArp6TLibraryFromMidiChords([delay5, delay5 * 2, delay5 * 3], [-1,-2,-3], null, chordLibraries[1]),
  d:    '7',
  r:    '1......+......2......+......3......+......4......+......1......+......2......+......3......+......',
  arp6: '              a------             b                   b------             d------   ',
})  

delay6 = delay7 / 2 * 6
session.insertScore({
  tLibrary: makeArp6TLibraryFromMidiChords([delay6, delay6 * 2, delay6 * 3], [-1,-2,-3], null, chordLibraries[1]),
  d:    '7',
  r:    '1......+......2......+......3......+......4......+......1......+......2......+......3......+......',
  arp6: '              a------             b                   b------             d------   ',
})  

session.insertScore({
  tLibrary: makeArp6TLibraryFromMidiChords([delay7/2*7, delay7*7, delay7 /2*3*7], [-1,-7,-3], null, chordLibraries[1]),
  d:    '7',
  r:    '1......+......2......+......3......+......4......+......1......+......2......+......3......+......',
  arp6: '              a------             b                   b------             d------   ',
})  

session.insertScore({
  tLibrary: makeArp6TLibraryFromMidiChords([delay7/2, delay7, delay7 /2*3], [-1,-7,-3], null, chordLibraries[1]),
  d:    '7',
  r:    '1......+......2......+......3......+......4......+......1......+......2......+......3......+......',
  arp6: '              a------             b                   b------             d------   ',
}) 

session.insertScore({
  tLibrary: makeArp6TLibraryFromMidiChords([quarterNote, quarterNote * 2, quarterNote * 3], [2,-7,3], null, chordLibraries[1]),
  d:    '7',
  r:    '1......+......2......+......3......+......4......+......1......+......2......+......3......+......',
  arp6: '              a------             b                   b------             d------   ',
}) 

session.insertScore({
  tLibrary: makeArp6TLibraryFromMidiChords([delay7 * 2, delay7 * 4, delay7 * 6, delay7 * 8 ], [7, -7, 2, 3], null, chordLibraries[0]),
  d:    '7',
  r:    '1 2 3 4 1 2 3 4 ',
  arp6: 'a   b   c   d   ',
})

session.finalize()
session.saveAsReaperFile('part7')
  .then(() => console.log('done'))
  .catch((e) => { throw e })
