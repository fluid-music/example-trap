const fs = require("fs")
const path = require("path")
const { plugins } = require("fluid-music")
const { Battery4Vst2 } = require("@fluid-music/battery-4")

const zebraletteCPopFilename = path.join(__dirname, "presets", "zebralette-cpop.fxp")
const zebraletteCPopFxpB64 = fs.readFileSync(zebraletteCPopFilename).toString("base64")

const zebraletteCPop2Filename = path.join(__dirname, "presets", "zebralette-cpop2.fxp")
const zebraletteCPop2FxpB64 = fs.readFileSync(zebraletteCPop2Filename).toString("base64")

const zebraletteCMonoFilename = path.join(__dirname, "presets", "zebralette-cmono.FXP")
const zebraletteCMonoFxpB64 = fs.readFileSync(zebraletteCMonoFilename).toString("base64")

const zebraletteCMonoSyncFilename = path.join(__dirname, "presets", "zebralette-cmono-sync.FXP")
const zebraletteCMonoSyncFxpB64 = fs.readFileSync(zebraletteCMonoSyncFilename).toString("base64")

const zebraletteSupersawFilename = path.join(__dirname, "presets", "supersaw.FXP")
const zebraletteSupersawFxpB64 = fs.readFileSync(zebraletteSupersawFilename).toString("base64")

const zebraletteBassFilename = path.join(__dirname, "presets", "bass.FXP")
const zebraletteBassFxpB64 = fs.readFileSync(zebraletteBassFilename).toString("base64")

const zebraletteLeadFilename = path.join(__dirname, "presets", "lead.FXP")
const zebraletteLeadFxpB64 = fs.readFileSync(zebraletteLeadFilename).toString("base64")

const zebralettePad1Filename = path.join(__dirname, "presets", "pad1.FXP")
const zebralettePad1FxpB64 = fs.readFileSync(zebralettePad1Filename).toString("base64")

const teq128Filename = path.join(__dirname, "presets", "teq-128.FXP")
const teq128B64 = fs.readFileSync(teq128Filename).toString("base64")

const teq12678Filename = path.join(__dirname, "presets", "teq-12678.FXP")
const teq12678B64 = fs.readFileSync(teq12678Filename).toString("base64")

const dfHallLong = path.join(__dirname, "presets", "dfhall-long.FXP")
const dfHallLongFxpB64 = fs.readFileSync(dfHallLong)
const dfHallShort = path.join(__dirname, "presets", "dfhall-short.FXP")
const dfHallShortFxpB64 = fs.readFileSync(dfHallShort)

const dmxKitFilename = path.join(__dirname, "presets", "dmxkit.FXP")
const dmxKitFxpB64 = fs.readFileSync(dmxKitFilename).toString("base64")

const realestKitFilename = path.join(__dirname, "presets", "realestkit.FXP")
const realestKitFxpB64 = fs.readFileSync(realestKitFilename).toString("base64")

module.exports = {
  zebralette: {
    /** @param args {import("fluid-music").plugins.ZebraletteVst2Parameters} */
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
    cSupersaw(params) {
      const zebralette = new plugins.ZebraletteVst2()
      zebralette.vst2.presetBase64 = zebraletteSupersawFxpB64
      if (params) zebralette.parameters = params
      return zebralette
    },
    cBass(params) {
      const zebralette = new plugins.ZebraletteVst2()
      zebralette.vst2.presetBase64 = zebraletteBassFxpB64
      if (params) zebralette.parameters = params
      return zebralette
    },
    cLead(params) {
      const zebralette = new plugins.ZebraletteVst2()
      zebralette.vst2.presetBase64 = zebraletteLeadFxpB64
      if (params) zebralette.parameters = params
      return zebralette
    },
    cPad1(params) {
      const zebralette = new plugins.ZebraletteVst2()
      zebralette.vst2.presetBase64 = zebralettePad1FxpB64
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
  },
  battery4: {
    dmxKit(params) {
      const plugin = new Battery4Vst2()
      plugin.vst2.presetBase64 = dmxKitFxpB64
      if (params) plugin.parameters = params
      return plugin
    },
    realestKit(params) {
      const plugin = new Battery4Vst2()
      plugin.vst2.presetBase64 = realestKitFxpB64
      if (params) plugin.parameters = params
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