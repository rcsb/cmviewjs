function cmNgl(name, vp, pdburl, chain){
	var nglname = name;
	var stage; 
	var structurecomp;
	var nglviewport = vp;
	var nglurl = pdburl;
	var res1 = [];
	var res2 = [];
	var chainid = chain;
	var svgdata = {};
	svgdata['residue1'] = res1;
	svgdata['residue2'] = res2;
	
	

	/*
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
	}*/





	function loadngl(){
		//stage = new NGL.Stage( nglviewport );

		//5sx3
		//pdburl1 = "rcsb://5sx3.mmtf";
		stage = new NGL.Stage( nglviewport );
	    stage.loadFile( nglurl, { defaultRepresentation: true } ).then( function( o ){

	    	structurecomp = o;

	    	//console.log(structurecomp.structure);


	    	var structure = structurecomp.structure;
		    var withinAtom = structure.getAtomProxy();
		    //console.log(withinAtom);
		    var chainA = structure.getChainProxy(0);
		    //console.log(chainA);
		    //console.log(chainA.entity);
			structure.eachAtom(function(atom){
			//chainA.eachAtom(function(atom){
					//"@"+atom.index + 
			        var singleAtomSelection = new NGL.Selection("@"+atom.index + " and .CA" );
			        //console.log(singleAtomSelection);
			        //console.log(atom);
			        //Getting all the contact between ^ and other CA atoms 
			        //singleAtomSelection
			        var withinAtomSet = structure.getAtomSetWithinSelection( singleAtomSelection, 8 );
			        //console.log(withinAtomSet);
			        //Going through the contacts
			        withinAtomSet.forEach( function( idx ){
			        		//res1.push(atom.resno);
			        		//console.log("First atom: " + atom.resno);
			                withinAtom.index = idx;
			                
			                if(withinAtom.chainname === chainid && atom.chainname === chainid && withinAtom.atomname === "CA"){
			                	//console.log(withinAtom.atomname);
			                	if(withinAtom.resno !== atom.resno){
			                		res1.push(atom.resno);
			                		res2.push(withinAtom.resno);
			                	}
			                	//res1.push(atom.resno);
			                	//res2.push(withinAtom.resno);
			                }
			                //res2.push(withinAtom.resno);
			                //console.log("Second atom: " + withinAtom.resno);
			                //console.log(withinAtom.residueIndex);
			        });

			        //var map = new svgdatamap(res1, res2);
			        //console.log(svgdata.residue1[0]);
			        //, new NGL.Selection( ":A and .CA" )
			} );

			//console.log(res2[1]);
		});
	    //console.log(stage);
	    
	    //console.log(structurecomp);


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

						if(d[0] === clickedresno || d[1] === clickedresno){

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

	this.res1 = function(){
		return res1;
	}

	this.res2 = function(){
		return res2;
	}

	this.svgdata = function(){
		return svgdata;
	}

}
