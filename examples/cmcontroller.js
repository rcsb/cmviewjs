/**
 * This is a closure base class for creating an controller object for contact map.
 * @class
 * @param {String} name - Name for the contact map controller.
 * @param {String} cmsvg1 - The contactmap svg object.
 * @param {String} ngl - The NGL object.
 */

function cmController(name, cmsvg1, ngl){
	var controllername = name;
	var cmngl = ngl;
	var cmsvg = cmsvg1;
	var cmsvgdata = cmsvg.getcmsvgdata;
	var residuesize = cmsvg.getresiduesize;

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
	 */
	function ctloadcmsvg(tag){
		var svgpromise = new Promise(function(resolve, reject){
			cmsvg.loadsvg(tag);
			resolve();
		});
		//cmsvg.loadsvg(tag);
		return svgpromise;
	}

	this.ctloadcmsvg = function(tag){
		return ctloadcmsvg(tag);
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