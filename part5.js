const fluid = require('fluid-music')

const { dragonflyHall } = require('./presets')
const { makeGlissTracks, makeArpTracks } = require('./components')

const bpm = 75
const session = new fluid.FluidSession({ bpm }, [
  makeArpTracks(bpm),
  makeGlissTracks(),
  { name: 'verbLong', plugins: [dragonflyHall.long()] },
  { name: 'verbShort', plugins: [dragonflyHall.short()] },
])
session.getOrCreateTrackByName('verbLong').addReceiveFrom(session.getTrackByName('arp'), -12)


session.insertScore({
  r: '1234',
  d: '7888',
  arp: 'A B ',
})

session.insertScore({
  r: '1 2 3 4 ',
  n: 'n-------',
  p: 'a---   0',
})

session.editCursorTime = 0
session.finalize()
session.saveAsReaperFile('part5')
  .then(() => console.log('done'))
  .catch((e) => { throw e })
