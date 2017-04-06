/**
 * This is a closure base class for creating an object for NGL.
 * @class
 * @param {String} clickedatom1 - The span for displaying clicked atom information.
 * @param {String} vp - The div assign for the NGL objct.
 * @param {String} pdburl - The url for NGL data. Ex. protein 5sx3: "rcsb://5sx3.mmtf"
 * @param {String} chain - Chain ID for the protein. ex. A, B
 * @param {Integer} cutoffvalue - Cut off value for generating contact.
 */

 /*global d3*/
 /*global NGL*/
 /*eslint-disable no-unused-vars*/
function cmNgl(clickedatom1, vp, pdburl, chain, cutoffvalue){
	var stage; 
	var structurecomp;
	var nglviewport = vp;
	var nglurl = pdburl;
	var res1 = [];
	var res2 = [];
	var chainid = chain;
	var cutoff = Number(cutoffvalue);
	var svgdata = {};
	var res1name = [];
	var resindex = [];
	var resinscode = [];
	var clickedatom = clickedatom1;
	svgdata['residue1'] = res1;
	svgdata['residue2'] = res2;
	svgdata['residue1name'] = res1name;
	svgdata['resindex'] = resindex;
	svgdata['resinscode'] = resinscode;

	/**
	 * Load function to load NGL data from the url to the viewport.
	 */
	function loadngl(){
		//pdburl1 = "rcsb://5sx3.mmtf";
		stage = new NGL.Stage( nglviewport );
		var nglpromise = stage.loadFile( nglurl ).then( function( o ){

			//load only one chain with color schme: residueindex
			structurecomp = o;
			var cartoonsele = ":"+chainid;
			var ballsticksele = ":"+chainid+" and " + "hetero and not ( water or ion )";
			structurecomp.addRepresentation("cartoon", {color:"residueindex" ,quality: "auto", aspectRatio: 5,scale: 0.7,colorScale: "RdYlBu", sele: cartoonsele});
			structurecomp.addRepresentation("base", {colorScale: "RdYlBu",quality: "auto"});
			structurecomp.addRepresentation("ball+stick", {sele: ballsticksele ,colorScheme: "element",scale: 2.0,aspectRatio: 1.5,bondScale: 0.3,bondSpacing: 0.75,quality: "auto"});
			structurecomp.centerView();

			//calculating the contact for contact map.
			calContacts(structurecomp);

		});

		//mouseevent for ngl
		mouseclick();

		return nglpromise;
	}

	/**
	 * Mouse click event to show the clicked residue.
	 */

	function mouseclick(){
		var clickedresno;
		stage.signals.clicked.add(
			function( pickingData ){ 	
				if(pickingData.atom){
					clickedresno = pickingData.atom.residueIndex;

					d3.selectAll(".blue").selectAll("rect").style("fill", "steelblue");
					//i = id of the rect
					//d = data insert into rect 
					//d3.selectAll("rect").each(function(d,i){
					d3.selectAll("rect").each(function(d){	
						if(d[0] === clickedresno || d[1] === clickedresno){
							d3.select(this).style("fill","orange");
						}
					});
					var atominfo = "Clicked atom: "+ "[" + pickingData.atom.resname + "]" 
					+ pickingData.atom.resno + pickingData.atom.inscode + ":" + pickingData.atom.chainname + ".CA";
					document.getElementById("clickedatom").innerHTML= atominfo;
				}

				else{
					d3.selectAll(".blue").selectAll("rect").style("fill", "steelblue");
					document.getElementById("clickedatom").innerHTML = "Clicked nothing";
					//d3.selectAll(".selection").attr("display", "none");		
					//d3.selectAll(".brush").call(brush.clear());
				}
			} 
		);
	}



	/**
	 * Function to calculate contacts.
	 */
	function calContacts(structurecomp){
		var structure = structurecomp.structure;
		var withinAtom = structure.getAtomProxy();

		structure.eachAtom(function(atom){
			var singleAtomSelection = new NGL.Selection("@"+atom.index + " and .CA" );
			//Getting all the contact between ^ and other CA atoms
			var withinAtomSet = structure.getAtomSetWithinSelection( singleAtomSelection, cutoff);
			//Going through the contacts
			var maxRes = 0;
			withinAtomSet.forEach( function( idx ){
				withinAtom.index = idx;
				//getting only .CA atom and one chain
				if(withinAtom.chainname === chainid && atom.chainname === chainid && withinAtom.atomname === "CA" && atom.atomname === "CA"){

					if(withinAtom.residueIndex !== atom.residueIndex){

						//Saving contact as two seperate arrays
						res1.push(atom.residueIndex);
						res2.push(withinAtom.residueIndex);

						//Saving residue name by residue index
						res1name[atom.residueIndex] = atom.resname;
						//Saving residue number + residue inscode by residue index
						resindex[atom.residueIndex] = atom.resno + atom.inscode;

						if(withinAtom.inscode != ""){
							//array to check if this residue index has inscode
							resinscode[withinAtom.residueIndex] = 1;
						}
					}
				}
			});
		});
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
