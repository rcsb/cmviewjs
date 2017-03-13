/**
 * This is a closure base class for creating an object for NGL.
 * @class
 * @param {String} name - Name of the NGL object.
 * @param {String} vp - The Viewport assign for the NGL objct.
 * @param {String} pdburl - The url for NGL data.
 * @param {String} chain - Chain ID for the protein. ex. A, B
 */
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

	/**
	 * Load function to load NGL data from the url to the viewport.
	 */
	function loadngl(){
		//stage = new NGL.Stage( nglviewport );

		//5sx3
		//pdburl1 = "rcsb://5sx3.mmtf";
		stage = new NGL.Stage( nglviewport );
	    var nglpromise = stage.loadFile( nglurl, { defaultRepresentation: true } ).then( function( o ){

	    	structurecomp = o;


	    	//calculating contacts
	    	var structure = structurecomp.structure;
		    var withinAtom = structure.getAtomProxy();
		    var chainA = structure.getChainProxy(0);
		    
			structure.eachAtom(function(atom){
		        var singleAtomSelection = new NGL.Selection("@"+atom.index + " and .CA" );
		        //Getting all the contact between ^ and other CA atoms 
		        var withinAtomSet = structure.getAtomSetWithinSelection( singleAtomSelection, 8 );
		        //Going through the contacts
		        var maxRes = 0;
		        withinAtomSet.forEach( function( idx ){
	                withinAtom.index = idx;
	                if(withinAtom.chainname === chainid && atom.chainname === chainid && withinAtom.atomname === "CA"){
	                	if(withinAtom.resno !== atom.resno){

	                		res1.push(atom.resno);
	                		res2.push(withinAtom.resno);

	                		//console.log(chainA.model);
	                		
	                		if(atom.resno > maxRes){
	                			maxRes = atom.resno;
	                			svgdata['maxRes'] = atom.resno;
	                		}
	                		if(withinAtom.resno > maxRes){
	                			maxRes = withinAtom.resno;
	                			svgdata['maxRes'] = withinAtom.resno;
	                		}
	                	}
	                }
		        });
			});
		});

		//console.log(x);


	    //mouseevent for ngl
	    var clickedresno;
		stage.signals.clicked.add(
			function( pickingData ){ 	
				if(pickingData.atom){
					console.log(pickingData.atom.resno);
					clickedresno = pickingData.atom.resno;

					//d3.selectAll("rect").style("fill", "steelblue");
					d3.selectAll(".blue").selectAll("rect").style("fill", "steelblue");
					//i = id of the rect
					//d = data insert into rect 
					//d3.selectAll("rect").each(function(d,i){
					d3.selectAll("rect").each(function(d,i){	
						
						if(d[0] === clickedresno || d[1] === clickedresno){
							d3.select(this).style("fill","orange");
						}
					});
				}

				else{
					//d3.selectAll("rect").style("fill", "steelblue");
					d3.selectAll(".blue").selectAll("rect").style("fill", "steelblue");
				}
			} 
		);








		

		return nglpromise;


	};

	this.loadngl = function(){
		return loadngl();
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
