/**
 * This is a closure base class for creating an object for NGL.
 * @class
 * @param {String} clickedatom1 - The span for displaying clicked atom information.
 * @param {String} vp - The div assign for the NGL objct.
 * @param {Array} pdburls - The urls for NGL data. Ex. protein 5sx3: "rcsb://5sx3.mmtf"
 * @param {Array} chains - Chain IDs for the protein. ex. A, B
 * @param {Integer} cutoffvalue - Cut off value for generating contact.
 * @param {Array} alignArr - Array for sequence alignments.
 */


/*global NGL*/
/*global Promise*/
/*eslint-disable no-unused-vars*/
export function cmNgl(clickedatom1, vp, pdburls, chains, cutoffvalue, alignArr){
	var stage; 
	var structurecomplist = [];
	var nglviewport = vp;
	var nglurllist = pdburls;
	var chainlist = chains;
	var cutoff = Number(cutoffvalue);
	var clickedatom = clickedatom1;
	var alignlist = alignArr;
	var seqtag = 0;
	var svgdatalist = [];



	/**
	 * Function to convert residue name(three letters) into one letter.
	 * @param {Array} namelist - Array that contains residue name. 
	 */
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


	/**
	 * Function to load ngl. (Single protein and also MSA)
	 */
	function loadmsa(){
		var i;

		var seqsfromaligns = [];
		for(i = 0; i < alignlist.length; i++){
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
		for(i = 0; i < nglurllist.length; i++){
			//console.log(nglurllist[i]);
			var currpromise = stage.loadFile(nglurllist[i]);
			promiselist.push(currpromise);
		}

		var returnPromise = Promise.all(promiselist).then(function(listOfResults){
			for(i = 0; i < promiselist.length; i++){
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
				for(i = 0; i < svgdatalist.length; i++){
					var currdata = svgdatalist[i];
					var currRes = currdata.residue1name;
					//console.log(proteinThreeToOne(currRes));
					var seq = proteinThreeToOne(currRes);
					seqfromNgl.push(seq);
				}

				for(i = 0; i < seqsfromaligns.length; i++){
					var currseq = seqsfromaligns[i];
					var currnglseq = seqfromNgl[i];

					if(currseq !== currnglseq){
						if(currseq.length !== currnglseq.length){
							//console.log("It's different");
							seqtag = 1;
						}
						else{
							var tag = 0;
							for(var j = 0; j < currseq.length; j++){
								var char1 = currseq[j];
								var char2 = currnglseq[j];
								if(char1 !== char2){
									if(char1 !== "X" && char2 !== "X"){
										//console.log("It's different");
										seqtag = 1;
									}
								}
							}
						}
					}
				}
			}


			//superpose protein structure onto the first one
			var firststrcomp = listOfResults[0];
			for(i = 1; i < listOfResults.length; i++){
				firststrcomp.superpose(listOfResults[i]);
				listOfResults[i].superpose(firststrcomp);
			}

		});
	
		//mouseclick();

		return returnPromise;
	}

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
			withinAtomSet.forEach( function( idx ){
				withinAtom.index = idx;
				//getting only .CA atom and one chain
				if(withinAtom.chainname === chainlist[chainI] && atom.chainname === chainlist[chainI] && withinAtom.atomname === "CA" && atom.atomname === "CA"){

					if(withinAtom.residueIndex !== atom.residueIndex){
						//get the offset
						if(atomoffsettag === 1){

							atomoffsettag = 2;
							atomoffset = atom.residue.chain.residueOffset;

						}

						//Saving contact as two seperate arrays. If there is alternate location, only save A.
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

	this.loadmsa = function(){
		return loadmsa();
	}

	this.getStructureComplist = function(){
		return structurecomplist;
	}

	this.getStage = function(){
		return stage;
	}

	/*this.res1 = function(){
		return res1;
	}

	this.res2 = function(){
		return res2;
	}*/

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
