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
function cmNgl(controller,clickedatom1, vp, pdburls, chains, cutoffvalue, alignArr){
	var stage; 
	var structurecomplist = [];
	var nglviewport = vp;
	var nglurllist = pdburls;
	var chainlist = chains;
	var cutoff = Number(cutoffvalue);
	var clickedatom = clickedatom1;
	var alignlist = alignArr;
	var seqtag = 0;
	var cmcontroller = controller;

	var svgdatalist = [];


	function proteinThreeToOne(namelist){
		var seq = "";

		var list = namelist;
		for(var i = 0; i < list.length; i++){
			var currname = list[i];


			if(currname === 'ALA'){
				seq = seq + "A";
			}
			else if(currname === 'ARG'){
				seq = seq + "R";
			}
			else if(currname === 'ASN'){
				seq = seq + "N";
			}
			else if(currname === 'ASP'){
				seq = seq + "D";
			}
			else if(currname === 'ASX'){
				seq = seq + "B";
			}
			else if(currname === 'CYS'){
				seq = seq + "C";
			}
			else if(currname === 'GLU'){
				seq = seq + "E";
			}
			else if(currname === 'GLN'){
				seq = seq + "Q";
			}
			else if(currname === 'GLX'){
				seq = seq + "Z";
			}
			else if(currname === 'GLY'){
				seq = seq + "G";
			}
			else if(currname === 'HIS'){
				seq = seq + "H";
			}
			else if(currname === 'ILE'){
				seq = seq + "I";
			}
			else if(currname === 'LEU'){
				seq = seq + "L";
			}
			else if(currname === 'LYS'){
				seq = seq + "K";
			}
			else if(currname === 'MET'){
				seq = seq + "M";
			}
			else if(currname === 'PHE'){
				seq = seq + "F";
			}
			else if(currname === 'PRO'){
				seq = seq + "P";
			}
			else if(currname === 'SER'){
				seq = seq + "S";
			}
			else if(currname === 'THR'){
				seq = seq + "T";
			}
			else if(currname === 'TRP'){
				seq = seq + "W";
			}
			else if(currname === 'TYR'){
				seq = seq + "Y";
			}
			else if(currname === 'VAL'){
				seq = seq + "V";
			}
			else{
				seq = seq + "X";
			}
		}

		return seq;
	}


	/*function SequenceInputException(nglseq,alignseq){
		this.message = "Input alignment sequence is different from NGL sequence."
		this.nglseq = nglseq;
		this.alignseq = alignseq;
	}*/


	function loadmsa(){

		var seqsfromaligns = [];
		for(var i = 0; i < alignlist.length; i++){
			var curralign = alignlist[i];
			var tempseq = "";
			for(var j = 0; j < curralign.length; j++){
				var currchar = curralign[j];
				if(currchar !== "-"){
					tempseq = tempseq + currchar;
				}
			}
			seqsfromaligns.push(tempseq);

		}
		
		stage = new NGL.Stage( nglviewport );
		var promiselist = [];
		for(var i = 0; i < nglurllist.length; i++){
			console.log(nglurllist[i]);
			var currpromise = stage.loadFile(nglurllist[i]);
			promiselist.push(currpromise);
		}

		var returnPromise = Promise.all(promiselist).then(function(listOfResults){
			for(var i = 0; i < promiselist.length; i++){
				var structurecomp1 = listOfResults[i];
				structurecomplist.push(structurecomp1);
				var cartoonsele1 = ":"+chainlist[i];
				var ballsticksele1 = ":"+chainlist[i]+" and " + "hetero and not ( water or ion )";

				structurecomp1.addRepresentation("cartoon", {color:"residueindex" ,quality: "auto", aspectRatio: 5,scale: 0.7,colorScale: "RdYlBu", sele: cartoonsele1});
				structurecomp1.addRepresentation("base", {colorScale: "RdYlBu",quality: "auto"});
				structurecomp1.addRepresentation("ball+stick", {sele: ballsticksele1 ,colorScheme: "element",scale: 2.0,aspectRatio: 1.5,bondScale: 0.3,bondSpacing: 0.75,quality: "auto"});
				
				//structurecomp1.centerView();
				structurecomp1.autoView();

				calContacts(structurecomp1, i);
				//structurecomp1.superpose(structurecomp2);
			}



			//check if align sequence === ngl sequence
			if(alignArr[0] !== ""){
				var seqfromNgl = [];
				for(var i = 0; i < svgdatalist.length; i++){
					var currdata = svgdatalist[i];
					var currRes = currdata.residue1name;
					//console.log(proteinThreeToOne(currRes));
					var seq = proteinThreeToOne(currRes);
					seqfromNgl.push(seq);
				}

				for(var i = 0; i < seqsfromaligns.length; i++){
					var currseq = seqsfromaligns[i];
					var currnglseq = seqfromNgl[i];

					if(currseq !== currnglseq){
						if(currseq.length !== currnglseq.length){
							console.log("It's different");
							seqtag = 1;
						}
						else{
							var tag = 0;
							for(var j = 0; j < currseq.length; j++){
								var char1 = currseq[j];
								var char2 = currnglseq[j];
								if(char1 !== char2){
									if(char1 !== "X" && char2 !== "X"){
										console.log("It's different");
										seqtag = 1;
									}
								}
							}
						}
					}
				}
			}



			var firststrcomp = listOfResults[0];
			for(var i = 1; i < listOfResults.length; i++){
				firststrcomp.superpose(listOfResults[i]);
				//superpose(listOfResults[i],firststrcomp);
				listOfResults[i].superpose(firststrcomp);
			}

		});
	

		//console.log(controller);
		//controller.mouseclick();
		//cmcontroller.mouseclick();
		//mouseclick();

		return returnPromise;
	}


	/**
	 * Mouse click event to show the clicked residue.
	 */
	/*function mouseclick(){
		var clickedresno;
		stage.signals.clicked.add(
			function( pickingData ){	
				if(pickingData && pickingData.atom){
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
					document.getElementById(clickedatom).innerHTML= atominfo;
				}

				else{
					d3.selectAll(".blue").selectAll("rect").style("fill", "steelblue");
					document.getElementById(clickedatom).innerHTML = "Clicked nothing";
				}
			} 
		);
	}*/






	/**
	 * Function to calculate contacts.
	 */
	function calContacts(structurecomp, chainI){
		var structure = structurecomp.structure;
		var withinAtom = structure.getAtomProxy();
		var svgdata = {};
		var res1 = [];
		var res2 = [];
		var res1name = [];
		var resindex = [];
		var resinscode = [];
		svgdata['residue1'] = res1;
		svgdata['residue2'] = res2;
		svgdata['residue1name'] = res1name;
		svgdata['resindex'] = resindex;
		svgdata['resinscode'] = resinscode;


		var temparr = [];
		var atomoffsettag = 1;
		var atomoffset = 0;
		structure.eachAtom(function(atom){

			var singleAtomSelection = new NGL.Selection("@"+atom.index + " and .CA" );
			//Getting all the contact between ^ and other CA atoms
			var withinAtomSet = structure.getAtomSetWithinSelection( singleAtomSelection, cutoff);
			//Going through the contacts
			var maxRes = 0;
			withinAtomSet.forEach( function( idx ){
				withinAtom.index = idx;
				//getting only .CA atom and one chain
				//&& withinAtom.atomname === "CA" && atom.atomname === "CA"
				if(withinAtom.chainname === chainlist[chainI] && atom.chainname === chainlist[chainI] && withinAtom.atomname === "CA" && atom.atomname === "CA"){

					if(withinAtom.residueIndex !== atom.residueIndex){
						if(atomoffsettag === 1){

							atomoffsettag = 2;
							atomoffset = atom.residue.chain.residueOffset;

						}

						//Saving contact as two seperate arrays
						//res1.push(withinAtom.residueIndex-atomoffset);
						//res2.push(atom.residueIndex-atomoffset);
						if(withinAtom.altloc === "" && atom.altloc === ""){
							res1.push(withinAtom.residueIndex-atomoffset);
							res2.push(atom.residueIndex-atomoffset);

						}
						if(withinAtom.altloc === "A" && atom.altloc === ""){
							res1.push(withinAtom.residueIndex-atomoffset);
							res2.push(atom.residueIndex-atomoffset);
						}

						if(withinAtom.altloc === "" && atom.altloc === "A"){
							res1.push(withinAtom.residueIndex-atomoffset);
							res2.push(atom.residueIndex-atomoffset);
						}

						if(withinAtom.altloc === "A" && atom.altloc === "A"){
							res1.push(withinAtom.residueIndex-atomoffset);
							res2.push(atom.residueIndex-atomoffset);
						}

						//Saving residue name by residue index
						res1name[withinAtom.residueIndex] = withinAtom.resname;
						//Saving residue number + residue inscode by residue index
						resindex[withinAtom.residueIndex] = withinAtom.resno + withinAtom.inscode;

						if(withinAtom.inscode != ""){
							//array to check if this residue index has inscode
							resinscode[withinAtom.residueIndex] = 1;
						}
					}
				}
			});
		});
	//, new NGL.Selection("protein and .CA")
		svgdatalist.push(svgdata);
	}


	this.loadngl = function(){
		return loadngl();
	}

	this.loadmsa = function(){
		return loadmsa();
	}

	this.getStructureComplist = function(){
		return structurecomplist;
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

	this.chainlist = function(){
		return chainlist;
	}

	this.svgdatalist = function(){
		return svgdatalist;
	}

	this.getseqtag = function(){
		return seqtag;
	}
}
