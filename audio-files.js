const path = require('path')
const { AudioFile } = require('fluid-music').techniques
module.exports = {
  "bw.wav": new AudioFile({ path: path.join(__dirname, path.normalize("bw.wav")), info: {"tagTypes":[],"trackInfo":[],"container":"WAVE","codec":"IEEE_FLOAT","bitsPerSample":32,"sampleRate":44100,"numberOfChannels":2,"bitrate":705600,"lossless":true,"numberOfSamples":249063,"duration":5.647687074829932} }),
};
