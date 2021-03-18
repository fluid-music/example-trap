const fs = require('fs')
const path = require('path')
const { plugins } = require('fluid-music')

const zebraletteCPopFilename = path.join(__dirname, 'presets', 'zebralette-cpop.fxp')
const zebraletteCPopFxpB64 = fs.readFileSync(zebraletteCPopFilename).toString('base64')

const zebraletteCPop2Filename = path.join(__dirname, 'presets', 'zebralette-cpop2.fxp')
const zebraletteCPop2FxpB64 = fs.readFileSync(zebraletteCPop2Filename).toString('base64')

module.exports = {
  zebralette: {
    /** @param args {import('fluid-music').plugins.ZebraletteVst2Parameters} */
    cPop(params) {
      const zebralette = new plugins.ZebraletteVst2()
      zebralette.vst2.presetBase64 = zebraletteCPopFxpB64
      if (params) zebralette.parameters = params
      return zebralette
    },
    cPop2(params) {
      const zebralette = new plugins.ZebraletteVst2()
      zebralette.vst2.presetBase64 = zebraletteCPop2FxpB64
      if (params) zebralette.parameters = params
      return zebralette
    },
  }
}