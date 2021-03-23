const fluid = require('fluid-music')

const { dragonflyHall } = require('./presets')
const { makeGlissTracks, makeArp6Tracks, makeArp6TLibrary, makeArp6TLibrary2 } = require('./components')

const bpm = 58
const session = new fluid.FluidSession({ bpm }, [
  makeArp6Tracks(bpm),
  makeGlissTracks(),
  { name: 'verbLong', plugins: [dragonflyHall.long()] },
  { name: 'verbShort', gainDb: -25, plugins: [dragonflyHall.short()] },
])
// session.getTrackByName('verbShort').addReceiveFrom(session.getTrackByName('arp6'), -30)
// session.getTrackByName('verbLong').addReceiveFrom(session.getTrackByName('gliss'), -18)


session.insertScore({
  tLibrary: makeArp6TLibrary2(bpm),
  r:    '1.....2.....3.....4',
  d:    '76543 65432 ',
  arp6: [ {r: '1234', arp6: 'A'}],
}).insertScore({
  r: '12341234',
  d: '7   8   ',
  arp6: ['aabbccdd'],
}).insertScore({
  tLibrary: fluid.tLibrary.fromArray([
    [0, 7, 9, null],
    [-1, 0, 12, null],
    [-1, 0, 7, null],
    [-1, 0, 7, 9],
  ].map(intervals => makeArp6TLibrary(bpm, 60, intervals))),
  r:    '12341234',
  arp6: 'abbccdd',
})

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
