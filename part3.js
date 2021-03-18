const fluid = require('fluid-music')
const { techniques, FluidSession } = fluid
const tr808 = require('@fluid-music/tr-808')
const rides = require('@fluid-music/rides')

// local packages
const { Stutter, StutterSoftOddEvents, StutterRampIntensityDown, Sequence, makeMidiNoteSequenceStutterTLibrary, tLibraryMap, DelayAcrossTracks } = require('./techniques')
const { zebralette } = require('./presets')
const { dLibrary } = require('./d-library')
const { MidiNote } = require('fluid-music/built/techniques')

const tLibraryBass = {
  g: tr808.bass.g,
  a: techniques.AudioFile.copy(tr808.bass.g, { pitchSemitones: 2 })
}

const tLibrarySynth = fluid.tLibrary.midiScale()
tLibrarySynth.s = new StutterRampIntensityDown(7, new MidiNote(57))
tLibrarySynth.a = new techniques.SendAutomation({ to: 'verb', value: 0})
tLibrarySynth.b = new techniques.SendAutomation({ to: 'verb', value: -6, curve: -0.5 })
tLibrarySynth.c = new techniques.SendAutomation({ to: 'verb', value: -12, curve: -0.5 })
tLibrarySynth.d = new techniques.SendAutomation({ to: 'v2', value: -12, curve: -0.5 })
tLibrarySynth.e = new techniques.SendAutomationRamp({ to: 'verb', value: 1.2345 })

const tLibraryVerb = {
  b: new techniques.PluginAutomationRamp(fluid.plugins.DragonflyHallVst2.makeAutomation.sizeMeters(30)),
  c: new techniques.PluginAutomationRamp({ value: 15, paramKey: 'sizeMeters', plugin: fluid.plugins.DragonflyHallVst2 }),
  a: new techniques.PluginAutomationRamp({ value: 10, paramKey: 'sizeMeters', plugin: 'DragonflyHallReverb' }),
}
const session = new FluidSession({ bpm : 100, dLibrary }, [
  { name: 'synth', plugins: [zebralette.cPop2()], tLibrary: tLibrarySynth },
  { name: 'bass', tLibrary: tr808.bass, tLibrary: tLibraryBass },
  { name: 'verb', tLibrary: tLibraryVerb, plugins: [ new fluid.plugins.DragonflyHallVst2({ lateLevelPercent: 100, sizeMeters: 10 })] },
  { name: 'v2' },
])

session.insertScore([
  {
    r:    '1234',
    d:     '6   ',
    bass: ['    ', 'a---'],
    synth:['   s', '0---', 'abdc', 'e-'],
    verb: ['    ', 'a---', 'b-c '],
  }
])

session.finalize()
// session.saveAsTracktionFile('part3')
session.saveAsReaperFile('part3')
  .then(() => console.log('saved'))
  .catch(e => console.error('error:', e))
