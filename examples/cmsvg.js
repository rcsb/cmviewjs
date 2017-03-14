/**
 * This is a closure base class for creating an object for contact map using svg.
 * @class
 * @param {String} ngl1 - The NGL object that is connected to the contact map.
 * @param {String} pdburl - The url to get contact map data.
 */

/*global d3*/
function cmSvg(ngl1, pdburl){
	var residuesize;
	var cmsvgdata;
	var ngl = ngl1;
	var svgurl = pdburl;
	var svgdata = ngl1.svgdata();

	var rects1blue;
	var classlinex;
	var classliney;
	var bAxisGroup;
	var rAxisGroup;
	var svgContainer;
	var bAxis;
	var rAxis;
	var translateVar = [1,0,0];
	var zoomon = 0;
	var unit;
	var axisScale;
	

	/**
	 * Function for initialization of contact map.
	 * @param {Integer} size - The length of the protein 
	 * @param {Array} residue1 - An array that contains residue number that has contact with residue2.
	 * @param {Array} residue2 - An array that contains residue number that has contact with residue1.
	 * @param {Array} residuerectdata - An array that contains contacts from residue1 and residue2.
	 */
	function initResData(size, residue1, residue2, residuerectdata){

		var svgsize = 700;
		
		//calculating unit
		var residueToSvg = d3.scaleLinear().domain([0,size]).range([0,svgsize]);

		unit = svgsize/size;


		//creating svg
		//"body"
		svgContainer = d3.select("#svgviewport").append("svg")
											.attr("width", svgsize)
											.attr("height", svgsize);							


		//mouse hover
		var coordx;
		var coordy;
		var mousetag = 0;
		var repr;
		var repr1;

		function mouseover(p){
			var tempx = p[0];
			var tempy = p[1];


			coordx = tempx;
			coordy = tempy;

			//showing distance and sidechain on ngl when mouse over in contact map
			if(mousetag === 1){
				ngl.getStructureComp().removeRepresentation(repr);
				ngl.getStructureComp().removeRepresentation(repr1);
				
			}
			var inputx = coordx + ".CA";
			var inputy = coordy + ".CA";

			var sidechainx = coordx + ":A";
			var sidechainy = coordy + ":A";

			var atomPair = [[inputx,inputy]];
			
			var sidechainselec = "("+sidechainx +" or "+ sidechainy +")" ;
			//+ " and (sidechainAttached)"
			repr = ngl.getStructureComp().addRepresentation( "distance", { atomPair: atomPair });
			repr1 = ngl.getStructureComp().addRepresentation("licorice", { sele: sidechainselec});
			mousetag = 1;


			//tooltip box
			div.transition()
				.duration(200)
				.style("opacity", .9);
			div.text(p[0] + ", " + p[1])
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 20) + "px");



			//change opacity when mouse over
			d3.select(this).style("opacity", 0.5);
		
		}

		//tooltip disapear when mouseout
		function mouseout(){
			//tooltip disapear
			div.transition()
			.duration(500)
			.style("opacity", 0);

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


		
		//console.log(unit);
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
		//domain: length of the residue, range: length of svg
		axisScale = d3.scaleLinear().domain([0,size]).range([0,svgsize]);
		
		bAxis = d3.axisBottom().scale(axisScale);
		rAxis = d3.axisRight().scale(axisScale);
		bAxis.tickSizeOuter(0);
		rAxis.tickSizeOuter(0);
		bAxisGroup = svgContainer.append("g").call(bAxis);
		rAxisGroup = svgContainer.append("g").call(rAxis);



		//div for tooltips
		var div = d3.select("body").append("div")
								.attr("class", "tooltip")
								.style("opacity", 0);




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

			var repr2;
			var repr3;
			var atomPair1 = [];
			var sidechainselec1 = "(";

			
			function brushstart(){
				
				var s = d3.event.selection;
				var xstart, xend, ystart, yend;
				
				//clear everything
				d3.selectAll(".blue").selectAll("rect").style("fill", "steelblue");
				ngl.getStructureComp().removeRepresentation(repr2);	
				ngl.getStructureComp().removeRepresentation(repr3);
				atomPair1 = [];
				sidechainselec1 = "";


				//when zoom havent started yet
				if(zoomon === 1){
					xstart = Math.floor((s[0][0]-translateVar[0])/translateVar[2]);
					xend = Math.floor((s[1][0]-translateVar[0])/translateVar[2]);
					ystart = Math.floor((s[0][1]-translateVar[1])/translateVar[2]);
					yend = Math.floor((s[1][1]-translateVar[1])/translateVar[2]);	
				}
				//when zoom already started
				if(zoomon === 0){
					xstart =  Math.floor(s[0][0]);
					xend =  Math.floor(s[1][0]);
					ystart =  Math.floor(s[0][1]);
					yend =  Math.floor(s[1][1]);
				}

				/*
				console.log("xstart: " + xstart);
				console.log("ystart: " + ystart);
				console.log("xend: " + xend);
				console.log("yend: " + yend);*/

				//saving representation info while dragging
				d3.selectAll(".blue").selectAll("rect").each(function(d){
					if(d[0]*unit >= xstart && d[0]*unit <= xend && d[1]*unit >= ystart && d[1]*unit <= yend){
						d3.select(this).style("fill","PaleVioletRed");

						var inputx = d[0] + ".CA";
						var inputy = d[1] + ".CA";
						atomPair1.push([inputx,inputy]);

						var sidechainx = d[0] + ":A";
						var sidechainy = d[1] + ":A";
						sidechainselec1 = sidechainselec1 + sidechainx + " or " + sidechainy + " or ";
					}
				});
						
			}

			function brushend(){
				if(!d3.event.selection){
					//clear everything when click on gray rect
					d3.selectAll(".blue").selectAll("rect").style("fill", "steelblue");
					atomPair1 = [];
					sidechainselec1 = "";
					ngl.getStructureComp().removeRepresentation(repr2);	
					ngl.getStructureComp().removeRepresentation(repr3);
				}

				else{
					sidechainselec1 = sidechainselec1.substring(0, sidechainselec1.length-3);
					sidechainselec1 = sidechainselec1 + ")";
					if(sidechainselec1 !== ")"){
						repr2 = ngl.getStructureComp().addRepresentation( "distance", { atomPair: atomPair1 });
						repr3 = ngl.getStructureComp().addRepresentation("licorice", { sele: sidechainselec1});
					}
				}
			}
		}

		else{
			d3.selectAll(".brush").remove();
		}
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

			var zoom = d3.zoom()
						.scaleExtent([1, zoomfactor])
						.translateExtent([[0, 0], [700, 700]])
						.on("zoom", zoomed);

			svgContainer.call(zoom);
			
			function zoomed() {
				//saving transform identity
				translateVar[0] = d3.event.transform.x;
				translateVar[1] = d3.event.transform.y;
				translateVar[2] = d3.event.transform.k;
				//applying zoom
				rects1blue.attr("transform", d3.event.transform);
				classlinex.attr("transform", d3.event.transform);
				classliney.attr("transform", d3.event.transform);
				bAxisGroup.call(bAxis.scale(d3.event.transform.rescaleX(axisScale)));
				rAxisGroup.call(rAxis.scale(d3.event.transform.rescaleY(axisScale)));
			}
		}
		else{
			svgContainer.call(d3.zoom().on("zoom", null));
		}
	}

	/**
	 * Function to prepare data for contact map.
	 * @param {Integer} tag - 0 to use local file, 1 to get contact map data from NGL.
	 */
	function loadsvg(tag){
		
		//"http://localhost:8000/examples/5sx3.json"
		//using local file		
		//D3 json method
		if(tag === 0){
			//console.log("tag = 0");
			d3.json(svgurl, function(data){
				
				//getting res size
				var size = data.ressize;
				//console.log("Res size: " + size);

				//console.log(data);

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

				initResData(size, residue1, residue2, residuerectdata);

			});
		}

		
		//NGL Method
		if(tag === 1){
			//console.log("tag = 1");

			//Set res size
			var size = svgdata.maxRes;
			//console.log("Res size: " + size);

			//Set contacts
			//console.log(svgdata);
			var residue1 = svgdata.residue1;
			var residue2 = svgdata.residue2;

			//creating residuedataset
			var residuerectdata = [];
			for(var k = 0; k < residue1.length; k++){
				residuerectdata.push([residue1[k], residue2[k]]);
			}	

			//set data and residuesize
			cmsvgdata = svgdata;
			residuesize = size;

			initResData(size, residue1, residue2, residuerectdata);

		}
	}


	this.loadsvg = function(tag){
		loadsvg(tag);
	}

	this.zoom = function(zoomtag){
		zoom(zoomtag);
	}

	this.brush = function(brushon){
		brush(brushon);
	}

	this.getcmsvgdata = function(){
		return cmsvgdata;
	}

	this.getresiduesize = function(){
		return residuesize;
	}

}