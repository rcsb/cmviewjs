function cmNgl(name, vp, pdburl){
	var nglname = name;
	var stage; 
	var structurecomp;
	var nglviewport = vp;
	var nglurl = pdburl;
	
	function calculatingContact(){
		var withinAtom = structure.getAtomProxy();
		structure.eachAtom(function(atom){
		        var singleAtomSelection = new NGL.Selection( "@"+atom.index + "and .CA" );
		        console.log(singleAtomSelection);
		        var withinAtomSet = structure.getAtomSetWithinSelection( singleAtomSelection, 4 );
		        withinAtomSet.forEach( function( idx ){
		                withinAtom.index = idx;
		        });
		}, new NGL.Selection( ".CA" ) );		
	}

	function loadngl(){
		//stage = new NGL.Stage( nglviewport );

		//5sx3
		//pdburl1 = "rcsb://5sx3.mmtf";
		stage = new NGL.Stage( nglviewport );
	    stage.loadFile( nglurl, { defaultRepresentation: true } ).then( function( o ){

	    	structurecomp = o;

		});

	    



	    /*
		var withinAtom = structure.getAtomProxy();
		structure.eachAtom(function(atom){
		        var singleAtomSelection = new NGL.Selection( "@"+atom.index + "and .CA" );
		        
		        var withinAtomSet = structure.getAtomSetWithinSelection( singleAtomSelection, 4 );
		        withinAtomSet.forEach( function( idx ){
		                withinAtom.index = idx;
		        });
		}, new NGL.Selection( ".CA" ) );
		*/






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
		loadngl();
	}


	this.getStructureComp = function(){
		return structurecomp;
	}

	this.getClickedResno = function(){
		return clickedresno;
	}

	this.getStage = function(){
		return stage;
	}

}
