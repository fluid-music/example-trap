# Fluid Music Trap Examples

Trap music example using the [Fluid Music](https://fluid-music.github.io/) framework.

First, install the prerequisites:

- [RoughRider 3](https://www.audiodamage.com/pages/free-downloads) (free compressor plugin)
- [Podolski](https://u-he.com/products/podolski/) (free synthesizer plugin)
- [Dragonfly Room Reverb](https://michaelwillis.github.io/dragonfly-reverb/) (free reverb plugin. [See MacOS Catalina+ help](https://github.com/michaelwillis/dragonfly-reverb/issues/70))
- [Valhalla Freq Echo](https://valhalladsp.com/shop/delay/valhalla-freq-echo/) (free delay plugin)
- [cybr](https://github.com/fluid-music/cybr) (the Fluid Music audio server)

This example configures VST presets, so you need to run the cybr server. After installing the plugins, scan them, and then start an instance of the `cybr` server. If `cybr` crashes when scanning plugins, try running the scan again. Most of the time, it will skip over the plugins that caused the crash.

```
cybr --scan-plugins
cybr --list-plugins # verify plugins were found
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

<img width="1033" alt="Screen Shot 2021-06-19 at 9 33 44 PM" src="https://user-images.githubusercontent.com/1512520/122660066-0e25a580-d14c-11eb-80b4-24a5dbc06b20.png">
