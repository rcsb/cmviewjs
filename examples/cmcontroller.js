/**
 * This is a closure base class for creating an controller object for contact map.
 * @class
 * @param {String} clickedatom1 - The span for displaying clicked atom information.
 * @param {String} nglvp - The div assign for the NGL objct.
 * @param {String} nglurl - The url for NGL data. Ex. protein 5sx3: "rcsb://5sx3.mmtf"
 * @param {String} chain - Chain ID for the protein. ex. A, B
 * @param {Integer} cutoffvalue - Cut off value for generating contact.
 * @param {String} cmvp1 - The div assign for the contact map objct.
 * @param {String} cmurl - The url to get contact map data.
 * @param {Integer} maxLength - The max length of the cmvp div. 
 */

/* exported cmController */
/*eslint-disable no-unused-vars*/
//clickedatom1, vp, pdburl, chain, cutoffvalue
//cmsvg1, ngl
function cmController(clickedatom1, nglvp, nglurllist, chainlist, pdbidlist, cutoffvalue, cmvp1, maxLength, alignArr){


	var cmngl1 = new cmNgl(this, clickedatom1, nglvp, nglurllist, chainlist, cutoffvalue, alignArr);
	//var cmngl1 = new cmNgl(clickedatom1, nglvp, nglurllist, chainlist, cutoffvalue, alignArr);
	var cmsvg;
	
	cmngl1.loadmsa().then(function(){
		if(alignArr[0].length === 0){
			var cmsvgobj1 = new cmSvg("svgviewport", cmngl1, alignArr, pdbidlist);
			cmsvg = cmsvgobj1;
			ctloadcmsvg(1, maxLength);

			mouseclick();
		}
		else{
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




	function mouseclick(){
		//console.log("Hii");
		var stage = cmngl1.getStage();
		var clickedresno;
		var rectnamelist = cmsvg.rectnamelist();
		var colorlist = cmsvg.colorlist();
		var alignToSeq = cmsvg.alignToSeq();
		var clickedatom = clickedatom1;
		//console.log("Hii");
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
						//var clickedprotein = pickingData.atom.name;
						//console.log(clickedprotein);
						var proteinindex = -1;
						for(var i = 0; i < pdbidlist.length; i++){
							var currname = pdbidlist[i];
							if(currname === clickedprotein){
								proteinindex = i;
							}
						}
						//console.log(proteinindex);
						var curraligntoseq = alignToSeq[proteinindex];
						d3.selectAll("rect").each(function(d){
							if(curraligntoseq[d[0]] === clickedresno || curraligntoseq[d[1]] === clickedresno){
								d3.select(this).style("fill","black");
							}
						});

						atominfo ="Clicked protein: " + clickedprotein + ", Clicked atom: "+ "[" + pickingData.atom.resname + "]" + pickingData.atom.resno + pickingData.atom.inscode + ":" + pickingData.atom.chainname + ".CA";
					}

					//i = id of the rect
					//d = data insert into rect 
					//d3.selectAll("rect").each(function(d,i){
					//clickedresno = residue index
					//d[0] d[1] = align index

					//var atominfo = "Clicked atom: "+ "[" + pickingData.atom.resname + "]" 
					//+ pickingData.atom.resno + pickingData.atom.inscode + ":" + pickingData.atom.chainname + ".CA";
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
	 * Getter function for cmsvg.
	 */
	function getcmsvg(){
		return cmsvg;
	}

	this.getcmsvg = function(){
		getcmsvg();
	}

	/**
	 * Getter function for cmngl.
	 */
	function getcmngl(){
		return cmngl;
	}

	this.getcmngl = function(){
		getcmngl();
	}	

	/**
	 * Function to call loadngl of NGL object.
	 */
	function ctloadngl(){
		cmngl.loadngl();
	}

	this.ctloadngl = function(){
		ctloadngl();
	}
	/**
	 * Function to call loadsvg of cmsvg object.
	 * @param {Integer} tag - 0 to use local file, 1 to get contact map data from NGL.
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