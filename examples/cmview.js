(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.CMV = global.CMV || {})));
}(this, (function (exports) { 'use strict';

/**
 * This is a closure base class for creating an object for contact map using svg.
 * @class
 * @param {String} cmvp1 - The div assign for the contact map objct.
 * @param {String} ngl1 - The NGL object that is connected to the contact map.
 * @param {String} pdburl - The url to get contact map data.
 * @param {String} chainName - The chain ID. 
 */

/*global d3*/
/*eslint-disable no-unused-vars*/
function cmSvg(cmvp1, ngl1, pdburl, chainName) {
	//main data variables
	var residuesize;
	var cmsvgdata;
	var ngl = ngl1;
	var svgurl = pdburl;
	var nglsvgdata = ngl1.svgdata();
	var residue1name;
	var chain = chainName;
	var residueindex;
	var resinscode;
	var svgsize;
	var cmvp = cmvp1;

	//contact map initilization variables
	var rects1blue;
	var classlinex;
	var classliney;
	var bAxisGroup;
	var rAxisGroup;
	var svgContainer;
	var bAxis;
	var rAxis;
	var translateVar = [0, 0, 0];
	var zoomon = 0;
	var unit;
	var axisScale;

	//brush global variables
	var disrep;
	var licrep;
	var atomPair1 = [];
	var sidechainselec1 = "(";

	/**
  * Function for initialization of contact map.
  * @param {String} cmvp1 - The div assign for the contact map objct.
  * @param {Integer} size - The length of the protein 
  * @param {Integer} svgsize1 - viewport size for the contactmap. (svgsize1 = width = height)
  * @param {Array} residue1 - An array that contains residue number that has contact with residue2.
  * @param {Array} residue2 - An array that contains residue number that has contact with residue1.
  * @param {Array} residuerectdata - An array that contains contacts from residue1 and residue2.
  */
	function initResData(cmvp1, size, svgsize1, residue1, residue2, residuerectdata) {
		svgsize = svgsize1;

		//calculating unit
		var residueToSvg = d3.scaleLinear().domain([0, size]).range([0, svgsize]);

		unit = svgsize / size;

		//creating svg
		var inputvp = "#" + cmvp1;
		svgContainer = d3.select("#svgviewport").append("svg").attr("width", svgsize).attr("height", svgsize);

		//mouse hover
		var coordx;
		var coordy;
		var mousetag = 0;
		var repr;
		var repr1;
		var divtag = 0;
		var div;
		function mouseover(p) {

			//creating and deleting div
			if (divtag === 0) {
				//div for tooltips
				//.style("text-align", "center")
				div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0).style("position", "absolute").style("text-align", "center").style("width", "110px").style("height", "15px").style("padding", "5px").style("font", "12px sans-serif").style("background", "#FFDAB9").style("border-radius", "8px");
			}
			if (divtag === 1) {
				div.remove();
				div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0).style("position", "absolute").style("text-align", "center").style("width", "110px").style("height", "15px").style("padding", "5px").style("font", "12px sans-serif").style("background", "#FFDAB9").style("border-radius", "8px");
			}
			divtag = 1;

			//change opacity when mouse over
			d3.select(this).style("opacity", 0.5);

			coordx = p[0];
			coordy = p[1];

			//showing distance and sidechain on ngl when mouse over in contact map
			if (mousetag === 1) {
				ngl.getStructureComp().removeRepresentation(repr);
				ngl.getStructureComp().removeRepresentation(repr1);
			}

			var inputx, inputy, sidechainx, sidechainy;

			//checking if this residueindex has inscode
			if (resinscode[coordx] === 1) {
				//getting the resno
				var resxindex = residueindex[coordx].substring(0, residueindex[coordx].length - 1);
				//getting the letter
				inputx = resxindex + "^" + residueindex[coordx].slice(-1) + ".CA";
				sidechainx = resxindex + "^" + residueindex[coordx].slice(-1) + ":" + chain;
			}

			if (resinscode[coordy] === 1) {
				var resyindex = residueindex[coordy].substring(0, residueindex[coordy].length - 1);
				inputy = resyindex + "^" + residueindex[coordy].slice(-1) + ".CA";
				sidechainy = resyindex + "^" + residueindex[coordy].slice(-1) + ":" + chain;
			}

			if (resinscode[coordx] !== 1) {
				inputx = residueindex[coordx] + "^" + ".CA";
				sidechainx = residueindex[coordx] + "^" + ":" + chain;
			}

			if (resinscode[coordy] !== 1) {
				inputy = residueindex[coordy] + "^" + ".CA";
				sidechainy = residueindex[coordy] + "^" + ":" + chain;
			}

			var atomPair = [[inputx, inputy]];

			var sidechainselec = "(" + sidechainx + " or " + sidechainy + ")";
			repr = ngl.getStructureComp().addRepresentation("distance", { atomPair: atomPair });
			repr1 = ngl.getStructureComp().addRepresentation("licorice", { sele: sidechainselec });
			mousetag = 1;

			//tooltip box
			//				.duration(200)
			div.transition().style("opacity", .9);
			div.text(residueindex[p[0]] + " " + residue1name[p[0]] + ", " + residueindex[p[1]] + " " + residue1name[p[1]]).style("left", d3.event.pageX + "px").style("top", d3.event.pageY - 30 + "px");
		}

		//tooltip disapear when mouseout
		function mouseout() {
			//tooltip disapear
			//.duration(100)
			div.transition().style("opacity", 0);

			div.remove();

			//change the opacity back to 1 when mouseout
			d3.select(this).style("opacity", 1);

			//clear ngl
			ngl.getStructureComp().removeRepresentation(repr);
			ngl.getStructureComp().removeRepresentation(repr1);
		}

		//drawing only one background gray rect with white lines
		var grayrectdata = [];
		grayrectdata.push([0, 0]);
		var rectsgray = svgContainer.append("g").attr("class", "gray");
		var rects = rectsgray.selectAll("rect").data(grayrectdata).enter().append("rect");
		rects.attr("x", function (d) {
			return d[0];
		}).attr("y", function (d) {
			return d[1];
		}).attr("height", svgsize).attr("width", svgsize).style("fill", "#eee");

		//creating lines
		var linedata = [];
		for (var i = 0; i < svgsize; i = i + unit) {
			linedata.push([i, 0]);
		}

		classlinex = svgContainer.append("g").attr("class", "linex");
		var classlinexs = classlinex.selectAll("line").data(linedata).enter().append("line");
		classlinexs.attr("x1", function (d) {
			return d[0];
		}).attr("y1", function (d) {
			return d[1];
		}).attr("x2", function (d) {
			return d[0];
		}).attr("y2", svgsize).attr("stroke", "white").attr("stroke-width", unit / 10);

		classliney = svgContainer.append("g").attr("class", "liney");
		var classlineys = classliney.selectAll("line").data(linedata).enter().append("line");
		classlineys.attr("y1", function (d) {
			return d[1];
		}).attr("y1", function (d) {
			return d[0];
		}).attr("x2", svgsize).attr("y2", function (d) {
			return d[0];
		}).attr("stroke", "white").attr("stroke-width", unit / 10);

		//creating scale for axis 
		//domain: length of the residue, range: length of svgcontainer
		axisScale = d3.scaleLinear().domain([0, size]).range([0, svgsize]);

		bAxis = d3.axisBottom().scale(axisScale).tickFormat(function (i) {
			return residueindex[i];
		});
		rAxis = d3.axisRight().scale(axisScale).tickFormat(function (i) {
			return residueindex[i];
		});
		bAxisGroup = svgContainer.append("g").call(bAxis);
		rAxisGroup = svgContainer.append("g").call(rAxis);

		//drawing the blue residue rect
		rects1blue = svgContainer.append("g").attr("class", "blue");
		var rects1 = rects1blue.selectAll("rect").data(residuerectdata).enter().append("rect");
		rects1.attr("x", function (d) {
			return residueToSvg(d[0]);
		}).attr("y", function (d) {
			return residueToSvg(d[1]);
		}).attr("height", unit).attr("width", unit).style("fill", "steelblue").on("mouseover", mouseover).on("mouseout", mouseout);
	}

	/**
  * Brushstart when mouse click and drag.
  */
	function brushstart() {
		var s = d3.event.selection;
		var xstart, xend, ystart, yend;

		//clear everything
		d3.selectAll(".blue").selectAll("rect").style("fill", "steelblue");
		ngl.getStructureComp().removeRepresentation(disrep);
		ngl.getStructureComp().removeRepresentation(licrep);
		atomPair1 = [];
		sidechainselec1 = "";

		//when zoom already started
		if (zoomon === 1) {
			xstart = Math.floor((s[0][0] - translateVar[0]) / translateVar[2]);
			xend = Math.floor((s[1][0] - translateVar[0]) / translateVar[2]);
			ystart = Math.floor((s[0][1] - translateVar[1]) / translateVar[2]);
			yend = Math.floor((s[1][1] - translateVar[1]) / translateVar[2]);
		}
		//when zoom havent started yet
		if (zoomon === 0) {
			xstart = Math.floor(s[0][0]);
			xend = Math.floor(s[1][0]);
			ystart = Math.floor(s[0][1]);
			yend = Math.floor(s[1][1]);
		}

		//saving representation info while dragging
		d3.selectAll(".blue").selectAll("rect").each(function (d) {
			if (d[0] * unit >= xstart && d[0] * unit <= xend && d[1] * unit >= ystart && d[1] * unit <= yend) {
				d3.select(this).style("fill", "PaleVioletRed");

				var inputx, inputy, sidechainx, sidechainy;
				if (resinscode[d[0]] === 1) {
					var resxindex = residueindex[d[0]].substring(0, residueindex[d[0]].length - 1);
					inputx = resxindex + "^" + residueindex[d[0]].slice(-1) + ".CA";
					sidechainx = resxindex + "^" + residueindex[d[0]].slice(-1) + ":" + chain;
				}

				if (resinscode[d[1]] === 1) {
					var resyindex = residueindex[d[1]].substring(0, residueindex[d[1]].length - 1);
					inputy = resyindex + "^" + residueindex[d[1]].slice(-1) + ".CA";
					sidechainy = resyindex + "^" + residueindex[d[1]].slice(-1) + ":" + chain;
				}

				if (resinscode[d[0]] !== 1) {
					inputx = residueindex[d[0]] + "^" + ".CA";
					sidechainx = residueindex[d[0]] + "^" + ":" + chain;
				}

				if (resinscode[d[1]] !== 1) {
					inputy = residueindex[d[1]] + "^" + ".CA";
					sidechainy = residueindex[d[1]] + "^" + ":" + chain;
				}

				atomPair1.push([inputx, inputy]);
				sidechainselec1 = sidechainselec1 + sidechainx + " or " + sidechainy + " or ";
			}
		});
	}
	/**
  * Brushend when release mouse.
  */
	function brushend() {
		if (!d3.event.selection) {
			//clear everything when click on gray rect
			d3.selectAll(".blue").selectAll("rect").style("fill", "steelblue");
			atomPair1 = [];
			sidechainselec1 = "";
			ngl.getStructureComp().removeRepresentation(disrep);
			ngl.getStructureComp().removeRepresentation(licrep);
			//svgContainer.selectAll(".brush").call(brush.move, null);
		} else {
			sidechainselec1 = sidechainselec1.substring(0, sidechainselec1.length - 3);
			sidechainselec1 = sidechainselec1 + ")";
			if (sidechainselec1 !== ")") {
				disrep = ngl.getStructureComp().addRepresentation("distance", { atomPair: atomPair1 });
				licrep = ngl.getStructureComp().addRepresentation("licorice", { sele: sidechainselec1 });
			}
		}
	}

	/**
  * Function for selecting residue in the contact map.
  * @param {Integer} brushon - 0 to disable the function and 1 to enable the function.
  */
	function brush(brushon) {

		if (brushon === 1) {
			var brush = d3.brush().on("start brush", brushstart).on("end", brushend);
			svgContainer.append("g").attr("class", "brush").call(brush);
		} else {
			d3.selectAll(".blue").selectAll("rect").style("fill", "steelblue");
			atomPair1 = [];
			sidechainselec1 = "";
			ngl.getStructureComp().removeRepresentation(disrep);
			ngl.getStructureComp().removeRepresentation(licrep);
			d3.selectAll(".brush").remove();
		}
	}

	/**
  * Tranform components when zoom function is called.
  */
	function zoomed() {
		//saving transform identity
		translateVar[0] = d3.event.transform.x;
		translateVar[1] = d3.event.transform.y;
		translateVar[2] = d3.event.transform.k;
		//applying zoom
		rects1blue.attr("transform", d3.event.transform);
		classlinex.attr("transform", d3.event.transform);
		classliney.attr("transform", d3.event.transform);
		bAxisGroup.call(bAxis.scale(d3.event.transform.rescaleX(axisScale)));
		rAxisGroup.call(rAxis.scale(d3.event.transform.rescaleY(axisScale)));
	}

	/**
  * Zoom function for contact map.
  * @param {Integer} zoomtag - 0 to disable the function and 1 to enable the function.
  */
	function zoom(zoomtag) {
		//zoom function
		if (zoomtag === 1) {
			zoomon = 1;
			var zoomfactor;
			if (residuesize <= 200) {
				//zoomfactor = 2;
				zoomfactor = 100;
			}
			if (residuesize > 200) {
				//zoomfactor = size/100;
				zoomfactor = 100;
			}

			var zoom = d3.zoom().scaleExtent([1, zoomfactor]).translateExtent([[0, 0], [svgsize, svgsize]]).on("zoom", zoomed);

			svgContainer.call(zoom);
		} else {
			svgContainer.call(d3.zoom().on("zoom", null));
		}
	}

	/**
  * Function to prepare data for contact map.
  * @param {Integer} tag - 0 to use local file, 1 to get contact map data from NGL.
  * @param {Integer} svgsize1 - viewport size for the contactmap. (svgsize1 = width = height)
  */
	function loadsvg(tag, svgsize1) {
		//"http://localhost:8000/examples/5sx3.json"
		//using local file		
		//D3 json method
		if (tag === 0) {
			d3.json(svgurl, function (data) {

				//getting res size
				var size = data.ressize;

				//D3 Json method
				var residue1 = data.residue1;
				var residue2 = data.residue2;

				//creating residuedataset
				var residuerectdata = [];
				for (var k = 0; k < residue1.length; k++) {
					residuerectdata.push([residue1[k], residue2[k]]);
					residuerectdata.push([residue2[k], residue1[k]]);
				}

				//set data and residuesize
				cmsvgdata = data;
				residuesize = size;

				initResData(cmvp1, size, svgsize1, residue1, residue2, residuerectdata);
			});
		}

		//NGL Method
		if (tag === 1) {

			//Set contacts
			var residue1 = nglsvgdata.residue1;
			var residue2 = nglsvgdata.residue2;
			residue1name = nglsvgdata.residue1name;

			//creating residuedataset
			var residuerectdata = [];
			for (var k = 0; k < residue1.length; k++) {
				residuerectdata.push([residue1[k], residue2[k]]);
			}

			residueindex = nglsvgdata.resindex;
			resinscode = nglsvgdata.resinscode;
			//Set res size
			var size = residueindex.length;

			//set data and residuesize
			cmsvgdata = nglsvgdata;
			residuesize = size;

			initResData(cmvp1, size, svgsize1, residue1, residue2, residuerectdata);
		}
	}

	this.loadsvg = function (tag, svgsize1) {
		loadsvg(tag, svgsize1);
	};

	this.zoom = function (zoomtag) {
		zoom(zoomtag);
	};

	this.brush = function (brushon) {
		brush(brushon);
	};

	this.getcmdata = function () {
		return cmsvgdata;
	};

	this.getresiduesize = function () {
		return residuesize;
	};
}

/**
 * This is a closure base class for creating an object for NGL.
 * @class
 * @param {String} clickedatom1 - The span for displaying clicked atom information.
 * @param {String} vp - The div assign for the NGL objct.
 * @param {String} pdburl - The url for NGL data. Ex. protein 5sx3: "rcsb://5sx3.mmtf"
 * @param {String} chain - Chain ID for the protein. ex. A, B
 * @param {Integer} cutoffvalue - Cut off value for generating contact.
 */

/*global d3*/
/*global NGL*/
/*eslint-disable no-unused-vars*/
function cmNgl(clickedatom1, vp, pdburl, chain, cutoffvalue) {
	var stage;
	var structurecomp;
	var nglviewport = vp;
	var nglurl = pdburl;
	var res1 = [];
	var res2 = [];
	var chainid = chain;
	var cutoff = Number(cutoffvalue);
	var svgdata = {};
	var res1name = [];
	var resindex = [];
	var resinscode = [];
	var clickedatom = clickedatom1;
	svgdata['residue1'] = res1;
	svgdata['residue2'] = res2;
	svgdata['residue1name'] = res1name;
	svgdata['resindex'] = resindex;
	svgdata['resinscode'] = resinscode;

	/**
  * Load function to load NGL data from the url to the viewport.
  */
	function loadngl() {
		//pdburl1 = "rcsb://5sx3.mmtf";
		stage = new NGL.Stage(nglviewport);
		var nglpromise = stage.loadFile(nglurl).then(function (o) {

			//load only one chain with color schme: residueindex
			structurecomp = o;
			var cartoonsele = ":" + chainid;
			var ballsticksele = ":" + chainid + " and " + "hetero and not ( water or ion )";
			structurecomp.addRepresentation("cartoon", { color: "residueindex", quality: "auto", aspectRatio: 5, scale: 0.7, colorScale: "RdYlBu", sele: cartoonsele });
			structurecomp.addRepresentation("base", { colorScale: "RdYlBu", quality: "auto" });
			structurecomp.addRepresentation("ball+stick", { sele: ballsticksele, colorScheme: "element", scale: 2.0, aspectRatio: 1.5, bondScale: 0.3, bondSpacing: 0.75, quality: "auto" });
			structurecomp.centerView();

			//calculating the contact for contact map.
			calContacts(structurecomp);
		});

		//mouseevent for ngl
		mouseclick();

		return nglpromise;
	}

	/**
  * Mouse click event to show the clicked residue.
  */
	function mouseclick() {
		var clickedresno;
		stage.signals.clicked.add(function (pickingData) {
			if (pickingData.atom) {
				clickedresno = pickingData.atom.residueIndex;

				d3.selectAll(".blue").selectAll("rect").style("fill", "steelblue");
				//i = id of the rect
				//d = data insert into rect 
				//d3.selectAll("rect").each(function(d,i){
				d3.selectAll("rect").each(function (d) {
					if (d[0] === clickedresno || d[1] === clickedresno) {
						d3.select(this).style("fill", "orange");
					}
				});
				var atominfo = "Clicked atom: " + "[" + pickingData.atom.resname + "]" + pickingData.atom.resno + pickingData.atom.inscode + ":" + pickingData.atom.chainname + ".CA";
				document.getElementById(clickedatom).innerHTML = atominfo;
			} else {
				d3.selectAll(".blue").selectAll("rect").style("fill", "steelblue");
				document.getElementById(clickedatom).innerHTML = "Clicked nothing";
				//d3.selectAll(".selection").attr("display", "none");		
				//d3.selectAll(".brush").call(brush.clear());
			}
		});
	}

	/**
  * Function to calculate contacts.
  */
	function calContacts(structurecomp) {
		var structure = structurecomp.structure;
		var withinAtom = structure.getAtomProxy();

		structure.eachAtom(function (atom) {
			var singleAtomSelection = new NGL.Selection("@" + atom.index + " and .CA");
			//Getting all the contact between ^ and other CA atoms
			var withinAtomSet = structure.getAtomSetWithinSelection(singleAtomSelection, cutoff);
			//Going through the contacts
			var maxRes = 0;
			withinAtomSet.forEach(function (idx) {
				withinAtom.index = idx;
				//getting only .CA atom and one chain
				if (withinAtom.chainname === chainid && atom.chainname === chainid && withinAtom.atomname === "CA" && atom.atomname === "CA") {

					if (withinAtom.residueIndex !== atom.residueIndex) {

						//Saving contact as two seperate arrays
						res1.push(atom.residueIndex);
						res2.push(withinAtom.residueIndex);

						//Saving residue name by residue index
						res1name[atom.residueIndex] = atom.resname;
						//Saving residue number + residue inscode by residue index
						resindex[atom.residueIndex] = atom.resno + atom.inscode;

						if (withinAtom.inscode != "") {
							//array to check if this residue index has inscode
							resinscode[withinAtom.residueIndex] = 1;
						}
					}
				}
			});
		});
	}

	this.loadngl = function () {
		return loadngl();
	};

	this.getStructureComp = function () {
		return structurecomp;
	};

	this.getStage = function () {
		return stage;
	};

	this.res1 = function () {
		return res1;
	};

	this.res2 = function () {
		return res2;
	};

	this.svgdata = function () {
		return svgdata;
	};
}

/**
 * This is a closure base class for creating an controller object for contact map.
 * @class
 * @param {String} clickedatom1 - The span for displaying clicked atom information.
 * @param {String} nglvp - The div assign for the NGL objct.
 * @param {String} nglurl - The url for NGL data. Ex. protein 5sx3: "rcsb://5sx3.mmtf"
 * @param {String} chain - Chain ID for the protein. ex. A, B
 * @param {Integer} cutoffvalue - Cut off value for generating contact.
 * @param {String} cmvp1 - The div assign for the contact map objct.
 * @param {String} cmurl - The url to get contact map data.
 * @param {Integer} maxLength - The max length of the cmvp div. 
 */
//import cmNgl "./cmngl";
//import cmSvg "./cmsvg";
/* exported cmController */
/*eslint-disable no-unused-vars*/
function cmController(clickedatom1, nglvp, nglurl, chain, cutoffvalue, cmvp1, cmurl, maxLength) {
	var cmngl = new cmNgl(clickedatom1, nglvp, nglurl, chain, cutoffvalue);
	var cmsvg;
	cmngl.loadngl().then(function () {
		var cmsvgobj1 = new cmSvg("svgviewport", cmngl, cmurl, chain);
		cmsvg = cmsvgobj1;
		//cmcontroller = new cmController(svgobj, nglobj);
		ctloadcmsvg(1, maxLength);
	});

	/**
  * Getter function for cmsvg.
  */
	function getcmsvg() {
		return cmsvg;
	}

	this.getcmsvg = function () {
		getcmsvg();
	};

	/**
  * Getter function for cmngl.
  */
	function getcmngl() {
		return cmngl;
	}

	this.getcmngl = function () {
		getcmngl();
	};

	/**
  * Function to call loadngl of NGL object.
  */
	function ctloadngl() {
		cmngl.loadngl();
	}

	this.ctloadngl = function () {
		ctloadngl();
	};
	/**
  * Function to call loadsvg of cmsvg object.
  * @param {Integer} tag - 0 to use local file, 1 to get contact map data from NGL.
  * @param {Integer} svgsize1 - viewport size for the contactmap. (svgsize1 = width = height)
  */
	function ctloadcmsvg(tag, svgsize1) {
		/*global Promise*/
		var svgpromise = new Promise(function (resolve) {
			cmsvg.loadsvg(tag, svgsize1);
			resolve();
		});
		return svgpromise;
	}

	this.ctloadcmsvg = function (tag, svgsize1) {
		return ctloadcmsvg(tag, svgsize1);
	};

	/**
  * Function to call zoom function of cmsvg object.
  * @param {Integer} zoomtag - 0 to disable, 1 to enable the function.
  */
	function ctzoomsvg(zoomtag) {
		cmsvg.zoom(zoomtag);
	}

	this.zoom = function (zoomtag) {
		ctzoomsvg(zoomtag);
	};

	/**
  * Function to call brush function of cmsvg object.
  * @param {Integer} brushon - 0 to disable, 1 to enable the function.
  */
	function ctbrushsvg(brushon) {
		cmsvg.brush(brushon);
	}

	this.brush = function (brushon) {
		ctbrushsvg(brushon);
	};
}

/*
 * This is the main entry point for your package.
 *
 * You can import other modules here, including external packages. When
 * bundling using rollup you can mark those modules as external and have them
 * excluded or, if they have a jsnext:main entry in their package.json (like
 * this package does), let rollup bundle them into your dist file.
 */

//import { add } from './utils.js';

exports.cmSvg = cmSvg;
exports.cmNgl = cmNgl;
exports.cmController = cmController;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=cmview.js.map
