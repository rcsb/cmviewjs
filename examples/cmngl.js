/**
 * This is a closure base class for creating an object for NGL.
 * @class
 * @param {String} vp - The Viewport assign for the NGL objct.
 * @param {String} pdburl - The url for NGL data.
 * @param {String} chain - Chain ID for the protein. ex. A, B
 */

 /*global d3*/
 /*global NGL*/
 /*eslint-disable no-unused-vars*/
function cmNgl(vp, pdburl, chain){
	var stage; 
	var structurecomp;
	var nglviewport = vp;
	var nglurl = pdburl;
	var res1 = [];
	var res2 = [];
	var chainid = chain;
	var svgdata = {};
	var res1name = [];
	var resindex = [];
	var resinscode = [];
	svgdata['residue1'] = res1;
	svgdata['residue2'] = res2;
	svgdata['residue1name'] = res1name;
	svgdata['resindex'] = resindex;
	svgdata['resinscode'] = resinscode;

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

			structure.eachAtom(function(atom){
				var singleAtomSelection = new NGL.Selection("@"+atom.index + " and .CA" );
				//Getting all the contact between ^ and other CA atoms 
				var withinAtomSet = structure.getAtomSetWithinSelection( singleAtomSelection, 8 );
				//Going through the contacts
				var maxRes = 0;
				withinAtomSet.forEach( function( idx ){
					withinAtom.index = idx;
					/*console.log("withinAtom.chainname: "+ withinAtom.chainname);
					//console.log("atom.chainname: "+atom.chainname);
					//console.log("withinAtom.atomname: "+withinAtom.atomname);
					//console.log("chainid: "+ chainid);
					if(withinAtom.chainname === chainid){
						console.log("withinAtom.chainname: A");
					}
					if(atom.chainname === chainid){
						console.log("atom.chainname: A");
					}
					if(withinAtom.atomname === "CA"){
						//console.log("withinAtom.atomname: CA");
					}*/

					
					if(withinAtom.chainname === chainid && atom.chainname === chainid && withinAtom.atomname === "CA" && atom.atomname === "CA"){
						/*console.log("withinAtom.resno: "+ withinAtom.resno);
						console.log("withinAtom.resname: "+ withinAtom.resname);
						console.log("withinAtom.inscode: "+ withinAtom.inscode);
						console.log("withinAtom.residueIndex: "+ withinAtom.residueIndex);
						console.log("\n");*/

						if(withinAtom.residueIndex !== atom.residueIndex){
							

							//res1.push(atom.resno);
							//res2.push(withinAtom.resno);
							res1.push(atom.residueIndex);
							res2.push(withinAtom.residueIndex);

							//res1name[atom.resno] = atom.resname;
							res1name[atom.residueIndex] = atom.resname;
							resindex[withinAtom.residueIndex] = "" + withinAtom.resno + withinAtom.inscode;
							if(withinAtom.inscode != ""){
								resinscode[withinAtom.residueIndex] = 1;
							}
							
							//console.log(atom.resno);
							
							if(atom.resno > maxRes){
								//maxRes = atom.resno;
								//svgdata['maxRes'] = atom.resno;
								maxRes = atom.residueIndex;
								svgdata['maxRes'] = atom.residueIndex;
							}
							if(withinAtom.resno > maxRes){
								//maxRes = withinAtom.resno;
								//svgdata['maxRes'] = withinAtom.resno;
								maxRes = withinAtom.residueIndex;
								svgdata['maxRes'] = withinAtom.residueIndex;
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
					//console.log(pickingData.atom.resno);
					clickedresno = pickingData.atom.residueIndex;

					//d3.selectAll("rect").style("fill", "steelblue");
					d3.selectAll(".blue").selectAll("rect").style("fill", "steelblue");
					//i = id of the rect
					//d = data insert into rect 
					//d3.selectAll("rect").each(function(d,i){
					d3.selectAll("rect").each(function(d){	
						
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


	}

	this.loadngl = function(){
		return loadngl();
	}

	this.getStructureComp = function(){
		return structurecomp;
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
