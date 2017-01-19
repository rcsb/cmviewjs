function nglClass(name, vp){
	var nglname = name;
	var stage; 
	var structurecomp;
	var viewport = vp;


	function loadngl(){
		stage = new NGL.Stage( viewport );

		//5sx3
	    stage.loadFile( "rcsb://1smt.mmtf", { defaultRepresentation: true } ).then( function( o ){

	    	structurecomp = o;

		});	




	    //mouseevent for ngl
	    var clickedresno;
		stage.signals.clicked.add( 
			function( pickingData )
			{ 	
				if(pickingData.atom){
					console.log(pickingData.atom.resno);
					clickedresno = pickingData.atom.resno;

					d3.selectAll("rect").style("fill", "steelblue");
					//i = id of the rect
					//d = data insert into rect 
					d3.selectAll("rect").each(function(d,i){

						if(d[0] == clickedresno || d[1] == clickedresno){

							d3.select(this).style("fill","orange");

						}
					});

				}

				else{
					d3.selectAll("rect").style("fill", "steelblue");
				}
			} 
		);





	};

	this.loadngl = function(){
		document.addEventListener( "DOMContentLoaded", loadngl);
	}

	this.getStructureComp = function(){
		return structurecomp;
	}

	this.getClickedResno = function(){
		return clickedresno;
	}

}
