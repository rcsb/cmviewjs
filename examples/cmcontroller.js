function cmController(name, svg, ngl){
	var controllername = name;
	var cmngl = ngl;
	var cmsvg = svg;
	var cmsvgdata = cmsvg.getcmsvgdata;
	var residuesize = cmsvg.getresiduesize;


	function ctloadngl(){
		cmngl.loadngl();
	}

	this.ctloadngl = function(){
		ctloadngl();
	}

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

	function ctzoomsvg(zoomtag){
		cmsvg.zoom(zoomtag);
	}

	this.zoom = function(zoomtag){
		ctzoomsvg(zoomtag);
	}

	function ctbrushsvg(brushon){
		cmsvg.brush(brushon);
	}

	this.brush = function(brushon){
		ctbrushsvg(brushon);
	}
}