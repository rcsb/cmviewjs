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
	var chainid = chain;
	var cutoff = Number(cutoffvalue);
	var svgdata = {};
	var res1 = [];
	var res2 = [];
	var res1name = [];
	var resindex = [];
	var resinscode = [];
	var clickedatom = clickedatom1;
	svgdata['residue1'] = res1;
	svgdata['residue2'] = res2;
	svgdata['residue1name'] = res1name;
	svgdata['resindex'] = resindex;
	svgdata['resinscode'] = resinscode;



	//things to change to adapt to msa: structurecomp, nglurl, chainid, cutoff, svgdata

	function loadmsa(){
		//assuming we have an arry of promise
		//might need to change structurecomp to structurecomp array
		
		/*
		stage = new NGL.Stage( nglviewport );
		var promiselist = [];
		var promise1 = stage.loadFile("rcsb://4hhb.mmtf");
		var promise2 = stage.loadFile("rcsb://1smt.mmtf");
		promiselist[0] = promise1;
		promiselist[1] = promise2;
		var returnPromise = Promise.all(promiselist).then(function(listOfResults){
			for(var i = 0; i < promiselist.length; i++){
				var structurecomp1 = listOfResults[i];

				var cartoonsele1 = ":"+chainid;
				var ballsticksele1 = ":"+chainid+" and " + "hetero and not ( water or ion )";

				structurecomp1.addRepresentation("cartoon", {color:"residueindex" ,quality: "auto", aspectRatio: 5,scale: 0.7,colorScale: "RdYlBu", sele: cartoonsele1});
				structurecomp1.addRepresentation("base", {colorScale: "RdYlBu",quality: "auto"});
				structurecomp1.addRepresentation("ball+stick", {sele: ballsticksele1 ,colorScheme: "element",scale: 2.0,aspectRatio: 1.5,bondScale: 0.3,bondSpacing: 0.75,quality: "auto"});
			
			}
		});*/
		var promiselist = [];
		stage = new NGL.Stage( nglviewport );
		var promise1 = stage.loadFile("rcsb://4hhb.mmtf");
		var promise2 = stage.loadFile("rcsb://4hhb.mmtf");
		promiselist[0] = promise1;
		promiselist[1] = promise2;
		var returnPromise = Promise.all(promiselist).then(function(listOfResults){
			var structurecomp1 = listOfResults[0];
			var structurecomp2 = listOfResults[1];


			var cartoonsele1 = ":"+"A";
			var ballsticksele1 = ":"+"A"+" and " + "hetero and not ( water or ion )";
			structurecomp1.addRepresentation("cartoon", {color:"residueindex" ,quality: "auto", aspectRatio: 5,scale: 0.7,colorScale: "RdYlBu", sele: cartoonsele1});
			structurecomp1.addRepresentation("base", {colorScale: "RdYlBu",quality: "auto"});
			structurecomp1.addRepresentation("ball+stick", {sele: ballsticksele1 ,colorScheme: "element",scale: 2.0,aspectRatio: 1.5,bondScale: 0.3,bondSpacing: 0.75,quality: "auto"});
			

			var cartoonsele2 = ":"+"B";
			var ballsticksele2 = ":"+"B"+" and " + "hetero and not ( water or ion )";
			structurecomp2.addRepresentation("cartoon", {color:"residueindex" ,quality: "auto", aspectRatio: 5,scale: 0.7,colorScale: "RdYlBu", sele: cartoonsele2});
			structurecomp2.addRepresentation("base", {colorScale: "RdYlBu",quality: "auto"});
			structurecomp2.addRepresentation("ball+stick", {sele: ballsticksele2 ,colorScheme: "element",scale: 2.0,aspectRatio: 1.5,bondScale: 0.3,bondSpacing: 0.75,quality: "auto"});
			

			structurecomp1.superpose(structurecomp2);
		});

		return returnPromise;
	}











	/**
	 * Load function to load NGL data from the url to the viewport.
	 */
	function loadngl(){
		//pdburl1 = "rcsb://5sx3.mmtf";
		stage = new NGL.Stage( nglviewport );
		//var returnPromise = Promise.all(listOfPromises);
		//Promise.all(listOfPromises).then(function(listOfResults){})
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
					document.getElementById(clickedatom).innerHTML= atominfo;
				}

				else{
					d3.selectAll(".blue").selectAll("rect").style("fill", "steelblue");
					document.getElementById(clickedatom).innerHTML = "Clicked nothing";
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

	this.loadmsa = function(){
		return loadmsa();
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











































































































function cmNgl1(clickedatom1, vp, pdburls, chains, cutoffvalue, alignArr){
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
	/*var svgdata = {};
	var res1 = [];
	var res2 = [];
	var res1name = [];
	var resindex = [];
	var resinscode = [];
	svgdata['residue1'] = res1;
	svgdata['residue2'] = res2;
	svgdata['residue1name'] = res1name;
	svgdata['resindex'] = resindex;
	svgdata['resinscode'] = resinscode;*/

	function proteinThreeToOne(namelist){
		var seq = "";
		//console.log(namelist);
		//console.log(namelist[0]);
		var list = namelist;
		for(var i = 0; i < list.length; i++){
			var currname = list[i];
			//console.log(currname);

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
		//console.log(seq);
		return seq;
	}


	function SequenceInputException(nglseq,alignseq){
		this.message = "Input alignment sequence is different from NGL sequence."
		this.nglseq = nglseq;
		this.alignseq = alignseq;
	}






	//things to change to adapt to msa: structurecomp, nglurl, chainid, cutoff, svgdata

	function loadmsa(){
		//assuming we have an arry of promise
		//might need to change structurecomp to structurecomp array
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
			//console.log(tempseq);
		}
		
		stage = new NGL.Stage( nglviewport );
		var promiselist = [];
		for(var i = 0; i < nglurllist.length; i++){
			console.log(nglurllist[i]);
			var currpromise = stage.loadFile(nglurllist[i]);
			promiselist.push(currpromise);
		}
		/*var promise1 = stage.loadFile("rcsb://4hhb.mmtf");
		var promise2 = stage.loadFile("rcsb://1smt.mmtf");
		promiselist[0] = promise1;
		promiselist[1] = promise2;*/
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
					/*if(currseq !== seqfromNgl[i]){
						console.log("It is different.");
						console.log("seq fron ngl: "+ seqfromNgl[i]);
						console.log("seq from align: "+ currseq);
						//throw "errorrrrrrrr";
						//throw new SequenceInputException(seqfromNgl[i],currseq);
					}
					if(currseq === seqfromNgl[i]){
						console.log("It is same.");
						console.log("seq fron ngl: "+ seqfromNgl[i]);
						console.log("seq from align: "+ currseq);
					}*/
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

			//console.log(listOfResults[0]);
		});

		//console.log("Hi");
		//mouseclick();

		return returnPromise;
	}







	/**
	 * Load function to load NGL data from the url to the viewport.
	 */
	/*
	function loadngl(){
		//pdburl1 = "rcsb://5sx3.mmtf";
		stage = new NGL.Stage( nglviewport );
		var returnPromise = Promise.all(listOfPromises);
		//Promise.all(listOfPromises).then(function(listOfResults){})
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
	}*/

	/**
	 * Mouse click event to show the clicked residue.
	 */
	function mouseclick(){
		var clickedresno;
		stage.signals.clicked.add(
			function( pickingData ){	
				if(pickingData.atom){
					clickedresno = pickingData.atom.residueIndex;

					/*if(alignlist.length === 0){
						d3.selectAll(".blue").selectAll("rect").style("fill", "steelblue");
					}*/

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

		//console.log(withinAtom.residue);


		var temparr = [];
		var atomoffsettag = 1;
		var atomoffset = 0;
		structure.eachAtom(function(atom){

			var singleAtomSelection = new NGL.Selection("@"+atom.index + " and .CA" );
			//Getting all the contact between ^ and other CA atoms
			var withinAtomSet = structure.getAtomSetWithinSelection( singleAtomSelection, cutoff);
			//console.log(cutoff);
			//Going through the contacts
			var maxRes = 0;
			withinAtomSet.forEach( function( idx ){
				withinAtom.index = idx;
				//getting only .CA atom and one chain
				//&& withinAtom.atomname === "CA" && atom.atomname === "CA"
				if(withinAtom.chainname === chainlist[chainI] && atom.chainname === chainlist[chainI] && withinAtom.atomname === "CA" && atom.atomname === "CA"){

					if(withinAtom.residueIndex !== atom.residueIndex){
						if(atomoffsettag === 1){
							//console.log(atom.residue.chain.residueOffset);	
							atomoffsettag = 2;
							atomoffset = atom.residue.chain.residueOffset;
							//console.log(atom.residue.chain);
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
						//&& withinatomtag === 0
						if(withinAtom.altloc === "" && atom.altloc === "A"){
							res1.push(withinAtom.residueIndex-atomoffset);
							res2.push(atom.residueIndex-atomoffset);
						}
						//&& atomtag === 0
						if(withinAtom.altloc === "A" && atom.altloc === "A"){
							res1.push(withinAtom.residueIndex-atomoffset);
							res2.push(atom.residueIndex-atomoffset);
						}

						/*if(withinAtom.altloc !== ""){
							console.log("WithinAtom: " + withinAtom.residueIndex);
							console.log(withinAtom.altloc);
							//console.log(withinAtom);
						}
						if(atom.altloc !== ""){
							console.log("Atom: " + atom.residueIndex);
							console.log(atom.altloc);
							//console.log(atom);
						}*/
						/*if(withinAtom.residueIndex-atomoffset === 65 && atom.residueIndex-atomoffset === 70){
							console.log("contact!");
							console.log("65 name: " + withinAtom.resname);
							console.log("65 resnum: " + withinAtom.resno);
							console.log("70 name: " + atom.resname);
							console.log("70 resnum: " + atom.resno);
							console.log(withinAtom);
							console.log(atom);
						}
						if(withinAtom.residueIndex-atomoffset === 70 && atom.residueIndex-atomoffset === 65){
							console.log("contact!!!!!");
							//console.log(withinAtom);
							//console.log(atom);
						}*/
						//Saving residue name by residue index
						res1name[withinAtom.residueIndex] = withinAtom.resname;
						//Saving residue number + residue inscode by residue index
						resindex[withinAtom.residueIndex] = withinAtom.resno + withinAtom.inscode;

						//console.log(withinAtom.inscode);

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
		//console.log(proteinThreeToOne([res1name]));	
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
