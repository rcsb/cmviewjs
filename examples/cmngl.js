function nglClass(name, vp){
	var nglname = name;
	var stage; 
	var structurecomp;
	var viewport = vp;

	function loadngl(){
		stage = new NGL.Stage( viewport );

	    stage.loadFile( "rcsb://1smt.mmtf", { defaultRepresentation: true } ).then( function( o ){

	    	structurecomp = o;

		});		
	};

	this.loadngl = function(){
		document.addEventListener( "DOMContentLoaded", loadngl);
	}

	this.getStructureComp = function(){
		return structurecomp;
	}

}
