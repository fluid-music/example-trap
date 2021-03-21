const fluid = require('fluid-music')

const { glissandoTrack, arpTrack } = require('./components')

const session = new fluid.FluidSession({ bpm: 75 }, [
  glissandoTrack,
  arpTrack,
])

session.insertScore({
  r: '1234',
  d: '7888',
  arp: 'A B ',
})

session.insertScore({
  r: '1 2 3 4 ',
  n: 'n-------',
  p: 'a 0 a 0 ',
})

session.editCursorTime = 0
session.finalize()
session.saveAsReaperFile('part5')
