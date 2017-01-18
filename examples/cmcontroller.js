function controllerClass(name, svg, ngl){
	var controllername = name;
	var cmngl = ngl;
	var cmsvg = svg;
	var cmsvgdata = cmsvg.getcmsvgdata;
	var residuesize = cmsvg.getresiduesize;
	



	function ctloadngl(controllername){
		cmngl.loadngl();
	}

	this.ctloadngl = function(){
		ctloadngl();
	}

	function ctloadcmsvg(){
		cmsvg.loadsvg();
	}

	this.ctloadcmsvg = function(){
		ctloadcmsvg();
	}
}