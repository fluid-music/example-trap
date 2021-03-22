const fluid = require('fluid-music')

const { dragonflyHall } = require('./presets')
const { makeGlissTracks, makeArpTracks } = require('./components')

const bpm = 58
const session = new fluid.FluidSession({ bpm }, [
  makeArpTracks(bpm),
  makeGlissTracks(),
  { name: 'verbLong', plugins: [dragonflyHall.long()] },
  { name: 'verbShort', gainDb: -25, plugins: [dragonflyHall.short()] },
])
session.getTrackByName('verbShort').addReceiveFrom(session.getTrackByName('arps'), -30)
session.getTrackByName('verbLong').addReceiveFrom(session.getTrackByName('gliss'), -18)


session.insertScore({
  r: '12341234',
  d: '7       ',
  arp: ['AABBCCDD', ''],
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
