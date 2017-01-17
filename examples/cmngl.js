function nglClass(arg1, vp){
	var property1 = arg1;
	var stage; 
	var structurecomp;
	var viewport = vp;
	var test1 = 1;
	var that = this;

	function loadngl(){
		stage = new NGL.Stage( viewport );

	    stage.loadFile( "rcsb://1smt.mmtf", { defaultRepresentation: true } ).then( function( o ){

	    that.structurecomp = o;

	    console.log(that.test1);
	    
	    that.test1 = 2;

	    console.log(that.test1);

		});		
	}

	this.loadngl = function(){
		//loadngl();
		document.addEventListener( "DOMContentLoaded", loadngl);
		//console.log(that.structurecomp);

	}

	this.test1 = test1;
	this.structurecomp = structurecomp;


}