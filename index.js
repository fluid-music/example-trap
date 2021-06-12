const fluid = require("fluid-music")
const dLibrary = require("./d-library").dLibrary
const techniques = fluid.techniques
const { dragonflyHall, tStereoDelay, zebralette, tEqualizer, battery4 } = require("./presets")
const { makeArp6Tracks, makeArp6TLibraryFromMidiChords } = require("./components")
const chordLibraries = [
  require("./chords/seven-notes"),
  require("./chords/midi-chords"),
]
require("./util") // Convenience score string/array extensions


/***************
 * Constants
 ***************/

const bpm = 84
const quarterNote = 1 / bpm * 60
const delay8 = quarterNote / 2


/***************
 * Session
 ***************/

const session = new fluid.FluidSession({ bpm, dLibrary }, [
  makeArp6Tracks(bpm), // Arpeggiator tracks from original
  makeArp6Tracks(bpm, "b", zebralette.cLead()), // Copies with different preset
  { name: "chords1", gainDb: -14, plugins: [zebralette.cPad1()]}, // Soft chords
  { name: "chords2", gainDb: -14, plugins: [
    zebralette.cSupersaw(),
    tEqualizer.zero128()
  ]}, // Intense chords
  { name: "drums", gainDb: -2, plugins: [battery4.realestKit()], children: [ // Battery4 drums
    { name: "kick" },
    { name: "snare", gainDb: -9.2 },
    { name: "hat", gainDb: -20 },
    { name: "fx", gainDb: -30 }
  ]},
  { name: "bass", gainDb: -8, plugins: [zebralette.cBass()]}, // Simple bass

  // FX returns
  { name: "delay16th", gainDb: -10, plugins: [tStereoDelay.sixteenth(bpm)] },
  { name: "delay8+16", gainDb: -10, plugins: [tStereoDelay.stereo8and16(bpm)] },
  { name: "verbLong", plugins: [dragonflyHall.long()] },
  { name: "verbShort", gainDb: -25, plugins: [dragonflyHall.short()] },
])

// EQ chords
session.getTrackByName("chords2").plugins[1].setBand2(800, 6, 0.2)

// FX sends for reverb
session.getTrackByName("verbShort").addReceiveFrom(session.getTrackByName("arp6"))
session.getTrackByName("verbShort").addReceiveFrom(session.getTrackByName("arpb"))
session.getTrackByName("verbLong").addReceiveFrom(session.getTrackByName("arp64"), -17)
session.getTrackByName("verbLong").addReceiveFrom(session.getTrackByName("arp6b4"), -17)
session.getTrackByName("verbLong").addReceiveFrom(session.getTrackByName("chords1"), -30)
session.getTrackByName("verbLong").addReceiveFrom(session.getTrackByName("chords2"), -26)


// FX sends for delays
const delay16Track = session.getTrackByName("delay16th")
// arp6 delays
delay16Track.addReceiveFrom(session.getTrackByName("arp6"))
delay16Track.addReceiveFrom(session.getTrackByName("arp62"), -4.5)
delay16Track.addReceiveFrom(session.getTrackByName("arp64"), -7)
// sync delays
delay16Track.addReceiveFrom(session.getTrackByName("arp6S1"), -11)
delay16Track.addReceiveFrom(session.getTrackByName("arp6S4"), -5)
// misc 16th delays
delay16Track.addReceiveFrom(session.getTrackByName("hat"))
delay16Track.addReceiveFrom(session.getTrackByName("All arp tracksb"), -10)
delay16Track.addReceiveFrom(session.getTrackByName("chords1"), -20)


/***************
 * Sections
 ***************/

// Main drop "chorus" section
const drop = {
  arp: {
    tLibrary: makeArp6TLibraryFromMidiChords([delay8, delay8 * 2, delay8 * 3, delay8 * 4], [7, -7, 2, 3], null, chordLibraries[0]),
    arp6:    "a------       b------         c------         d------         e------         f------         e------         e------         ".halfTime(),
  },
  arpb: {
    tLibrary: makeArp6TLibraryFromMidiChords([delay8, delay8 * 2, delay8 * 3, delay8 * 4], [7, -7, 2, 3], null, chordLibraries[0]),
    arp6b:   "a------       b------         c------         d------         e------         f------         e------         e------         ".halfTime(),
  },
  tLibrary: chordLibraries[0],
  d:    "7",
  r:       "1.......+.......2.......+.......3.......+.......4.......+.......".repeat(4),
  chords1: "0---------------1---------------2---------------3---------------4---------------5---------------4---------------4---------------".halfTime(),
  chords2: "0------------                   2---2----   2-----          3-- 4-------    4----       5------ 4-------    4---            4 4 ".halfTime(),
  bass: {
    tLibrary: [43, 38, 36, 35].map((x) => new techniques.MidiNote(x)),
    bass:  "0-------                        1-  1-      1---          1 1       0-      0               0   0   1       2               2 3 ".halfTime(),
  },
  drums: {
    tLibrary: {D: new techniques.MidiNote(36), d: new techniques.MidiNote(35), S: new techniques.MidiChord({notes: [39, 38]}), s: new techniques.MidiNote(40), T: new techniques.MidiNote(44), t: new techniques.MidiNote(44)},
    kick:  "D                               D   D       D             D D   D   D       D               D   D   D       D               D D ".halfTime(),
    snare: "        S                               S                               S                               S                       ".halfTime(),
    hat:   "T T T   T   T   T   T   T   T   T   T   T   T   T   T   T   ttttT T T   T   T t T   T t T   T   T   T t T   T   T   T   tttttttt".repeat(2)
  }
}

// Alternate elements for variations
const altHat = "T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T ttttT T T T T T T t T T T t T T T T T T T t T T T T T T T T tttttttt".repeat(2)
const baseSnare = "S".repeat(16)
const rampSnare =  baseSnare.halfTime().halfTime().halfTime() + baseSnare.halfTime().halfTime() + baseSnare.halfTime() + baseSnare.halfTime().slice(16) + baseSnare.slice(8) + "S"

const tMute = new fluid.techniques.TrackGainAutomation({ gainDb: -Infinity })

// Mute all arp tracks by adding a single automation point
const arp6Tracks = ["arp6", "arp61", "arp62", "arp63", "arp64"].map(name => session.getTrackByName(name))
const arp6bTracks = ["arp6b", "arp6b1", "arp6b2", "arp6b3", "arp6b4"].map(name => session.getTrackByName(name))
const arpSTracks = ["arp6S", "arp6S1", "arp6S2", "arp6S3", "arp6S4"].map(name => session.getTrackByName(name))
const arpSbTracks = ["arp6Sb", "arp6Sb1" , "arp6Sb2", "arp6Sb3", "arp6Sb4"].map(name => session.getTrackByName(name))
arp6bTracks.forEach(trackName => session.useTechnique(tMute, { track: trackName }))
arp6Tracks.forEach(trackName => session.useTechnique(tMute, { track: trackName }))
arpSTracks.forEach(trackName => session.useTechnique(tMute, { track: trackName }))
arpSbTracks.forEach(trackName => session.useTechnique(tMute, { track: trackName }))

// Intro template from the drop structure
const intro = {
  ...drop,
  r: drop.r,
  arp: {
    tLibrary: makeArp6TLibraryFromMidiChords([delay8, delay8 * 2, delay8 * 3, delay8 * 4], [7, -7, 2, 3], null, chordLibraries[0]),
    arp6: drop.arp.arp6
  },
  arpb: {
    ...drop.arpb,
    tLibrary: makeArp6TLibraryFromMidiChords([delay8, delay8 * 2, delay8 * 3, delay8 * 4], [7, -7, 2, 3], null, chordLibraries[0]),
  },
  chords2: undefined,
  bass: undefined,
  drums: undefined
}

// Make transposed intro variants
const makeIntro = (t=0) => {
  const i = intro
  i.arp.tLibrary = makeArp6TLibraryFromMidiChords([delay8, delay8 * 2, delay8 * 3, delay8 * 4], [7 + t, -7 + t, 2 + t, 3 + t], null, chordLibraries[0])
  return i
}

// Fade out all tracks
const fadeOutAllTracks = (duration=8) => {
  session.tracks.map((track) => track.name).forEach((track) => session.useTechnique(new fluid.techniques.TrackGainAutomationRamp({ gainDb: -Infinity, curve: -0.5 }), { track, startTime: session.editCursorTime + 0.01, duration }))
}


/***************
 * Score
 ***************/

// Intro 1: @ unison
session.useTechnique(tMute, {track: "chords1"})
session.insertScore({...makeIntro(), drums: {tLibrary: {D: new techniques.MidiNote(77), F: new techniques.MidiNote(74)}, kick: "D", fx: "F"}})
arp6bTracks.forEach(trackName => session.useTechnique(tMute, { track: trackName }))

// Intro 2: up a diatonic third
session.insertScore(makeIntro(2))
var tracks = ["arp6b", "arp6b1", "arp6b2", "arp6b3", "arp6b4"]
tracks.forEach((trackName) => session.useTechnique(tMute, { track: trackName }))

// Intro 3: up a diatonic sixth
session.insertScore(makeIntro(5))
var tracks = ["arp6b3", "arp6b4"]
tracks.forEach((trackName) => session.useTechnique(tMute, { track: trackName }))
session.useTechnique(new fluid.techniques.TrackGainAutomation({ gainDb: -20}), {track: "arp6b"})
session.useTechnique(new fluid.techniques.TrackGainAutomation({ gainDb: -20}), {track: "arp6b1"})
session.useTechnique(new fluid.techniques.TrackGainAutomation({ gainDb: -20}), {track: "arp6b2"})
session.useTechnique(new fluid.techniques.TrackGainAutomation({ gainDb: 0}), {track: "chords1"})
session.useTechnique(new fluid.techniques.TrackGainAutomationRamp({ gainDb: 6, curve: 0.8 }), { track: "chords1", startTime: session.editCursorTime + 0.01, duration: 3 })

// Intro 4: octave up
session.insertScore({...makeIntro(7), drums: {tLibrary: {S: new techniques.MidiNote(64), F: new techniques.MidiNote(78)}, snare: rampSnare, fx: "F"}})
session.useTechnique(new fluid.techniques.TrackGainAutomation({ gainDb: -20}), {track: "arp6b3"})
session.useTechnique(new fluid.techniques.TrackGainAutomation({ gainDb: -20}), {track: "arp6b4"})
arp6bTracks.forEach(trackName => session.useTechnique(new fluid.techniques.TrackGainAutomation({ gainDb: -20}), { track: trackName }))
arp6bTracks.forEach(trackName => session.useTechnique(tMute, { track: trackName }))
arp6Tracks.forEach(trackName => session.useTechnique(new fluid.techniques.TrackGainAutomation({ gainDb: 6}), { track: trackName }))
session.useTechnique(new fluid.techniques.TrackGainAutomationRamp({ gainDb: 0, curve: 0.8 }), { track: "chords1", startTime: session.editCursorTime + 0.01, duration: 0 })

// Drop section
session.insertScore({...drop, arp: undefined, drums: {...drop.drums, tLibrary: {...drop.drums.tLibrary, F: new techniques.MidiNote(74)}, fx: "F"}})
session.insertScore({...drop, arp: undefined, drums: {...drop.drums, hat: altHat}})
arp6bTracks.forEach(trackName => session.useTechnique(new fluid.techniques.TrackGainAutomation({ gainDb: -20}), { track: trackName }))
arp6bTracks.forEach(trackName => session.useTechnique(new fluid.techniques.TrackGainAutomation({ gainDb: -6}), { track: trackName }))
session.insertScore({...drop, drums: {...drop.drums, hat: altHat}})
session.insertScore({...drop, drums: {...drop.drums, hat: altHat}, chords2: drop.chords2.slice(0, 15 * 16)})

// Interlude section
fadeOutAllTracks()
session.insertScore({...drop, chords2: undefined, arp: undefined, arpb: undefined})
session.insertScore({...drop, chords2: undefined, arp: undefined, arpb: undefined})


/***************
 * Output
 ***************/

session.finalize()
session.saveAsReaperFile("fluid-demotrapremix")
  .then(() => console.log("done"))
  .catch((e) => { throw e })
