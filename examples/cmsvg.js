/**
 * This is a closure base class for creating an object for contact map using svg.
 * @class
 * @param {String} cmvp1 - The div assign for the contact map objct.
 * @param {String} ngl1 - The NGL object that is connected to the contact map.
 * @param {String} pdburl - The url to get contact map data.
 * @param {String} chainName - The chain ID. 
 */

/*global d3*/
/*eslint-disable no-unused-vars*/
function cmSvg(cmvp1, ngl1, pdburl, chainName){
	//main data variables
	var residuesize;
	var cmsvgdata;
	var ngl = ngl1;
	var svgurl = pdburl;
	var nglsvgdata = ngl1.svgdata();
	var residue1name;
	var chain = chainName;
	var residueindex;
	var resinscode;
	var svgsize;
	var cmvp = cmvp1;

	//contact map initilization variables
	var rects1blue;
	var rects2red;
	var classlinex;
	var classliney;
	var bAxisGroup;
	var rAxisGroup;
	var svgContainer;
	var bAxis;
	var rAxis;
	var translateVar = [0,0,0];
	var zoomon = 0;
	var unit;
	var axisScale;
	
	//brush global variables
	var disrep;
	var licrep;
	var atomPair1 = [];
	var sidechainselec1 = "(";

	/**
	 * Function for initialization of contact map.
	 * @param {String} cmvp1 - The div assign for the contact map objct.
	 * @param {Integer} size - The length of the protein 
	 * @param {Integer} svgsize1 - viewport size for the contactmap. (svgsize1 = width = height)
	 * @param {Array} residue1 - An array that contains residue number that has contact with residue2.
	 * @param {Array} residue2 - An array that contains residue number that has contact with residue1.
	 * @param {Array} residuerectdata - An array that contains contacts from residue1 and residue2.
	 */
	function initResData(cmvp1, size, svgsize1, residue1, residue2, residuerectdata){
		svgsize = svgsize1;
		
		//calculating unit
		var residueToSvg = d3.scaleLinear().domain([0,size]).range([0,svgsize]);

		unit = svgsize/size;


		//creating svg
		var inputvp = "#"+cmvp1;
		svgContainer = d3.select(inputvp).append("svg")
											.attr("width", svgsize)
											.attr("height", svgsize);							


		//mouse hover
		var coordx;
		var coordy;
		var mousetag = 0;
		var repr;
		var repr1;
		var divtag = 0;
		var div;
		function mouseover(p){	

			//creating and deleting div
			if(divtag === 0){
				//div for tooltips
				//.style("text-align", "center")
				div = d3.select("body").append("div")
										.attr("class", "tooltip")
										.style("opacity", 0)
										.style("position", "absolute")
										.style("text-align", "center")
										.style("width", "110px")
										.style("height", "15px")
										.style("padding","5px")
										.style("font", "12px sans-serif")
										.style("background", "#FFDAB9")
										.style("border-radius", "8px");	
			}
			if(divtag === 1){
				div.remove();
				div = d3.select("body").append("div")
										.attr("class", "tooltip")
										.style("opacity", 0)
										.style("position", "absolute")
										.style("text-align", "center")
										.style("width", "110px")
										.style("height", "15px")
										.style("padding","5px")
										.style("font", "12px sans-serif")
										.style("background", "#FFDAB9")
										.style("border-radius", "8px");
			}
			divtag = 1;

			//change opacity when mouse over
			d3.select(this).style("opacity", 0.5);
			
			coordx = p[0];
			coordy = p[1];

			//showing distance and sidechain on ngl when mouse over in contact map
			if(mousetag === 1){
				ngl.getStructureComp().removeRepresentation(repr);
				ngl.getStructureComp().removeRepresentation(repr1);
			}

			var inputx, inputy, sidechainx, sidechainy;

			//checking if this residueindex has inscode
			if(resinscode[coordx] === 1){
				//getting the resno
				var resxindex = residueindex[coordx].substring(0,residueindex[coordx].length-1);
				//getting the letter
				inputx = resxindex + "^" + residueindex[coordx].slice(-1) + ".CA";
				sidechainx = resxindex + "^" + residueindex[coordx].slice(-1) + ":" + chain;
			}

			if(resinscode[coordy] === 1){
				var resyindex = residueindex[coordy].substring(0,residueindex[coordy].length-1);
				inputy = resyindex + "^" + residueindex[coordy].slice(-1) + ".CA";
				sidechainy = resyindex + "^" + residueindex[coordy].slice(-1) + ":" + chain;
			}

			if(resinscode[coordx] !== 1){
				inputx = residueindex[coordx] + "^" + ".CA";
				sidechainx = residueindex[coordx] + "^" + ":" + chain;
			}

			if(resinscode[coordy] !== 1){
				inputy = residueindex[coordy] + "^" + ".CA";
				sidechainy = residueindex[coordy] + "^" + ":" + chain;
			}

			var atomPair = [[inputx,inputy]];
			//console.log(atomPair);
			
			var sidechainselec = "("+sidechainx +" or "+ sidechainy +")" ;
			//console.log(ngl.getStructureComp());
			repr = ngl.getStructureComp().addRepresentation( "distance", { atomPair: atomPair });
			repr1 = ngl.getStructureComp().addRepresentation( "licorice", { sele: sidechainselec});
			mousetag = 1;
			

			//tooltip box
			//				.duration(200)
			div.transition()
				.style("opacity", .9);
			div.text(residueindex[p[0]] +" " + residue1name[p[0]] + ", " + residueindex[p[1]] + " " + residue1name[p[1]])
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 30) + "px");
		}

		//tooltip disapear when mouseout
		function mouseout(){
			//tooltip disapear
			//.duration(100)
			div.transition()
			.style("opacity", 0);

			div.remove();
			
			//change the opacity back to 1 when mouseout
			d3.select(this).style("opacity", 1);	

			//clear ngl
			ngl.getStructureComp().removeRepresentation(repr);	
			ngl.getStructureComp().removeRepresentation(repr1);		       
		}

		//drawing only one background gray rect with white lines
		var grayrectdata = [];
		grayrectdata.push([0,0]);
		var rectsgray = svgContainer.append("g").attr("class", "gray");
		var rects = rectsgray.selectAll("rect").data(grayrectdata).enter().append("rect");
		rects.attr("x", function(d){return d[0];})
							.attr("y", function(d){return d[1];})
							.attr("height", svgsize)
							.attr("width", svgsize)
							.style("fill", "#eee");
							
		//creating lines
		var linedata = [];
		for(var i = 0; i < svgsize; i = i+unit){
			linedata.push([i,0]);
		}

		classlinex = svgContainer.append("g").attr("class", "linex");
		var classlinexs = classlinex.selectAll("line").data(linedata).enter().append("line");
		classlinexs.attr("x1", function(d){return d[0];})
			.attr("y1", function(d){return d[1];})
			.attr("x2", function(d){return d[0];})
			.attr("y2", svgsize)
			.attr("stroke", "white")
			.attr("stroke-width", unit/10);


		classliney = svgContainer.append("g").attr("class", "liney");
		var classlineys = classliney.selectAll("line").data(linedata).enter().append("line");
		classlineys.attr("y1", function(d){return d[1];})
			.attr("y1", function(d){return d[0];})
			.attr("x2", svgsize)
			.attr("y2", function(d){return d[0];})
			.attr("stroke", "white")
			.attr("stroke-width", unit/10);		

		//creating scale for axis 
		//domain: length of the residue, range: length of svgcontainer
		axisScale = d3.scaleLinear().domain([0,size]).range([0,svgsize]);

		bAxis = d3.axisBottom().scale(axisScale).tickFormat(function(i){return residueindex[i]});
		rAxis = d3.axisRight().scale(axisScale).tickFormat(function(i){return residueindex[i]});
		bAxisGroup = svgContainer.append("g").call(bAxis);
		rAxisGroup = svgContainer.append("g").call(rAxis);


		//drawing the blue residue rect
		rects1blue = svgContainer.append("g").attr("class", "blue");
		var rects1 = rects1blue.selectAll("rect").data(residuerectdata).enter().append("rect");
		rects1.attr("x", function(d){return residueToSvg(d[0]);})
							.attr("y", function(d){return residueToSvg(d[1]);})
							.attr("height", unit)
							.attr("width", unit)
							.style("fill", "steelblue")
							.on("mouseover", mouseover)
							.on("mouseout", mouseout);
	}

	/**
	 * Brushstart when mouse click and drag.
	 */
	function brushstart(){
		var s = d3.event.selection;
		var xstart, xend, ystart, yend;
		
		//clear everything
		d3.selectAll(".blue").selectAll("rect").style("fill", "steelblue");
		ngl.getStructureComp().removeRepresentation(disrep);	
		ngl.getStructureComp().removeRepresentation(licrep);
		atomPair1 = [];
		sidechainselec1 = "(";


		//when zoom already started
		if(zoomon === 1){
			xstart = Math.floor((s[0][0]-translateVar[0])/translateVar[2]);
			xend = Math.floor((s[1][0]-translateVar[0])/translateVar[2]);
			ystart = Math.floor((s[0][1]-translateVar[1])/translateVar[2]);
			yend = Math.floor((s[1][1]-translateVar[1])/translateVar[2]);	
		}
		//when zoom havent started yet
		if(zoomon === 0){
			xstart =  Math.floor(s[0][0]);
			xend =  Math.floor(s[1][0]);
			ystart =  Math.floor(s[0][1]);
			yend =  Math.floor(s[1][1]);
		}

		//saving representation info while dragging
		d3.selectAll(".blue").selectAll("rect").each(function(d){
			if(d[0]*unit >= xstart && d[0]*unit <= xend && d[1]*unit >= ystart && d[1]*unit <= yend){
				d3.select(this).style("fill","PaleVioletRed");

				var inputx, inputy, sidechainx, sidechainy;
				if(resinscode[d[0]] === 1){
					var resxindex = residueindex[d[0]].substring(0,residueindex[d[0]].length-1);
					inputx = resxindex + "^" + residueindex[d[0]].slice(-1)+ ".CA";
					sidechainx = resxindex + "^" + residueindex[d[0]].slice(-1)+ ":" + chain;
				}

				if(resinscode[d[1]] === 1){
					var resyindex = residueindex[d[1]].substring(0,residueindex[d[1]].length-1);
					inputy = resyindex + "^" + residueindex[d[1]].slice(-1)+ ".CA";
					sidechainy = resyindex + "^" + residueindex[d[1]].slice(-1)+ ":" + chain;
				}

				if(resinscode[d[0]] !== 1){
					inputx = residueindex[d[0]] + "^" + ".CA";
					sidechainx = residueindex[d[0]] + "^" + ":" + chain;
				}

				if(resinscode[d[1]] !== 1){
					inputy = residueindex[d[1]] + "^" + ".CA";
					sidechainy = residueindex[d[1]] + "^" + ":" + chain;
				}

				atomPair1.push([inputx,inputy]);
				sidechainselec1 = sidechainselec1 + sidechainx + " or " + sidechainy + " or ";
			}
		});
				
	}
	/**
	 * Brushend when release mouse.
	 */
	function brushend(){
		if(!d3.event.selection){
			//clear everything when click on gray rect
			d3.selectAll(".blue").selectAll("rect").style("fill", "steelblue");
			atomPair1 = [];
			sidechainselec1 = "(";
			ngl.getStructureComp().removeRepresentation(disrep);	
			ngl.getStructureComp().removeRepresentation(licrep);
			//svgContainer.selectAll(".brush").call(brush.move, null);
		}

		else{
			sidechainselec1 = sidechainselec1.substring(0, sidechainselec1.length-3);
			sidechainselec1 = sidechainselec1 + ")";
			if(sidechainselec1 !== ")"){
				disrep = ngl.getStructureComp().addRepresentation("distance", { atomPair: atomPair1 });
				licrep = ngl.getStructureComp().addRepresentation("licorice", { sele: sidechainselec1});
			}
		}
	}

	/**
	 * Function for selecting residue in the contact map.
	 * @param {Integer} brushon - 0 to disable the function and 1 to enable the function.
	 */
	function brush(brushon){

		if(brushon === 1){
			var brush = d3.brush()
						.on("start brush", brushstart)
						.on("end", brushend);
			svgContainer.append("g")
				.attr("class", "brush")
				.call(brush);	
		}

		else{
			d3.selectAll(".blue").selectAll("rect").style("fill", "steelblue");
			atomPair1 = [];
			sidechainselec1 = "";
			ngl.getStructureComp().removeRepresentation(disrep);	
			ngl.getStructureComp().removeRepresentation(licrep);
			d3.selectAll(".brush").remove();
		}
	}

	/**
	 * Tranform components when zoom function is called.
	 */
	function zoomed() {
		//saving transform identity
		translateVar[0] = d3.event.transform.x;
		translateVar[1] = d3.event.transform.y;
		translateVar[2] = d3.event.transform.k;
		//applying zoom
		rects1blue.attr("transform", d3.event.transform);
		//rects2red.attr("transform", d3.event.transform);
		classlinex.attr("transform", d3.event.transform);
		classliney.attr("transform", d3.event.transform);
		bAxisGroup.call(bAxis.scale(d3.event.transform.rescaleX(axisScale)));
		rAxisGroup.call(rAxis.scale(d3.event.transform.rescaleY(axisScale)));
	}


	/**
	 * Zoom function for contact map.
	 * @param {Integer} zoomtag - 0 to disable the function and 1 to enable the function.
	 */
	function zoom(zoomtag){
		//zoom function
		if(zoomtag === 1){
			zoomon = 1;
			var zoomfactor;
			if(residuesize <= 200){
				//zoomfactor = 2;
				zoomfactor = 100;
			}
			if(residuesize > 200){
				//zoomfactor = size/100;
				zoomfactor = 100;
			}

			//console.log("svgsize: " + svgsize);
			var zoom = d3.zoom()
						.scaleExtent([1, zoomfactor])
						.translateExtent([[0, 0], [svgsize, svgsize]])
						.on("zoom", zoomed);

			svgContainer.call(zoom);
			
		}
		else{
			svgContainer.call(d3.zoom().on("zoom", null));
		}
	}

	/**
	 * Function to prepare data for contact map.
	 * @param {Integer} tag - 0 to use local file, 1 to get contact map data from NGL.
	 * @param {Integer} svgsize1 - viewport size for the contactmap. (svgsize1 = width = height)
	 */
	function loadsvg(tag, svgsize1){
		//"http://localhost:8000/examples/5sx3.json"
		//using local file		
		//D3 json method
		if(tag === 0){
			d3.json(svgurl, function(data){
				
				//getting res size
				var size = data.ressize;

				//D3 Json method
				var residue1 = data.residue1;
				var residue2 = data.residue2;

				//creating residuedataset
				var residuerectdata = [];
				for(var k = 0; k < residue1.length; k++){
					residuerectdata.push([residue1[k], residue2[k]]);
					residuerectdata.push([residue2[k], residue1[k]]);
				}	

				//set data and residuesize
				cmsvgdata = data;
				residuesize = size;

				initResData(cmvp1, size, svgsize1, residue1, residue2, residuerectdata);

			});
		}

		
		//NGL Method
		if(tag === 1){

			//Set contacts
			var residue1 = nglsvgdata.residue1;
			var residue2 = nglsvgdata.residue2;
			residue1name = nglsvgdata.residue1name;

			//creating residuedataset
			var residuerectdata = [];
			for(var k = 0; k < residue1.length; k++){
				residuerectdata.push([residue1[k], residue2[k]]);
			}	

			residueindex = nglsvgdata.resindex;
			resinscode = nglsvgdata.resinscode;
			//Set res size
			var size = residueindex.length;

			//set data and residuesize
			cmsvgdata = nglsvgdata;
			residuesize = size;

			initResData(cmvp1, size, svgsize1, residue1, residue2, residuerectdata);

		}


		
		if(tag === 2){
			var testurl = "http://localhost:8000/examples/4hhb.json";
			d3.json(testurl, function(data){
				
				var contact1 = data.residue1;
				var contact2 = data.residue2;
				//console.log(contact1);
				//console.log(contact2);



				var align1 = "-VLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTKTYFPHFDL------SHGSAQVKGHGKKVADALTNAVAHVDDMPNALSALSDLHAHKLRVDPVNFKLLSHCLLVTLAAHLPAEFTPAVHASLDKFLASVSTVLTSKYR";
				var align2 = "VHLTPEEKSAVTALWGKV--NVDEVGGEALGRLLVVYPWTQRFFESFGDLSTPDAVMGNPKVKAHGKKVLGAFSDGLAHLDNLKGTFATLSELHCDKLHVDPENFRLLGNVLVCVLAHHFGKEFTPPVQAAYQKVVAGVANALAHKYH";
				var alignarry = [];
				alignarry[0] = align1;
				alignarry[1] = align2;
				var alignlength = Number(align1.length);
				//var seq1length = 141;
				//var seq2length = 146;

				console.log(alignlength);

				//function
				var alignToSeq = [];
				var seqToAlign = [];
				for(var a = 0; a < alignarry.length; a++){
					var index1 = 0;
					var index2 = 1;
					var map1 = [];
					var map2 = [];
					for(var i = 0; i < alignlength; i++){
						var currentalign = alignarry[a];
						var currentchar = currentalign[i];

						if(currentchar !== "-"){
							map1[i] = index1;
							index1++;

							map2[index2] = i;
							index2++;
						}
						else{
							map1[i] = -1;
						}
					}
					alignToSeq.push(map1);
					seqToAlign.push(map2);
				}
				console.log("AlignToSeq:");
				console.log(alignToSeq);
				console.log("SeqToAlign:");
				console.log(seqToAlign);
				


				//drawing
				//initResData(cmvp1, size, svgsize1, residue1, residue2, residuerectdata);
				svgsize = svgsize1;
				var size = alignlength;
				residuesize = size;
				
				//calculating unit
				//axisScale = d3.scaleLinear().domain([0,size]).range([0,svgsize]);
				var residueToSvg = d3.scaleLinear().domain([0,size]).range([0,svgsize]);
				unit = svgsize/size;


				//creating svg
				var inputvp = "#"+cmvp1;
				svgContainer = d3.select(inputvp).append("svg")
													.attr("width", svgsize)
													.attr("height", svgsize);




				//mouse hover
				var coordx;
				var coordy;
				var mousetag = 0;
				var repr;
				var repr1;
				var divtag = 0;
				var div;
				function mouseover(p){	

					//creating and deleting div
					if(divtag === 0){
						//div for tooltips
						//.style("text-align", "center")
						div = d3.select("body").append("div")
												.attr("class", "tooltip")
												.style("opacity", 0)
												.style("position", "absolute")
												.style("text-align", "center")
												.style("width", "110px")
												.style("height", "15px")
												.style("padding","5px")
												.style("font", "12px sans-serif")
												.style("background", "#FFDAB9")
												.style("border-radius", "8px");	
					}
					if(divtag === 1){
						div.remove();
						div = d3.select("body").append("div")
												.attr("class", "tooltip")
												.style("opacity", 0)
												.style("position", "absolute")
												.style("text-align", "center")
												.style("width", "110px")
												.style("height", "15px")
												.style("padding","5px")
												.style("font", "12px sans-serif")
												.style("background", "#FFDAB9")
												.style("border-radius", "8px");
					}
					divtag = 1;

					//change opacity when mouse over
					d3.select(this).style("opacity", 0.5);
					
					coordx = p[0];
					coordy = p[1];
					
					//tooltip box
					//.duration(200)
					div.transition()
						.style("opacity", .9);
					//div.text(residueindex[p[0]] +" " + residue1name[p[0]] + ", " + residueindex[p[1]] + " " + residue1name[p[1]])
					div.text(p[0] +" " + ", " + p[1] + " ")
						.style("left", (d3.event.pageX) + "px")
						.style("top", (d3.event.pageY - 30) + "px");
				}

				//tooltip disapear when mouseout
				function mouseout(){
					//tooltip disapear
					//.duration(100)
					div.transition()
					.style("opacity", 0.5);

					div.remove();
					
					//change the opacity back to 1 when mouseout
					d3.select(this).style("opacity", 0.5);	

					//clear ngl
					//ngl.getStructureComp().removeRepresentation(repr);	
					//ngl.getStructureComp().removeRepresentation(repr1);		       
				}



				//drawing only one background gray rect with white lines
				var grayrectdata = [];
				grayrectdata.push([0,0]);
				var rectsgray = svgContainer.append("g").attr("class", "gray");
				var rects = rectsgray.selectAll("rect").data(grayrectdata).enter().append("rect");
				rects.attr("x", function(d){return d[0];})
									.attr("y", function(d){return d[1];})
									.attr("height", svgsize)
									.attr("width", svgsize)
									.style("fill", "#eee");
									
				//creating lines
				var linedata = [];
				for(var i = 0; i < svgsize; i = i+unit){
					linedata.push([i,0]);
				}

				classlinex = svgContainer.append("g").attr("class", "linex");
				var classlinexs = classlinex.selectAll("line").data(linedata).enter().append("line");
				classlinexs.attr("x1", function(d){return d[0];})
					.attr("y1", function(d){return d[1];})
					.attr("x2", function(d){return d[0];})
					.attr("y2", svgsize)
					.attr("stroke", "white")
					.attr("stroke-width", unit/10);


				classliney = svgContainer.append("g").attr("class", "liney");
				var classlineys = classliney.selectAll("line").data(linedata).enter().append("line");
				classlineys.attr("y1", function(d){return d[1];})
					.attr("y1", function(d){return d[0];})
					.attr("x2", svgsize)
					.attr("y2", function(d){return d[0];})
					.attr("stroke", "white")
					.attr("stroke-width", unit/10);

				//creating scale for axis 
				//domain: length of the residue, range: length of svgcontainer
				axisScale = d3.scaleLinear().domain([0,size]).range([0,svgsize]);

				bAxis = d3.axisBottom().scale(axisScale);
				rAxis = d3.axisRight().scale(axisScale);
				bAxisGroup = svgContainer.append("g").call(bAxis);
				rAxisGroup = svgContainer.append("g").call(rAxis);


				//drawing the blue residue rect
				var contactarry = [];
				contactarry[0] = contact1;
				contactarry[1] = contact2;

				var round = 2;
				var sta1 = seqToAlign[0];
				var sta2 = seqToAlign[1];
				for(var i = 0; i < round; i++){
					var mapping = seqToAlign[i];
					var tempcontact = contactarry[i];
					var temparr = [];

					for(var k = 0; k < tempcontact.length; k++){
						temparr.push([mapping[tempcontact[k][0]], mapping[tempcontact[k][1]]]);
						temparr.push([mapping[tempcontact[k][1]], mapping[tempcontact[k][0]]]);
					}
					contactarry[i] = temparr;
				}


				
				var sta1 = seqToAlign[0];
				var sta2 = seqToAlign[1];

				var temparry1 = [];
				for(var k = 0; k < contact1.length; k++){
					temparry1.push([sta1[contact1[k][0]], sta1[contact1[k][1]]]);
					temparry1.push([sta1[contact1[k][1]], sta1[contact1[k][0]]]);
				}
				contact1 = temparry1;

				var temparry2 = [];
				for(var k = 0; k < contact2.length; k++){
					temparry2.push([sta2[contact2[k][0]], sta2[contact2[k][1]]]);
					temparry2.push([sta2[contact2[k][1]], sta2[contact2[k][0]]]);
				}		
				contact2 = temparry2;	

				//console.log("maxres: "+ maxres);
				//console.log("sta1: " + sta1.length);
				//console.log("max sta1: "+ sta1[140]);
				//console.log("sta1: "+ sta1[0]);
				//console.log("sta2: "+ sta2[0]);

				
				rects1blue = svgContainer.append("g").attr("class", "blue");
				var rects1 = rects1blue.selectAll("rect").data(contactarry[0]).enter().append("rect");
				rects1.attr("x", function(d){return residueToSvg(d[0]);})
									.attr("y", function(d){return residueToSvg(d[1]);})
									.attr("height", unit)
									.attr("width", unit)
									.style("fill", "steelblue")
									.style("opacity", 0.5)
									.on("mouseover", mouseover)
									.on("mouseout", mouseout);


				
				rects2red = svgContainer.append("g").attr("class", "red");
				var rects2 = rects2red.selectAll("rect").data(contactarry[1]).enter().append("rect");
				rects2.attr("x", function(d){return residueToSvg(d[0]);})
									.attr("y", function(d){return residueToSvg(d[1]);})
									.attr("height", unit)
									.attr("width", unit)
									.style("fill", "red")
									.style("opacity", 0.5)
									.on("mouseover", mouseover)
									.on("mouseout", mouseout);


				
				function zoomed1() {
					//saving transform identity
					translateVar[0] = d3.event.transform.x;
					translateVar[1] = d3.event.transform.y;
					translateVar[2] = d3.event.transform.k;
					//applying zoom
					rects1blue.attr("transform", d3.event.transform);
					rects2red.attr("transform", d3.event.transform);
					classlinex.attr("transform", d3.event.transform);
					classliney.attr("transform", d3.event.transform);
					bAxisGroup.call(bAxis.scale(d3.event.transform.rescaleX(axisScale)));
					rAxisGroup.call(rAxis.scale(d3.event.transform.rescaleY(axisScale)));
				}

				
				//zoomon = 1;
				var zoomfactor;
				if(residuesize <= 200){
					//zoomfactor = 2;
					zoomfactor = 100;
				}
				if(residuesize > 200){
					//zoomfactor = size/100;
					zoomfactor = 100;
				}

				//console.log("svgsize: " + svgsize);
				var zoom = d3.zoom()
							.scaleExtent([1, zoomfactor])
							.translateExtent([[0, 0], [svgsize, svgsize]])
							.on("zoom", zoomed1);

				svgContainer.call(zoom);
				

			});
		}
	}


	this.loadsvg = function(tag, svgsize1){
		loadsvg(tag, svgsize1);
	}

	this.zoom = function(zoomtag){
		zoom(zoomtag);
	}

	this.brush = function(brushon){
		brush(brushon);
	}

	this.getcmdata = function(){
		return cmsvgdata;
	}

	this.getresiduesize = function(){
		return residuesize;
	}

}


























































































































































function cmSvg1(cmvp1, ngl1, alignArr, pdbidlist){
	//main data variables
	var residuesize;
	var cmsvgdata;
	var ngl = ngl1;
	//var svgurl = pdburl;
	var nglsvgdatalist = ngl1.svgdatalist();
	var nglsvgdata = nglsvgdatalist[0];
	var residue1name;
	var pdblist = pdbidlist;
	var chainlist = ngl1.chainlist();
	var chain = chainlist[0];
	var residueindex;
	var resinscode;
	var svgsize;
	var cmvp = cmvp1;
	var strucomplist = ngl.getStructureComplist();

	//contact map initilization variables
	var reclist = [];
	var rects1blue;
	var rects2red;
	var classlinex;
	var classliney;
	var bAxisGroup;
	var rAxisGroup;
	var svgContainer;
	var bAxis;
	var rAxis;
	var translateVar = [0,0,0];
	var zoomon = 0;
	var unit;
	var axisScale;
	var rectnamelist = [];
	var colorlist = d3.schemeCategory10;
	var sameContact = [];
	var alignToSeq = [];
	var resIndexToresNoList = [];
	var resInscodeList = [];
	
	//brush global variables
	var disrep;
	var licrep;
	var atomPair1 = [];
	var sidechainselec1 = "(";
	var atomPairlist = [];
	var sidechainseleclist = [];
	var brushreprlist = [];
	var brushmsa = 0;




	function initbrushlist(atompairlist, sidechainlist){
		for(var i = 0; i < nglsvgdatalist.length; i++){
			var list = [];
			var str = "";

			atompairlist[i] = [];
			sidechainlist[i] = "";
		}

		//console.log(atomPairlist);
		//console.log(sidechainseleclist);
	}



	function removenglrepr(repr){
		for(var i = 0; i < strucomplist.length; i++){
			var currstruc = strucomplist[i];
			currstruc.removeRepresentation(repr);
		}
	}





	/**
	 * Function for initialization of contact map.
	 * @param {String} cmvp1 - The div assign for the contact map objct.
	 * @param {Integer} size - The length of the protein 
	 * @param {Integer} svgsize1 - viewport size for the contactmap. (svgsize1 = width = height)
	 * @param {Array} residue1 - An array that contains residue number that has contact with residue2.
	 * @param {Array} residue2 - An array that contains residue number that has contact with residue1.
	 * @param {Array} residuerectdata - An array that contains contacts from residue1 and residue2.
	 */
	function initResData(cmvp1, size, svgsize1, residue1, residue2, residuerectdata){
		svgsize = svgsize1;
		
		//calculating unit
		var residueToSvg = d3.scaleLinear().domain([0,size]).range([0,svgsize]);

		unit = svgsize/size;


		//creating svg
		var inputvp = "#"+cmvp1;
		svgContainer = d3.select(inputvp).append("svg")
											.attr("width", svgsize)
											.attr("height", svgsize);							


		//mouse hover
		var coordx;
		var coordy;
		var mousetag = 0;
		var repr;
		var repr1;
		var divtag = 0;
		var div;
		function mouseover(p){	

			//creating and deleting div
			if(divtag === 0){
				//div for tooltips
				//.style("text-align", "center")
				div = d3.select("body").append("div")
										.attr("class", "tooltip")
										.style("opacity", 0)
										.style("position", "absolute")
										.style("text-align", "center")
										.style("width", "110px")
										.style("height", "15px")
										.style("padding","5px")
										.style("font", "12px sans-serif")
										.style("background", "#FFDAB9")
										.style("border-radius", "8px");	
			}
			if(divtag === 1){
				div.remove();
				div = d3.select("body").append("div")
										.attr("class", "tooltip")
										.style("opacity", 0)
										.style("position", "absolute")
										.style("text-align", "center")
										.style("width", "110px")
										.style("height", "15px")
										.style("padding","5px")
										.style("font", "12px sans-serif")
										.style("background", "#FFDAB9")
										.style("border-radius", "8px");
			}
			divtag = 1;

			//change opacity when mouse over
			d3.select(this).style("opacity", 0.5);
			
			coordx = p[0];
			coordy = p[1];

			//console.log(p[2]);

			//showing distance and sidechain on ngl when mouse over in contact map
			if(mousetag === 1){
				/*var scomplist = ngl.getStructureComplist();
				var scomp = scomplist[0];
				scomp.removeRepresentation(repr);
				scomp.removeRepresentation(repr1);*/
				//ngl.getStructureComp().removeRepresentation(repr);
				//ngl.getStructureComp().removeRepresentation(repr1);
				removenglrepr(repr);
				removenglrepr(repr1);
			}

			var inputx, inputy, sidechainx, sidechainy;

			//checking if this residueindex has inscode
			if(resinscode[coordx] === 1){
				//getting the resno
				var resxindex = residueindex[coordx].substring(0,residueindex[coordx].length-1);
				//getting the letter
				inputx = resxindex + "^" + residueindex[coordx].slice(-1) + ".CA";
				sidechainx = resxindex + "^" + residueindex[coordx].slice(-1) + ":" + chain;
			}

			if(resinscode[coordy] === 1){
				var resyindex = residueindex[coordy].substring(0,residueindex[coordy].length-1);
				inputy = resyindex + "^" + residueindex[coordy].slice(-1) + ".CA";
				sidechainy = resyindex + "^" + residueindex[coordy].slice(-1) + ":" + chain;
			}
			//+ "^"
			if(resinscode[coordx] !== 1){
				inputx = residueindex[coordx] + "^" + ".CA";
				sidechainx = residueindex[coordx] + "^" + ":" + chain;
			}

			if(resinscode[coordy] !== 1){
				inputy = residueindex[coordy] + "^" + ".CA";
				sidechainy = residueindex[coordy] + "^" + ":" + chain;
			}

			//console.log(inputx);
			//console.log(inputy);

			var atomPair = [[inputx,inputy]];
			//console.log(atomPair);
			var sidechainselec = "("+sidechainx +" or "+ sidechainy +")" ;
			//console.log(ngl);
			var scomplist = ngl.getStructureComplist();
			var scomp = scomplist[0];
			//repr = ngl.getStructureComp().addRepresentation( "distance", { atomPair: atomPair });
			//repr1 = ngl.getStructureComp().addRepresentation( "licorice", { sele: sidechainselec});
			repr = scomp.addRepresentation( "distance", { atomPair: atomPair });
			repr1 = scomp.addRepresentation( "licorice", { sele: sidechainselec});
			mousetag = 1;
			

			//console.log(p[0]);
			//console.log(p[1]);


			//tooltip box
			//				.duration(200)
			div.transition()
				.style("opacity", .9);
			div.text(residueindex[p[0]] +" " + residue1name[p[0]] + ", " + residueindex[p[1]] + " " + residue1name[p[1]])
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 30) + "px");
		}

		//tooltip disapear when mouseout
		function mouseout(){
			//tooltip disapear
			//.duration(100)
			div.transition()
			.style("opacity", 0);

			div.remove();
			
			//change the opacity back to 1 when mouseout
			d3.select(this).style("opacity", 1);	

			//clear ngl
			/*var scomplist = ngl.getStructureComplist();
			var scomp = scomplist[0];
			scomp.removeRepresentation(repr);
			scomp.removeRepresentation(repr1);*/
			//ngl.getStructureComp().removeRepresentation(repr);	
			//ngl.getStructureComp().removeRepresentation(repr1);
			removenglrepr(repr);
			removenglrepr(repr1);


		}

		//drawing only one background gray rect with white lines
		var grayrectdata = [];
		grayrectdata.push([0,0]);
		var rectsgray = svgContainer.append("g").attr("class", "gray");
		var rects = rectsgray.selectAll("rect").data(grayrectdata).enter().append("rect");
		rects.attr("x", function(d){return d[0];})
							.attr("y", function(d){return d[1];})
							.attr("height", svgsize)
							.attr("width", svgsize)
							.style("fill", "#eee");
							
		//creating lines
		var linedata = [];
		for(var i = 0; i < svgsize; i = i+unit){
			linedata.push([i,0]);
		}

		classlinex = svgContainer.append("g").attr("class", "linex");
		var classlinexs = classlinex.selectAll("line").data(linedata).enter().append("line");
		classlinexs.attr("x1", function(d){return d[0];})
			.attr("y1", function(d){return d[1];})
			.attr("x2", function(d){return d[0];})
			.attr("y2", svgsize)
			.attr("stroke", "white")
			.attr("stroke-width", unit/10);


		classliney = svgContainer.append("g").attr("class", "liney");
		var classlineys = classliney.selectAll("line").data(linedata).enter().append("line");
		classlineys.attr("y1", function(d){return d[1];})
			.attr("y1", function(d){return d[0];})
			.attr("x2", svgsize)
			.attr("y2", function(d){return d[0];})
			.attr("stroke", "white")
			.attr("stroke-width", unit/10);		

		//creating scale for axis
		//domain: length of the residue, range: length of svgcontainer
		axisScale = d3.scaleLinear().domain([0,size]).range([0,svgsize]);

		bAxis = d3.axisBottom().scale(axisScale).tickFormat(function(i){return residueindex[i]});
		rAxis = d3.axisRight().scale(axisScale).tickFormat(function(i){return residueindex[i]});
		bAxisGroup = svgContainer.append("g").call(bAxis);
		rAxisGroup = svgContainer.append("g").call(rAxis);


		//drawing the blue residue rect
		rects1blue = svgContainer.append("g").attr("class", "blue");
		var rects1 = rects1blue.selectAll("rect").data(residuerectdata).enter().append("rect");
		rects1.attr("x", function(d){return residueToSvg(d[0]);})
							.attr("y", function(d){return residueToSvg(d[1]);})
							.attr("height", unit)
							.attr("width", unit)
							.style("fill", "steelblue")
							.on("mouseover", mouseover)
							.on("mouseout", mouseout);

							//.style("opacity", 0.5)

		reclist.push(rects1blue);
	}

	/**
	 * Brushstart when mouse click and drag.
	 */
	function brushstart(){
		var s = d3.event.selection;
		var xstart, xend, ystart, yend;
		
		//clear everything
		if(brushmsa === 0){
			d3.selectAll(".blue").selectAll("rect").style("fill", "steelblue");
			/*var scomplist = ngl.getStructureComplist();
			var scomp = scomplist[0];
			scomp.removeRepresentation(disrep);	
			scomp.removeRepresentation(licrep);*/
			//ngl.getStructureComp().removeRepresentation(disrep);	
			//ngl.getStructureComp().removeRepresentation(licrep);
			removenglrepr(disrep);
			removenglrepr(licrep);
			atomPair1 = [];
			sidechainselec1 = "(";
		}
		/*
		d3.selectAll(".blue").selectAll("rect").style("fill", "steelblue");
		removenglrepr(disrep);
		removenglrepr(licrep);
		atomPair1 = [];
		sidechainselec1 = "";*/
		if(brushmsa === 1){
			for(var i = 0 ; i < rectnamelist.length; i++){
				var classname = "."+rectnamelist[i];
				d3.selectAll(classname).selectAll("rect").style("fill", colorlist[i]).style("opacity", 0.5);
			}

			for(var i = 0 ; i < brushreprlist.length; i++){
				removenglrepr(brushreprlist[i]);
			}
			atomPair1 = [];
			sidechainselec1 = "(";
			initbrushlist(atomPairlist,sidechainseleclist);
		}


		//when zoom already started
		if(zoomon === 1){
			xstart = Math.floor((s[0][0]-translateVar[0])/translateVar[2]);
			xend = Math.floor((s[1][0]-translateVar[0])/translateVar[2]);
			ystart = Math.floor((s[0][1]-translateVar[1])/translateVar[2]);
			yend = Math.floor((s[1][1]-translateVar[1])/translateVar[2]);	
		}
		//when zoom havent started yet
		if(zoomon === 0){
			xstart =  Math.floor(s[0][0]);
			xend =  Math.floor(s[1][0]);
			ystart =  Math.floor(s[0][1]);
			yend =  Math.floor(s[1][1]);
		}

		//saving representation info while dragging
		if(brushmsa === 0){
			d3.selectAll(".blue").selectAll("rect").each(function(d){
				if(d[0]*unit >= xstart && d[0]*unit <= xend && d[1]*unit >= ystart && d[1]*unit <= yend){
					d3.select(this).style("fill","PaleVioletRed");

					var inputx, inputy, sidechainx, sidechainy;
					if(resinscode[d[0]] === 1){
						var resxindex = residueindex[d[0]].substring(0,residueindex[d[0]].length-1);
						inputx = resxindex + "^" + residueindex[d[0]].slice(-1)+ ".CA";
						sidechainx = resxindex + "^" + residueindex[d[0]].slice(-1)+ ":" + chain;
					}

					if(resinscode[d[1]] === 1){
						var resyindex = residueindex[d[1]].substring(0,residueindex[d[1]].length-1);
						inputy = resyindex + "^" + residueindex[d[1]].slice(-1)+ ".CA";
						sidechainy = resyindex + "^" + residueindex[d[1]].slice(-1)+ ":" + chain;
					}

					if(resinscode[d[0]] !== 1){
						inputx = residueindex[d[0]] + "^" + ".CA";
						sidechainx = residueindex[d[0]] + "^" + ":" + chain;
					}

					if(resinscode[d[1]] !== 1){
						inputy = residueindex[d[1]] + "^" + ".CA";
						sidechainy = residueindex[d[1]] + "^" + ":" + chain;
					}

					atomPair1.push([inputx,inputy]);
					sidechainselec1 = sidechainselec1 + sidechainx + " or " + sidechainy + " or ";
				}
			});
		}
		/*
		d3.selectAll(".blue").selectAll("rect").each(function(d){
			if(d[0]*unit >= xstart && d[0]*unit <= xend && d[1]*unit >= ystart && d[1]*unit <= yend){
				d3.select(this).style("fill","PaleVioletRed");

				var inputx, inputy, sidechainx, sidechainy;
				if(resinscode[d[0]] === 1){
					var resxindex = residueindex[d[0]].substring(0,residueindex[d[0]].length-1);
					inputx = resxindex + "^" + residueindex[d[0]].slice(-1)+ ".CA";
					sidechainx = resxindex + "^" + residueindex[d[0]].slice(-1)+ ":" + chain;
				}

				if(resinscode[d[1]] === 1){
					var resyindex = residueindex[d[1]].substring(0,residueindex[d[1]].length-1);
					inputy = resyindex + "^" + residueindex[d[1]].slice(-1)+ ".CA";
					sidechainy = resyindex + "^" + residueindex[d[1]].slice(-1)+ ":" + chain;
				}

				if(resinscode[d[0]] !== 1){
					inputx = residueindex[d[0]] + "^" + ".CA";
					sidechainx = residueindex[d[0]] + "^" + ":" + chain;
				}

				if(resinscode[d[1]] !== 1){
					inputy = residueindex[d[1]] + "^" + ".CA";
					sidechainy = residueindex[d[1]] + "^" + ":" + chain;
				}

				atomPair1.push([inputx,inputy]);
				sidechainselec1 = sidechainselec1 + sidechainx + " or " + sidechainy + " or ";
			}
		});*/

		if(brushmsa === 1){
			for(var i = 0; i < rectnamelist.length; i++){
				var classname = "."+rectnamelist[i];
				//d3.selectAll(".blue").selectAll("rect").each(function(d)
				d3.selectAll(classname).selectAll("rect").each(function(d){
					if(d[0]*unit >= xstart && d[0]*unit <= xend && d[1]*unit >= ystart && d[1]*unit <= yend){
						d3.select(this).style("fill", "black");

						var samecontactlist = sameContact[d[0]][d[1]];

						for(var i = 0; i < sameContact[d[0]][d[1]].length; i++){
							var currdata = samecontactlist[i];
							var curraligntoSeq = alignToSeq[currdata];
							var currResno = resIndexToresNoList[currdata];
							var currIndcode = resInscodeList[currdata];

							var inputx, inputy, sidechainx, sidechainy;
							var coordx = d[0];
							var coordy = d[1];

							if(currIndcode[curraligntoSeq[coordx]] === 1){
								//currResno[curraligntoSeq[coordx]]
								var resxindex = currResno[curraligntoSeq[coordx]].substring(0,currResno[curraligntoSeq[coordx]].length-1);

								inputx = resxindex + "^" + currResno[curraligntoSeq[coordx]].slice(-1) + ".CA";
								sidechainx = resxindex + "^" + currResno[curraligntoSeq[coordx]].slice(-1) + ":" + chain;
							}

							if(currIndcode[curraligntoSeq[coordy]] === 1){
								var resxindey = currResno[curraligntoSeq[coordy]].substring(0,currResno[curraligntoSeq[coordy]].length-1);

								inputy = resxindey + "^" + currResno[curraligntoSeq[coordy]].slice(-1) + ".CA";
								sidechainy = resxindey + "^" + currResno[curraligntoSeq[coordy]].slice(-1) + ":" + chain;
							}

							if(currIndcode[curraligntoSeq[coordx]] !== 1){
								inputx = currResno[curraligntoSeq[coordx]] + "^" + ".CA";
								sidechainx = currResno[curraligntoSeq[coordx]] + "^" + ":" + chain;
							}

							if(currIndcode[curraligntoSeq[coordy]] !== 1){
								inputy = currResno[curraligntoSeq[coordy]] + "^" + ".CA";
								sidechainy = currResno[curraligntoSeq[coordy]] + "^" + ":" + chain;
							}

							atomPair1.push([inputx,inputy]);
							sidechainselec1 = sidechainselec1 + sidechainx + " or " + sidechainy + " or ";

							var currpair = atomPairlist[currdata];
							var currsidechainselec = sidechainseleclist[currdata];

							currpair.push([inputx,inputy]);
							atomPairlist[currdata] = currpair;

							currsidechainselec = currsidechainselec + sidechainx + " or " + sidechainy + " or ";
							sidechainseleclist[currdata] = currsidechainselec;

						}
					}
				});
			}
		}			
	}
	/**
	 * Brushend when release mouse.
	 */
	function brushend(){
		if(!d3.event.selection){
			//clear everything when click on gray rect
			if(brushmsa === 0){
				d3.selectAll(".blue").selectAll("rect").style("fill", "steelblue");
				atomPair1 = [];
				sidechainselec1 = "";
				/*var scomplist = ngl.getStructureComplist();
				var scomp = scomplist[0];
				scomp.removeRepresentation(disrep);	
				scomp.removeRepresentation(licrep);*/
				//ngl.getStructureComp().removeRepresentation(disrep);	
				//ngl.getStructureComp().removeRepresentation(licrep);
				removenglrepr(disrep);
				removenglrepr(licrep);
			}

			if(brushmsa === 1){
				//clear everything when click on gray rect
				//d3.selectAll(".blue").selectAll("rect").style("fill", "steelblue");
				for(var i = 0 ; i < rectnamelist.length; i++){
					var classname = "."+rectnamelist[i];
					d3.selectAll(classname).selectAll("rect").style("fill", colorlist[i]).style("opacity", 0.5);
				}

				for(var i = 0 ; i < brushreprlist.length; i++){
					removenglrepr(brushreprlist[i]);
				}
				atomPair1 = [];
				sidechainselec1 = "(";
				initbrushlist(atomPairlist,sidechainseleclist);
			}
		}

		else{
			if(brushmsa === 0){
				sidechainselec1 = sidechainselec1.substring(0, sidechainselec1.length-3);
				sidechainselec1 = sidechainselec1 + ")";
				if(sidechainselec1 !== ")"){
					var scomplist = ngl.getStructureComplist();
					var scomp = scomplist[0];
					disrep = scomp.addRepresentation("distance", { atomPair: atomPair1 });
					licrep = scomp.addRepresentation("licorice", { sele: sidechainselec1});
					//disrep = ngl.getStructureComp().addRepresentation("distance", { atomPair: atomPair1 });
					//licrep = ngl.getStructureComp().addRepresentation("licorice", { sele: sidechainselec1});
				}
			}

			if(brushmsa === 1){
				for(var i = 0; i < nglsvgdatalist.length; i++){
					var currsidechainselec = sidechainseleclist[i];
					currsidechainselec = currsidechainselec.substring(0, currsidechainselec.length-3);
					currsidechainselec = currsidechainselec + ")";

					if(currsidechainselec !== ")"){
						var reprD = strucomplist[i].addRepresentation( "distance", { atomPair: atomPairlist[i] });
						var reprL = strucomplist[i].addRepresentation( "licorice", { sele: sidechainseleclist[i] });
						brushreprlist.push(reprD);
						brushreprlist.push(reprL);
					}
				}
			}
		}
	}

	/**
	 * Function for selecting residue in the contact map.
	 * @param {Integer} brushon - 0 to disable the function and 1 to enable the function.
	 */
	function brush(brushon){

		if(brushon === 1){
			var brush = d3.brush()
						.on("start brush", brushstart)
						.on("end", brushend);
			svgContainer.append("g")
				.attr("class", "brush")
				.call(brush);	
		}

		else{
			if(brushmsa === 0){
				d3.selectAll(".blue").selectAll("rect").style("fill", "steelblue");
				atomPair1 = [];
				sidechainselec1 = "";
				/*var scomplist = ngl.getStructureComplist();
				var scomp = scomplist[0];
				scomp.removeRepresentation(disrep);	
				scomp.removeRepresentation(licrep);*/
				//ngl.getStructureComp().removeRepresentation(disrep);	
				//ngl.getStructureComp().removeRepresentation(licrep);
				removenglrepr(disrep);
				removenglrepr(licrep);
				d3.selectAll(".brush").remove();
			}

			if(brushmsa === 1){
				//clear everything when click on gray rect
				//d3.selectAll(".blue").selectAll("rect").style("fill", "steelblue");
				for(var i = 0 ; i < rectnamelist.length; i++){
					var classname = "."+rectnamelist[i];
					d3.selectAll(classname).selectAll("rect").style("fill", colorlist[i]).style("opacity", 0.5);
				}

				for(var i = 0 ; i < brushreprlist.length; i++){
					removenglrepr(brushreprlist[i]);
				}
				atomPair1 = [];
				sidechainselec1 = "(";
				initbrushlist(atomPairlist,sidechainseleclist);
				d3.selectAll(".brush").remove();
			}
		}
	}

	/**
	 * Tranform components when zoom function is called.
	 */
	function zoomed() {
		//saving transform identity
		translateVar[0] = d3.event.transform.x;
		translateVar[1] = d3.event.transform.y;
		translateVar[2] = d3.event.transform.k;
		//applying zoom
		//rects1blue.attr("transform", d3.event.transform);
		//rects2red.attr("transform", d3.event.transform);
		for(var i = 0; i < reclist.length; i++){
			var currRect = reclist[i];
			currRect.attr("transform", d3.event.transform);
		}

		classlinex.attr("transform", d3.event.transform);
		classliney.attr("transform", d3.event.transform);
		bAxisGroup.call(bAxis.scale(d3.event.transform.rescaleX(axisScale)));
		rAxisGroup.call(rAxis.scale(d3.event.transform.rescaleY(axisScale)));
	}


	/**
	 * Zoom function for contact map.
	 * @param {Integer} zoomtag - 0 to disable the function and 1 to enable the function.
	 */
	function zoom(zoomtag){
		//zoom function
		if(zoomtag === 1){
			zoomon = 1;
			var zoomfactor;
			if(residuesize <= 200){
				//zoomfactor = 2;
				zoomfactor = 100;
			}
			if(residuesize > 200){
				//zoomfactor = size/100;
				zoomfactor = 100;
			}

			//console.log("svgsize: " + svgsize);
			var zoom = d3.zoom()
						.scaleExtent([1, zoomfactor])
						.translateExtent([[0, 0], [svgsize, svgsize]])
						.on("zoom", zoomed);

			svgContainer.call(zoom);
			
		}
		else{
			svgContainer.call(d3.zoom().on("zoom", null));
		}
	}

	/**
	 * Function to prepare data for contact map.
	 * @param {Integer} tag - 0 to use local file, 1 to get contact map data from NGL.
	 * @param {Integer} svgsize1 - viewport size for the contactmap. (svgsize1 = width = height)
	 */
	function loadsvg(tag, svgsize1){
		//"http://localhost:8000/examples/5sx3.json"
		//using local file		
		//D3 json method
		if(tag === 0){
			d3.json(svgurl, function(data){
				
				//getting res size
				var size = data.ressize;

				//D3 Json method
				var residue1 = data.residue1;
				var residue2 = data.residue2;

				//creating residuedataset
				var residuerectdata = [];
				for(var k = 0; k < residue1.length; k++){
					residuerectdata.push([residue1[k], residue2[k]]);
					residuerectdata.push([residue2[k], residue1[k]]);
				}	

				//set data and residuesize
				cmsvgdata = data;
				residuesize = size;

				initResData(cmvp1, size, svgsize1, residue1, residue2, residuerectdata);

			});
		}

		
		//NGL Method
		if(tag === 1){

			//Set contacts
			var residue1 = nglsvgdata.residue1;
			var residue2 = nglsvgdata.residue2;
			residue1name = nglsvgdata.residue1name;

			//creating residuedataset
			var residuerectdata = [];
			for(var k = 0; k < residue1.length; k++){
				//residuerectdata.push([residue1[k], residue2[k]]);
				residuerectdata.push([residue1[k], residue2[k], chainlist[0]]);
			}	
			//console.log(residuerectdata);
			residueindex = nglsvgdata.resindex;
			resinscode = nglsvgdata.resinscode;
			//Set res size
			var size = residueindex.length;

			//set data and residuesize
			cmsvgdata = nglsvgdata;
			residuesize = size;

			initResData(cmvp1, size, svgsize1, residue1, residue2, residuerectdata);

			brushmsa = 0;
		}



		if(tag === 2){
			//var colorlist = ["Aqua","Aquamarine","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DodgerBlue","FireBrick","ForestGreen","Fuchsia","Gainsboro","Gold","GoldenRod","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","Yellow","YellowGreen"];
			//d3.schemeCategory20,d3.schemeCategory10,d3.schemeCategory20b,d3.schemeCategory20c
			brushmsa = 1;






			//var testurl = "http://localhost:8000/examples/4hhb.json";
			//d3.json(testurl, function(data){
			
			//console.log(nglsvgdatalist.length);



			//preparing data


			//Set contacts
			/*var residue1 = nglsvgdata.residue1;
			var residue2 = nglsvgdata.residue2;
			//creating residuedataset
			var residuerectdata = [];
			for(var k = 0; k < residue1.length; k++){
				//residuerectdata.push([residue1[k], residue2[k]]);
				residuerectdata.push([residue1[k], residue2[k], chainlist[0]]);
			}*/

			/*
			var align1 = "-VLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTKTYFPHFDL------SHGSAQVKGHGKKVADALTNAVAHVDDMPNALSALSDLHAHKLRVDPVNFKLLSHCLLVTLAAHLPAEFTPAVHASLDKFLASVSTVLTSKYR";
			var align2 = "VHLTPEEKSAVTALWGKV--NVDEVGGEALGRLLVVYPWTQRFFESFGDLSTPDAVMGNPKVKAHGKKVLGAFSDGLAHLDNLKGTFATLSELHCDKLHVDPENFRLLGNVLVCVLAHHFGKEFTPPVQAAYQKVVAGVANALAHKYH";
			var alignarry = [];
			alignarry[0] = align1;
			alignarry[1] = align2;*/
			var alignarry = alignArr;
			var alignlength = Number(alignarry[0].length);
			//var seq1length = 141;
			//var seq2length = 146;

			console.log(alignlength);

			//maping array function
			var seqToAlign = [];
			for(var a = 0; a < alignarry.length; a++){
				var index1 = 0;
				var index2 = 0;
				var map1 = [];
				var map2 = [];
				for(var i = 0; i < alignlength; i++){
					var currentalign = alignarry[a];
					var currentchar = currentalign[i];

					if(currentchar !== "-"){
						map1[i] = index1;
						index1++;

						map2[index2] = i;
						index2++;
					}
					else{
						map1[i] = -1;
					}
				}
				alignToSeq.push(map1);
				seqToAlign.push(map2);
			}
			console.log("AlignToSeq:");
			console.log(alignToSeq);
			console.log("SeqToAlign:");
			console.log(seqToAlign);


			var contactlist = [];
			//saving contacts into contactlist
			//var templist = [];
			//var resIndexToresNoList = [];
			//var resInscodeList = [];
			for(var i = 0 ; i < nglsvgdatalist.length; i++){
				var currdata = nglsvgdatalist[i];
				//console.log(currdata.residue1name);
				var res1 = currdata.residue1;
				var res2 = currdata.residue2;

				var currResno = currdata.resindex;
				resIndexToresNoList.push(currResno);

				var currResInscode = currdata.resinscode;
				resInscodeList.push(currResInscode);

				//console.log("res1: "+ res1 + "res2: "+ res2);
				var residuerectdata = [];
				//var tempdata = [];
				var currmap = seqToAlign[i];
				for(var j = 0; j < res1.length; j++){
					/*tempdata.push([res1[j], res2[j]]);
					if(currmap[res1[j]] === 67 && currmap[res2[j]] === 72){
						console.log("67,72: "+ res1[j] + ", "+ res2[j]);
					}
					if(currmap[res1[j]] === 72 && currmap[res2[j]] === 67){
						console.log("72,67: "+ res1[j] + ", "+ res2[j]);
					}*/
					residuerectdata.push([currmap[res1[j]], currmap[res2[j]], i]);
					//residuerectdata.push([currmap[res1[j]], currmap[res2[j]], chainlist[i], pdblist[i]]);
					//residuerectdata.push([res1[j], res2[j], chainlist[i]]);
				}
				contactlist.push(residuerectdata);
				//templist.push(tempdata);
			}
			//console.log(contactlist);
			//var maptemp = alignToSeq[0];
			//console.log(maptemp[67]);
			//console.log(maptemp[72]);
			//console.log(templist[0]);

			
			/*for(var i = 0; i < templist[0].length;i++){
				var pair = templist[0][i];
				var pair1 = pair[0];
				var pair2 = pair[1];

				if(pair1 === 65 && pair2 === 70){
					//console.log("Here");
				}
				if(pair1 === 70 && pair2 === 65){
					//console.log("There");
				}
				//console.log(templist[0][i]);
			}*/


			//initialize empty 2d array
			for(var i = 0; i < alignlength; i++){
				sameContact[i] = [];
				for(var j = 0; j < alignlength; j++){
					sameContact[i][j] = -1;
				}
			}
			//console.log(sameContact[alignlength][alignlength]);
			//console.log(sameContact[alignlength+1][alignlength+1]);

			//calculate the same contact

			for(var i = 0; i < contactlist.length; i++){
				//x,y,i
				var currcontact = contactlist[i];

				for(var j = 0; j < currcontact.length; j++){
					var currX = currcontact[j][0];
					var currY = currcontact[j][1];


					if(sameContact[currX][currY] === -1){
						sameContact[currX][currY] = [];
						sameContact[currX][currY].push(i);
					}

					else if(sameContact[currX][currY] !== -1){
						if(sameContact[currX][currY].length !== i+1){
							sameContact[currX][currY].push(i);
						}
					}
				}
			}

			


			//drawing
			//initResData(cmvp1, size, svgsize1, residue1, residue2, residuerectdata);
			//assigning data
			
			svgsize = svgsize1;
			var size = alignlength;
			residuesize = size;
			
			//calculating unit
			//axisScale = d3.scaleLinear().domain([0,size]).range([0,svgsize]);
			var residueToSvg = d3.scaleLinear().domain([0,size]).range([0,svgsize]);
			unit = svgsize/size;


			//creating svg
			var inputvp = "#"+cmvp1;
			svgContainer = d3.select(inputvp).append("svg")
												.attr("width", svgsize)
												.attr("height", svgsize);




			//mouse hover
			var coordx;
			var coordy;
			var mousetag = 0;
			var repr;
			var repr1;
			var divtag = 0;
			var div;
			var reprlist = [];
			function mouseover(p){	

				//console.log(this);
				//creating and deleting div
				if(divtag === 0){
					//div for tooltips
					//.style("text-align", "center")
					div = d3.select("body").append("div")
											.attr("class", "tooltip")
											.style("opacity", 0)
											.style("position", "absolute")
											.style("text-align", "center")
											.style("width", "110px")
											.style("height", "25px")
											.style("padding","5px")
											.style("font", "12px sans-serif")
											.style("background", "#FFDAB9")
											.style("border-radius", "8px");	
				}
				if(divtag === 1){
					div.remove();
					div = d3.select("body").append("div")
											.attr("class", "tooltip")
											.style("opacity", 0)
											.style("position", "absolute")
											.style("text-align", "center")
											.style("width", "110px")
											.style("height", "25px")
											.style("padding","5px")
											.style("font", "12px sans-serif")
											.style("background", "#FFDAB9")
											.style("border-radius", "8px");
				}
				divtag = 1;

				//change opacity when mouse over
				d3.select(this).style("opacity", 0.5);
				
				coordx = p[0];
				coordy = p[1];

				//strucomplist
				//showing distance and sidechain on ngl when mouse over in contact map
				if(mousetag === 1){
					for(var i = 0 ; i < reprlist.length; i++){
						removenglrepr(reprlist[i]);
					}
				}

				


				var samecontactlist = sameContact[p[0]][p[1]];

				for(var i = 0; i < samecontactlist.length; i++){
					var currdata = samecontactlist[i];
					var curraligntoSeq = alignToSeq[currdata];
					var currResno = resIndexToresNoList[currdata];
					//var currseqtoalign = seqToAlign[currdata];
					var currInscode = resInscodeList[currdata];

					var inputx, inputy, sidechainx, sidechainy;

					if(currInscode[curraligntoSeq[coordx]] === 1){
						//currResno[curraligntoSeq[coordx]]
						var resxindex = currResno[curraligntoSeq[coordx]].substring(0,currResno[curraligntoSeq[coordx]].length-1);

						inputx = resxindex + "^" + currResno[curraligntoSeq[coordx]].slice(-1) + ".CA";
						sidechainx = resxindex + "^" + currResno[curraligntoSeq[coordx]].slice(-1) + ":" + chain;
					}

					if(currInscode[curraligntoSeq[coordy]] === 1){
						var resyindex = currResno[curraligntoSeq[coordy]].substring(0,currResno[curraligntoSeq[coordy]].length-1);

						inputy = resyindex + "^" + currResno[curraligntoSeq[coordy]].slice(-1) + ".CA";
						sidechainy = resyindex + "^" + currResno[curraligntoSeq[coordy]].slice(-1) + ":" + chain;
					}

					if(currInscode[curraligntoSeq[coordx]] !== 1){
						inputx = currResno[curraligntoSeq[coordx]] + "^" + ".CA";
						sidechainx = currResno[curraligntoSeq[coordx]] + "^" + ":" + chain;
					}

					if(currInscode[curraligntoSeq[coordy]] !== 1){
						inputy = currResno[curraligntoSeq[coordy]] + "^" + ".CA";
						sidechainy = currResno[curraligntoSeq[coordy]] + "^" + ":" + chain;
					}					



					//inputx = currResno[curraligntoSeq[coordx]] + "^" + ".CA";
					//sidechainx = currResno[curraligntoSeq[coordx]] + "^" + ":" + chain;
				
					//inputy = currResno[curraligntoSeq[coordy]] + "^" + ".CA";
					//sidechainy = currResno[curraligntoSeq[coordy]] + "^" + ":" + chain;
					
					/*console.log(inputx);
					console.log(inputy);
					console.log(sidechainx);
					console.log(sidechainy);*/
					//console.log(inputx);
					//console.log(inputy);
					//73^.CA, 35^.CA

					//console.log(strucomplist[currdata]);

					var atomPair = [[inputx,inputy]];
					var sidechainselec = "("+sidechainx +" or "+ sidechainy +")";



					var reprD = strucomplist[currdata].addRepresentation( "distance", { atomPair: atomPair });
					var reprL = strucomplist[currdata].addRepresentation( "licorice", { sele: sidechainselec});
					reprlist.push(reprD);
					reprlist.push(reprL);

				}
				mousetag = 1;



				
				//tooltip box
				//.duration(200)
				div.transition()
					.style("opacity", .9);

				if(sameContact[p[0]][p[1]].length === 1){
					div.text(p[0] + ", " + p[1] + ", PDB: " + pdblist[p[2]] + ", Chain: " + chainlist[p[2]])
						.style("left", (d3.event.pageX) + "px")
						.style("top", (d3.event.pageY - 30) + "px");
				}
				if(sameContact[p[0]][p[1]].length !== 1){
					//console.log(sameContact[p[0]][p[1]]);
					var divtext = "";
					var currdata = sameContact[p[0]][p[1]];
					for(var i = 0; i < currdata.length; i++){
						if(i === 0){
							divtext = divtext + p[0] + ", " + p[1] + ": ";
						}
						var currindex = currdata[i];
						divtext = divtext + pdblist[currindex] + chainlist[currindex];
						
						if(i+1 < currdata.length){
							divtext = divtext + ", ";
						}
					}
					div.text(divtext)
						.style("left", (d3.event.pageX) + "px")
						.style("top", (d3.event.pageY - 30) + "px");
				}
			}

			//tooltip disapear when mouseout
			function mouseout(){
				//tooltip disapear
				//.duration(100)
				div.transition()
				.style("opacity", 0.5);

				div.remove();
				
				//change the opacity back to 1 when mouseout
				d3.select(this).style("opacity", 0.5);	

				//clear ngl
				for(var i = 0 ; i < reprlist.length; i++){
					removenglrepr(reprlist[i]);
				}	       
			}



			//drawing only one background gray rect with white lines
			var grayrectdata = [];
			grayrectdata.push([0,0]);
			var rectsgray = svgContainer.append("g").attr("class", "gray");
			var rects = rectsgray.selectAll("rect").data(grayrectdata).enter().append("rect");
			rects.attr("x", function(d){return d[0];})
								.attr("y", function(d){return d[1];})
								.attr("height", svgsize)
								.attr("width", svgsize)
								.style("fill", "#eee");
								
			//creating lines
			var linedata = [];
			for(var i = 0; i < svgsize; i = i+unit){
				linedata.push([i,0]);
			}

			classlinex = svgContainer.append("g").attr("class", "linex");
			var classlinexs = classlinex.selectAll("line").data(linedata).enter().append("line");
			classlinexs.attr("x1", function(d){return d[0];})
				.attr("y1", function(d){return d[1];})
				.attr("x2", function(d){return d[0];})
				.attr("y2", svgsize)
				.attr("stroke", "white")
				.attr("stroke-width", unit/10);


			classliney = svgContainer.append("g").attr("class", "liney");
			var classlineys = classliney.selectAll("line").data(linedata).enter().append("line");
			classlineys.attr("y1", function(d){return d[1];})
				.attr("y1", function(d){return d[0];})
				.attr("x2", svgsize)
				.attr("y2", function(d){return d[0];})
				.attr("stroke", "white")
				.attr("stroke-width", unit/10);

			//creating scale for axis 
			//domain: length of the residue, range: length of svgcontainer
			axisScale = d3.scaleLinear().domain([0,size]).range([0,svgsize]);

			bAxis = d3.axisBottom().scale(axisScale);
			rAxis = d3.axisRight().scale(axisScale);
			bAxisGroup = svgContainer.append("g").call(bAxis);
			rAxisGroup = svgContainer.append("g").call(rAxis);




			//creating rects
			//var rectnamelist = [];
			for(var i = 0; i < contactlist.length; i++){
				var rectclassname = "rect"+i;
				var currcontact = contactlist[i];

				var rect = svgContainer.append("g").attr("class", rectclassname);
				var rects = rect.selectAll("rect").data(currcontact).enter().append("rect");
				rects.attr("x", function(d){return residueToSvg(d[0]);})
								.attr("y", function(d){return residueToSvg(d[1]);})
								.attr("height", unit)
								.attr("width", unit)
								.style("fill", colorlist[i])
								.style("opacity", 0.5)
								.on("mouseover", mouseover)
								.on("mouseout", mouseout);

				reclist.push(rect);
				rectnamelist.push(rectclassname);
			}




			


























		}
	}


	this.loadsvg = function(tag, svgsize1){
		loadsvg(tag, svgsize1);
	}

	this.zoom = function(zoomtag){
		zoom(zoomtag);
	}

	this.brush = function(brushon){
		brush(brushon);
	}

	this.getcmdata = function(){
		return cmsvgdata;
	}

	this.getresiduesize = function(){
		return residuesize;
	}

}