const fluid = require('fluid-music')

const { dragonflyHall } = require('./presets')
const { makeGlissTracks, makeArp6Tracks, makeArp6TLibrary, makeArp6TLibraryFromMidiChords } = require('./components')

const bpm = 58
const quarterNote = 1 / bpm * 60
const delay13 = quarterNote * 2/6
const delays13 = [delay13 * .96, delay13 * 1.04]
const delay27 = quarterNote * 2/7
const delays27 = [delay27 * 0.96, delay27 * 1.04]
const delaysAlpha = [quarterNote / 2, quarterNote]
const delay7 = quarterNote / 7

const session = new fluid.FluidSession({ bpm }, [
  makeArp6Tracks(bpm),
  makeGlissTracks(),
  { name: 'verbLong', plugins: [dragonflyHall.long()] },
  { name: 'verbShort', gainDb: -25, plugins: [dragonflyHall.short()] },
])
session.getTrackByName('verbShort').addReceiveFrom(session.getTrackByName('arp6'))
// session.getTrackByName('verbLong').addReceiveFrom(session.getTrackByName('gliss'), -18)


session.insertScore({
  tLibrary: makeArp6TLibrary(bpm, 0, 0),
  r:    '12341234',
  arp6: ['aabbccdd'],
})

session.insertScore({
  tLibrary: makeArp6TLibrary(bpm, 2, 4),
  r:    '12341234',
  arp6: ['aabbccdd'],
})

session.insertScore({
  tLibrary: makeArp6TLibrary(bpm, 0, 4),
  r:    '1..2.....3........4..',
  arp6: 'a  b     c        abc',
})

session.insertScore({
  tLibrary: makeArp6TLibraryFromMidiChords(delays27, [0, 0], null, require('./chords/initial')),
  r:    '1 2 3 4 1 2 3 4 ',
  arp6: 'f g h i f-g-h-i-',
})

session.insertScore({
  tLibrary: makeArp6TLibraryFromMidiChords([delay7 * 2, delay7 * 4, delay7 * 6, delay7 * 8, delay7 * 10], [2, -1, 6, 3, 10], null, require('./chords/initial')),
  r:    '1 2 3 4 1 2 3 4 ',
  arp6: 'f  g  h  i',
})

session.insertScore({
  tLibrary: makeArp6TLibraryFromMidiChords(delays13, [0, 0], 6, require('./chords/initial')),
  r:    '1 2 3 4 1 2 3 4 ',
  arp6: 'f g h i f-g-h-i-',
})

session.insertScore({r: '1234', arp6: ''})

session.insertScore({
  r: '1 2 3 4 1 2 3 4 ',
  n: 'n---------------',
  p: 'b-- a-- b--   0 ',
})

session.editCursorTime = 0
session.finalize()
session.saveAsReaperFile('part5')
  .then(() => console.log('done'))
  .catch((e) => { throw e })
