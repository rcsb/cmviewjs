/**
 * This is a closure base class for creating an controller object for contact map.
 * @class
 * @param {String} cmsvg1 - The contactmap svg object.
 * @param {String} ngl - The NGL object.
 */

/* exported cmController */
/*eslint-disable no-unused-vars*/
function cmController(cmsvg1, ngl){
	var cmngl = ngl;
	var cmsvg = cmsvg1;
	var cmsvgdata = cmsvg.getcmsvgdata;
	var residuesize = cmsvg.getresiduesize;

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
	 * Getter function for cmsvgdata.
	 */
	function getcmsvgdata(){
		return cmsvgdata;
	}

	this.getcmsvgdata = function(){
		getcmsvgdata();
	}	

	/**
	 * Getter function for residuesize.
	 */
	function getresiduesize(){
		return residuesize;
	}

	this.getresiduesize = function(){
		getresiduesize();
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