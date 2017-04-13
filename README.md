## CMview.js

A javascript interactive contact map viewer. Uses [NGL](https://github.com/arose/ngl) to interact with a 3D view of the protein.

CMview is based on SVG and powered by [D3](https://d3js.org/)

See it in action:

* [Web application](https://rcsb.github.io/cmviewjs/)

Demo
-----
### a)Creating cmcontroller object.
```js
var spanfordisplay = "clickedatom";
var nglvp = "nglviewport";
var nglurl = "rcsb://5sx3.mmtf";
var chainName = "A";
var cutoff = 8;
var cmsvgvp = "svgviewport";
//url for local file method
var cmurl = "http://localhost:8000/examples/5sx3.json";
//max length for cmsvg.
var maxLength = 700;
var cmcontroller = new cmController(spanfordisplay, nglvp, nglurl, chainName, cutoff, cmsvgnvp, cmurl, maxLength);
```

Note: Enabling both zoom and selection function at the same time will cause conflict.
### b)Enable zoom function
```js
cmcontroller.zoom(1);
```

### c)Disable zoom function
```js
cmcontroller.zoom(0);
```

### d)Enable selection function
```js
cmcontroller.brush(1);
```

### c)Disable selection function
```js
cmcontroller.brush(0);
```



