const fluid = require('fluid-music')
const dLibrary = require('./d-library').dLibrary
const kit = require('@fluid-music/kit')
const { dragonflyHall } = require('./presets')
const { makeGlissTracks, makeArp6Tracks, makeArp6TLibrary, makeArp6TLibraryFromMidiChords } = require('./components')

const bpm = 40
const quarterNote = 1 / bpm * 60
const delay8 = quarterNote / 2
const delay13 = quarterNote * 2/6
const delays13 = [delay13 * .96, delay13 * 1.04]
const delay27 = quarterNote * 2/7
const delays27 = [delay27 * 0.96, delay27 * 1.04]
const delaysAlpha = [quarterNote / 2, quarterNote]
const delay7 = quarterNote / 7

const session = new fluid.FluidSession({ bpm, dLibrary }, [
  makeArp6Tracks(bpm),
  { name: 'drums', tLibrary: kit.tLibrary, children: [
    { name: 'kick' },
    { name: 'snare' },
  ]},
  { name: 'verbLong', plugins: [dragonflyHall.long()] },
  { name: 'verbShort', gainDb: -25, plugins: [dragonflyHall.short()] },
])
session.getTrackByName('verbShort').addReceiveFrom(session.getTrackByName('arp6'))
session.getTrackByName('verbLong').addReceiveFrom(session.getTrackByName('arp64'), -17)



session.insertScore({
  tLibrary: makeArp6TLibraryFromMidiChords([delay7 * 2, delay7 * 4, delay7 * 6, delay7 * 8 ], [7, -7, 2, 3], null, require('./chords/seven-notes')),
  d:    '7',
  r:    '1 2 3 4 1 2 3 4 1 2 3 4 ',
  arp6: 'a       b     c   d     ',
})
session.insertScore({
  tLibrary: makeArp6TLibraryFromMidiChords([delay8, delay8 * 2, delay8 * 3, delay8 * 4], [7, -7, 2, 3], null, require('./chords/seven-notes')),
  d:    '7',
  r:    '1 2 3 4 1 2 3 4 ',
  arp6: 'a   b   c   d   ',
})
session.insertScore({
  tLibrary: makeArp6TLibraryFromMidiChords([delay7 * 2, delay7 * 4, delay7 * 6, delay7 * 8 ], [7, -7, 2, 3], null, require('./chords/seven-notes')),
  d:    '7',
  r:    '1 2 3 4 1 2 3 4 ',
  arp6: 'a   b   c   d   ',
})

session.editCursorTime = 0
session.finalize()
session.saveAsReaperFile('part6')
  .then(() => console.log('done'))
  .catch((e) => { throw e })
