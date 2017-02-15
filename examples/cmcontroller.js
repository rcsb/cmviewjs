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
		cmsvg.loadsvg(tag);
	}

	this.ctloadcmsvg = function(tag){
		ctloadcmsvg(tag);
	}
}