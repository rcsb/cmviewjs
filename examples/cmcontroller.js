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

/* exported cmController */
/*eslint-disable no-unused-vars*/
//clickedatom1, vp, pdburl, chain, cutoffvalue
//cmsvg1, ngl
function cmController(clickedatom1, nglvp, nglurl, chain, cutoffvalue, cmvp1, cmurl, maxLength){

	var cmngl = new cmNgl(clickedatom1 ,nglvp, nglurl, chain, cutoffvalue);
	var cmsvg;
	cmngl.loadngl().then(function(){
		var cmsvgobj1 = new cmSvg("svgviewport", cmngl, cmurl, chain);
		cmsvg = cmsvgobj1;
		//cmcontroller = new cmController(svgobj, nglobj);
		ctloadcmsvg(2, maxLength);
	});

	/*
	cmngl.loadmsa().then(function(){
		var cmsvgobj1 = new cmSvg("svgviewport", cmngl, cmurl, chain);
		cmsvg = cmsvgobj1;
		ctloadcmsvg(1, maxLength);
	});*/



	/**
	 * Getter function for cmsvg.
	 */
	function getcmsvg(){
		return cmsvg;
	}

	this.getcmsvg = function(){
		getcmsvg();
	}

	/**
	 * Getter function for cmngl.
	 */
	function getcmngl(){
		return cmngl;
	}

	this.getcmngl = function(){
		getcmngl();
	}	

	/**
	 * Function to call loadngl of NGL object.
	 */
	function ctloadngl(){
		cmngl.loadngl();
	}

	this.ctloadngl = function(){
		ctloadngl();
	}
	/**
	 * Function to call loadsvg of cmsvg object.
	 * @param {Integer} tag - 0 to use local file, 1 to get contact map data from NGL.
	 * @param {Integer} svgsize1 - viewport size for the contactmap. (svgsize1 = width = height)
	 */
	function ctloadcmsvg(tag, svgsize1){
		/*global Promise*/
		var svgpromise = new Promise(function(resolve){
			cmsvg.loadsvg(tag, svgsize1);
			resolve();
		});
		return svgpromise;
	}

	this.ctloadcmsvg = function(tag, svgsize1){
		return ctloadcmsvg(tag, svgsize1);
	}

	/**
	 * Function to call zoom function of cmsvg object.
	 * @param {Integer} zoomtag - 0 to disable, 1 to enable the function.
	 */	
	function ctzoomsvg(zoomtag){
		cmsvg.zoom(zoomtag);
	}

	this.zoom = function(zoomtag){
		ctzoomsvg(zoomtag);
	}

	/**
	 * Function to call brush function of cmsvg object.
	 * @param {Integer} brushon - 0 to disable, 1 to enable the function.
	 */	
	function ctbrushsvg(brushon){
		cmsvg.brush(brushon);
	}

	this.brush = function(brushon){
		ctbrushsvg(brushon);
	}
}
























































































function cmController1(clickedatom1, nglvp, nglurllist, chainlist, pdbidlist, cutoffvalue, cmvp1, maxLength, alignArr){

	/*var cmngl = new cmNgl(clickedatom1 ,nglvp, nglurl, chain, cutoffvalue);
	var cmsvg;
	cmngl.loadngl().then(function(){
		var cmsvgobj1 = new cmSvg("svgviewport", cmngl, cmurl, chain);
		cmsvg = cmsvgobj1;
		//cmcontroller = new cmController(svgobj, nglobj);
		ctloadcmsvg(2, maxLength);
	});*/
	
	var cmngl1 = new cmNgl1(clickedatom1, nglvp, nglurllist, chainlist, cutoffvalue);
	//cmngl1.loadmsa();
	var cmsvg;
	
	cmngl1.loadmsa().then(function(){
		var cmsvgobj1 = new cmSvg1("svgviewport", cmngl1, alignArr, pdbidlist);
		cmsvg = cmsvgobj1;

		if(alignArr[0].length === 0){
			ctloadcmsvg(1, maxLength);
		}
		else{
			ctloadcmsvg(2, maxLength);
		}
	});



	/**
	 * Getter function for cmsvg.
	 */
	function getcmsvg(){
		return cmsvg;
	}

	this.getcmsvg = function(){
		getcmsvg();
	}

	/**
	 * Getter function for cmngl.
	 */
	function getcmngl(){
		return cmngl;
	}

	this.getcmngl = function(){
		getcmngl();
	}	

	/**
	 * Function to call loadngl of NGL object.
	 */
	function ctloadngl(){
		cmngl.loadngl();
	}

	this.ctloadngl = function(){
		ctloadngl();
	}
	/**
	 * Function to call loadsvg of cmsvg object.
	 * @param {Integer} tag - 0 to use local file, 1 to get contact map data from NGL.
	 * @param {Integer} svgsize1 - viewport size for the contactmap. (svgsize1 = width = height)
	 */
	function ctloadcmsvg(tag, svgsize1){
		/*global Promise*/
		var svgpromise = new Promise(function(resolve){
			cmsvg.loadsvg(tag, svgsize1);
			resolve();
		});
		return svgpromise;
	}

	this.ctloadcmsvg = function(tag, svgsize1){
		return ctloadcmsvg(tag, svgsize1);
	}

	/**
	 * Function to call zoom function of cmsvg object.
	 * @param {Integer} zoomtag - 0 to disable, 1 to enable the function.
	 */	
	function ctzoomsvg(zoomtag){
		cmsvg.zoom(zoomtag);
	}

	this.zoom = function(zoomtag){
		ctzoomsvg(zoomtag);
	}

	/**
	 * Function to call brush function of cmsvg object.
	 * @param {Integer} brushon - 0 to disable, 1 to enable the function.
	 */	
	function ctbrushsvg(brushon){
		cmsvg.brush(brushon);
	}

	this.brush = function(brushon){
		ctbrushsvg(brushon);
	}
}