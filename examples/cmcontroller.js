/**
 * This is a closure base class for creating an controller object for contact map.
 * @class
 * @param {String} clickedatom1 - The span for displaying clicked atom information.
 * @param {String} nglvp - The div assign for the NGL objct.
 * @param {Array} nglurllist - The urls for NGL data. Ex. protein 5sx3: "rcsb://5sx3.mmtf"
 * @param {Array} chainlist - Chain IDs for the protein. ex. A, B
 * @param {Array} pdbidlist - Array of PDB IDs.
 * @param {Integer} cutoffvalue - Cut off value for generating contact.
 * @param {String} cmvp1 - The div assign for the contact map objct.
 * @param {Integer} maxLength - The max length of the cmvp div. 
 * @param {String} alignstr - Alignment strings.
 */

/* exported cmController */
/*eslint-disable no-unused-vars*/
function cmController(clickedatom1, nglvp, nglurllist, chainlist, pdbidlist, cutoffvalue, cmvp1, maxLength, alignstr){
	//create and load ngl object.
	var alignArr = extractfasta(alignstr);
	//console.log(alignArr);
	var cmngl1 = new cmNgl(clickedatom1, nglvp, nglurllist, chainlist, cutoffvalue, alignArr);
	var cmsvg;
	
	cmngl1.loadmsa().then(function(){
		//create contact map with only one protein.
		if(alignArr[0].length === 0){
			var cmsvgobj1 = new cmSvg("svgviewport", cmngl1, alignArr, pdbidlist);
			cmsvg = cmsvgobj1;
			ctloadcmsvg(1, maxLength);

			mouseclick();
		}
		//create contact map with MSA.
		else{
			//check if the sequence from alignment is the same with the sequence from ngl. 
			if(cmngl1.getseqtag() === 1){
				console.log("Sequence is different");
			}
			if(cmngl1.getseqtag() === 0){
				console.log("Sequence is same");
				var cmsvgobj1 = new cmSvg("svgviewport", cmngl1, alignArr, pdbidlist);
				cmsvg = cmsvgobj1;
				ctloadcmsvg(2, maxLength);

				mouseclick();
			}
		}
	});


	/**
	 * Function to parse fasta strings into array.
	 * @param {String} fastastr - The fasta string.
	 */
	function extractfasta(fastastr){
		fastastr.trim();
		var arr1 = fastastr.split('\n');
		//console.log(fastastr);

		var tempstr = "";
		var returnArr = [];
		var start = 0;
		for(var i = 0; i < arr1.length; i++){
			var currstr = arr1[i];
			if(currstr[0] === ">"){
				if(start === 1){
					returnArr.push(tempstr);
				}
				start = 1;
				tempstr = "";
			}
			if(currstr[0] !== ">"){
				tempstr = tempstr + currstr;
			}
			if(i === arr1.length-1){
				returnArr.push(tempstr);
			}
		}

		return returnArr;
	}


	/**
	 * Mouse click event for ngl to show the clicked residue.
	 */
	function mouseclick(){

		var stage = cmngl1.getStage();
		var clickedresno;
		var rectnamelist = cmsvg.rectnamelist();
		var colorlist = cmsvg.colorlist();
		var alignToSeq = cmsvg.alignToSeq();
		var clickedatom = clickedatom1;

		stage.signals.clicked.add(
			function( pickingData ){	
				if(pickingData && pickingData.atom){
					clickedresno = pickingData.atom.residueIndex;


					var atominfo = "";

					if(alignArr[0].length === 0){
						d3.selectAll(".blue").selectAll("rect").style("fill", "steelblue");
						d3.selectAll("rect").each(function(d){	
							if(d[0] === clickedresno || d[1] === clickedresno){
								d3.select(this).style("fill","orange");
							}
						});

						atominfo = "Clicked atom: "+ "[" + pickingData.atom.resname + "]" + pickingData.atom.resno + pickingData.atom.inscode + ":" + pickingData.atom.chainname + ".CA";
					}
					

					if(alignArr[0].length !== 0){
						for(var i = 0 ; i < rectnamelist.length; i++){
							var classname = "."+rectnamelist[i];
							d3.selectAll(classname).selectAll("rect").style("fill", colorlist[i]).style("opacity", 0.5);
						}

						var clickedprotein = pickingData.atom.residue.structure.name;

						var proteinindex = -1;
						for(var i = 0; i < pdbidlist.length; i++){
							var currname = pdbidlist[i];
							if(currname === clickedprotein){
								proteinindex = i;
							}
						}

						var curraligntoseq = alignToSeq[proteinindex];
						//i = id of the rect
						//d = data insert into rect 
						d3.selectAll("rect").each(function(d){
							if(curraligntoseq[d[0]] === clickedresno || curraligntoseq[d[1]] === clickedresno){
								d3.select(this).style("fill","black");
							}
						});

						atominfo ="Clicked protein: " + clickedprotein + ", Clicked atom: "+ "[" + pickingData.atom.resname + "]" + pickingData.atom.resno + pickingData.atom.inscode + ":" + pickingData.atom.chainname + ".CA";
					}

					document.getElementById(clickedatom).innerHTML= atominfo;
				}

				else{
					if(alignArr[0].length === 0){
						d3.selectAll(".blue").selectAll("rect").style("fill", "steelblue");
					}
					

					if(alignArr[0].length !== 0){
						for(var i = 0 ; i < rectnamelist.length; i++){
							var classname = "."+rectnamelist[i];
							d3.selectAll(classname).selectAll("rect").style("fill", colorlist[i]).style("opacity", 0.5);
						}
					}
					document.getElementById(clickedatom).innerHTML = "Clicked nothing";
				}
			} 
		);
	}


	this.mouseclick = function(){
		mouseclick();
	}

	/**
	 * Function to call loadmsa of NGL object.
	 */
	function ctloadngl(){
		cmngl1.loadmsa();
	}

	this.ctloadngl = function(){
		ctloadngl();
	}
	/**
	 * Function to call loadsvg of cmsvg object.
	 * @param {Integer} tag - 0 to use local file, 1 to get contact map data from NGL, 2 for msa.
	 * @param {Integer} svgsize1 - viewport size for the contactmap. (svgsize1 = width = height)
	 */
	function ctloadcmsvg(tag, svgsize1){
		/*global Promise*/
		var svgpromise = new Promise(function(resolve){
			cmsvg.loadsvg(tag, svgsize1);
			resolve();
		});
		return svgpromise;
	}

	this.ctloadcmsvg = function(tag, svgsize1){
		return ctloadcmsvg(tag, svgsize1);
	}

	/**
	 * Function to call zoom function of cmsvg object.
	 * @param {Integer} zoomtag - 0 to disable, 1 to enable the function.
	 */	
	function ctzoomsvg(zoomtag){
		cmsvg.zoom(zoomtag);
	}

	this.zoom = function(zoomtag){
		ctzoomsvg(zoomtag);
	}

	/**
	 * Function to call brush function of cmsvg object.
	 * @param {Integer} brushon - 0 to disable, 1 to enable the function.
	 */	
	function ctbrushsvg(brushon){
		cmsvg.brush(brushon);
	}

	this.brush = function(brushon){
		ctbrushsvg(brushon);
	}
}