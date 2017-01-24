function controllerClass(name, svg, ngl){
	var controllername = name;
	var cmngl = ngl;
	var cmsvg = svg;
	var cmsvgdata = cmsvg.getcmsvgdata;
	var residuesize = cmsvg.getresiduesize;
	var pdbid;
	


	function pdbinput(){
		var x = document.getElementById('pdbid').value
		console.log(x);
		//cmngl.loadngl();
		//cmsvg.loadsvg();
	}

	var inputpdbbtn = document.getElementById('submit');
	inputpdbbtn.addEventListener('click', pdbinput);




	function ctloadngl(){
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