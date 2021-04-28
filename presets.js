const fs = require('fs')
const path = require('path')
const { plugins } = require('fluid-music')

const zebraletteCPopFilename = path.join(__dirname, 'presets', 'zebralette-cpop.fxp')
const zebraletteCPopFxpB64 = fs.readFileSync(zebraletteCPopFilename).toString('base64')

const zebraletteCPop2Filename = path.join(__dirname, 'presets', 'zebralette-cpop2.fxp')
const zebraletteCPop2FxpB64 = fs.readFileSync(zebraletteCPop2Filename).toString('base64')

const zebraletteCMonoFilename = path.join(__dirname, 'presets', 'zebralette-cmono.FXP')
const zebraletteCMonoFxpB64 = fs.readFileSync(zebraletteCMonoFilename).toString('base64')

const zebraletteCMonoSyncFilename = path.join(__dirname, 'presets', 'zebralette-cmono-sync.FXP')
const zebraletteCMonoSyncFxpB64 = fs.readFileSync(zebraletteCMonoSyncFilename).toString('base64')

const teq128Filename = path.join(__dirname, 'presets', 'teq-128.FXP')
const teq128B64 = fs.readFileSync(teq128Filename).toString('base64')

const teq12678Filename = path.join(__dirname, 'presets', 'teq-12678.FXP')
const teq12678B64 = fs.readFileSync(teq12678Filename).toString('base64')

const dfHallLong = path.join(__dirname, 'presets', 'dfhall-long.FXP')
const dfHallLongFxpB64 = fs.readFileSync(dfHallLong)
const dfHallShort = path.join(__dirname, 'presets', 'dfhall-short.FXP')
const dfHallShortFxpB64 = fs.readFileSync(dfHallShort)

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
    cMono(params) {
      const zebralette = new plugins.ZebraletteVst2()
      zebralette.vst2.presetBase64 = zebraletteCMonoFxpB64
      if (params) zebralette.parameters = params
      return zebralette
    },
    cMonoSync(params) {
      const zebralette = new plugins.ZebraletteVst2()
      zebralette.vst2.presetBase64 = zebraletteCMonoSyncFxpB64
      if (params) zebralette.parameters = params
      return zebralette
    },
    automationTechnique: {
      cMonoSyncBase() {
        return [
          plugins.ZebraletteVst2.makeAutomation.osc1SpectraFX2ValPercent(-85),
          plugins.ZebraletteVst2.makeAutomation.osc1SyncTune(12.82),
        ]
      }
    },
  },

  dragonflyHall: {
    long(params) {
      const plugin = new plugins.DragonflyHallVst2(params)
      plugin.vst2.presetBase64 = dfHallLongFxpB64
      return plugin
    },
    short(params) {
      const plugin  = new plugins.DragonflyHallVst2(params)
      plugin.vst2.presetBase64 = dfHallShortFxpB64
      return plugin
    },
  },

  tStereoDelay: {
    sixteenth(bpm) {
      const plugin = new plugins.TStereoDelayVst2({ ...tStereoDelayBase })
      plugin.parameters.lDelayMs = 60000 / bpm / 4
      plugin.parameters.rDelayMs = (60000 / bpm / 4) + 1.5
      return plugin
    },
    stereo8and16(bpm) {
      const plugin = new plugins.TStereoDelayVst2({ ...tStereoDelayBase })
      plugin.parameters.lDelayMs = 60000 / bpm / 2
      plugin.parameters.rDelayMs = 60000 / bpm / 4
      return plugin
    }
  },
  tEqualizer: {
    /**
     * A zeroed equalizer plugin with three bands enabled
     * - Band 1: 80   hz low shelf
     * - Band 2: 300  hz peak notch
     * - Band 8: 4000 hz high shelf
     */
    zero128() {
      const plugin = new plugins.TEqualizerVst2()
      plugin.vst2.presetBase64 = teq128B64
      return plugin
    },
    /**
     * A zeroed equalizer plugin with five bands enabled
     * - Band 1: 80   hz low shelf
     * - Band 2: 300  hz peak notch
     * - Band 6: 1000 hz peak notch
     * - Band 7: 2500 hz peak notch
     * - Band 8: 4000 hz high shelf
     */
    zero12678() {
      const plugin  = new plugins.TEqualizerVst2()
      plugin.vst2.presetBase64 = teq12678B64
      return plugin
    },
  }
}

const tStereoDelayBase = {
  dryDb: -50,
  wetDb: 0,
  sync: 0,
  lFeedbackPercent: 54,
  rFeedbackPercent: 54,
  lCrossFbPercent: 12,
  rCrossFbPercent: 12,
  lLowCutHz: 200,
  rLowCutHz: 200,
  lHighCutHz: 9000,
  rHighCutHz: 11000,
}