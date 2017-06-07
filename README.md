## CMview.js

A javascript interactive contact map viewer. Uses [NGL](https://github.com/arose/ngl) to interact with a 3D view of the protein.

CMview.js is based on SVG and powered by [D3](https://d3js.org/)

CMview.js uses [rollup.js](https://rollupjs.org/) to bundle application.

Need to install [npm](https://www.npmjs.com/) before using CMview.js

Feature
-----
- Support single protein and multiple structure contact map display.

- Support fasta format input for multiple sequence alignment. 

- Display contact distance and side chain while mouse hover.

- Display atom information while clicking on protein structure in NGL.

- Support contact map zoom in. 

- Support contact selection and display distance and side chain.


See it in action:

* [Web application](https://rcsb.github.io/cmviewjs/)


Generating cmview.js file
-----

1. After downloading or cloning cmviewjs, use command line and go to the cmviewjs folder.

2. Use the command "npm install" to generate cmview.js file. (The file will be inside the "dist" folder)

3. Import the file into html file and follow the demo below for tutorial on how to use cmview.js.


Embedding
-----
```html
<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="ngl.dev.js"></script>
<script src ="cmview.js"></script>
<div id="nglviewport" ></div>
<div id="svgviewport" ></div>
<span id="clickedatom" ></span>
```


Demo
-----
### a)Creating cmcontroller object.
```js
//Span for displaying clicked atom information when clicking protein structure in NGL.
var spanfordisplay = "clickedatom";
//The div for NGL.
var nglvp = "nglviewport";
//The array to store ngl url for each PDB input. Should be in the format: "rcsb://PDBID.mmtf".
var nglurlist = ["rcsb://4knd.mmtf","rcsb://2i4a.mmtf"];
//The array to store chain for each PDB input.
var chainlist = ["A","A"];
//The array to store PDB ID for each PDB input.
var pdbidlist = ["4knd","2i4a"];
//The cutoff value for contact.
var cutoff = 8;
//The div for contact map. 
var cmsvgvp = "svgviewport";
//max length for cmviewport and max length for nglviewport.
var maxLength = 700;
//alignment strings in fasta format for multiple sequence alignment
var alignstr = ">4KND:A|PDBID|CHAIN|SEQUENCE\n--DVVVLQDSTFEQEVLKSDTPVLVDFWAVWCGPCKAIAPVVDDLAARYKGKLKVAKMDVDQHQGVPQQYGIRSIPTLLVFKGGRVVDTVIGADKTR\n-LEDSVKKAIG\n>2I4A:A|PDBID|CHAIN|SEQUENCE\nSEHTLAVSDSSFDQDVLKASGLVLVDFWAEWCGPCKMIGPALGEIGKEFAGKVTVAKVNIDDNPETPNAYQVRSIPTLMLVRDGKVIDKKVGALPKSQLKAWVESAQ-";

var cmcontroller = new CMV.cmController(spanfordisplay, nglvp, nglurllist, chainlist, pdbidlist, cutoff, cmsvgnvp, maxLength, alignstr);

//Note: The order of the input for: nglurllist, chainlist, pdbidlist, and alignArr should be the same. (In this case: 0 is for 4knd, 1 is for 2i4a)
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

### e)Disable selection function
```js
cmcontroller.brush(0);
```



