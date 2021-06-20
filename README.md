# Fluid Music Trap Examples

Trap music example using the [Fluid Music](https://fluid-music.github.io/) framework.

First, install the prerequisites:

- [RoughRider 3](https://www.audiodamage.com/pages/free-downloads) (free compressor plugin)
- [Podolski](https://u-he.com/products/podolski/) (free synthesizer plugin)
- [cybr](https://github.com/fluid-music/cybr) (the Fluid Music audio server)

This example configures VST presets, so you need to run the cybr server. After installing the plugins, scan them, and then start an instance of the `cybr` server. If `cybr` crashes when scanning plugins, try running the scan again. Most of the time, it will usually skip over the plugins that caused the crash.

```
cybr --scan-plugins
cybr --list-plugins # verify RoughRider 3 and Podolski were found
cybr -f             # start the fluid music server
```

Leave `cybr` running, open a new terminal tab, and run the following:

```
git clone https://github.com/fluid-music/example-trap.git
cd example-trap
npm install
node example-1.js
node example-2.js
```

This will generate `trap-example-1.RPP` and `trap-example-2.RPP` which can be opened in [Reaper](https://reaper.fm).
