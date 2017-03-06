function cmSvg(name, ngl1, pdburl){
	var svgname = name;
	var residuesize;
	var cmsvgdata;
	var ngl = ngl1;
	var svgurl = pdburl;
	var res1 = ngl1.res1();
	var res2 = ngl1.res2();
	var svgdata = ngl1.svgdata();
	var brushtag = 0;



	function initResData(size, residue1, residue2, residuerectdata){

		var svgsize = 700;
		
		//calculating unit
		var residueToSvg = d3.scaleLinear().domain([0,size]).range([0,svgsize]);
		var svgToResidue = d3.scaleLinear().domain([0,svgsize]).range([0,size]);

		var unit = svgsize/size;
		var unitround = Math.floor(unit);


		//creating svg
		//"body"
		var svgContainer = d3.select("#svgviewport").append("svg")
											.attr("width", svgsize)
											.attr("height", svgsize);							


		//mouse hover
		var coordx;
		var coordy;
		var mousetag = 0;
		var repr;
		var repr1;

		function mouseover(p){
			if (brushtag === 1){
				//console.log("HI");
				return;
			} 
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
		function mouseout(p){
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

		
		//drawing many background gray rects
		/*
		var grayrectdata = [];
		
		for(var i = 0; i < size; i++){
			for(var j = 0; j < size; j++){	
				grayrectdata.push([i,j]);
			}
		}

		var rectsgray = svgContainer.append("g").attr("class", "gray");
		var rects = rectsgray.selectAll("rect").data(grayrectdata).enter().append("rect");
		var rectattr = rects.attr("x", function(d){return residueToSvg(d[0]);})
							.attr("y", function(d){return residueToSvg(d[1]);})
							.attr("height", svgsize)
							.attr("width", svgsize)
							.style("fill", "#eee")	
							.on("mouseover", mouseover);*/

		
		//console.log(grayrectdata[1][0]);



		//drawing only one background gray rect with white lines
		
		var grayrectdata = [];
		grayrectdata.push([0,0]);
		var rectsgray = svgContainer.append("g").attr("class", "gray");
		var rects = rectsgray.selectAll("rect").data(grayrectdata).enter().append("rect");
		var rectattr = rects.attr("x", function(d){return d[0];})
							.attr("y", function(d){return d[1];})
							.attr("height", svgsize)
							.attr("width", svgsize)
							.style("fill", "#eee")
							//.on("mouseover", mouseover);
		

		//creating lines
		var linedata = [];
		for(var i = 0; i < svgsize; i = i+unit){
			linedata.push([i,0]);
		}


		
		console.log(unit);
		var classlinex = svgContainer.append("g").attr("class", "linex");
		var classlinexs = classlinex.selectAll("line").data(linedata).enter().append("line");
		var classlinexattr = classlinexs.attr("x1", function(d){return d[0];})
			.attr("y1", function(d){return d[1];})
			.attr("x2", function(d){return d[0];})
			.attr("y2", svgsize)
			.attr("stroke", "white")
			.attr("stroke-width", unit/10);


		var classliney = svgContainer.append("g").attr("class", "liney");
		var classlineys = classliney.selectAll("line").data(linedata).enter().append("line");
		var classlinexattr = classlineys.attr("x1", function(d){return d[1];})
			.attr("y1", function(d){return d[0];})
			.attr("x2", svgsize)
			.attr("y2", function(d){return d[0];})
			.attr("stroke", "white")
			.attr("stroke-width", unit/10);		
		


		


		//zoom function
		var transform = d3.zoomIdentidy;
		var zoomfactor;
		if(size <= 200){
			//zoomfactor = 2;
			zoomfactor = 100;
		}
		if(size > 200){
			//zoomfactor = size/100;
			zoomfactor = 100;
		}

		var zoom = d3.zoom()
		    		.scaleExtent([1, zoomfactor])
		    		.translateExtent([[0, 0], [svgsize, svgsize]])
		    		.on("zoom", zoomed);

		//svgContainer.call(zoom);			

		function zoomed() {
			if (brushtag === 1){
				//console.log("HI");
				return;
			}
			rects1blue.attr("transform", d3.event.transform);
			classlinex.attr("transform", d3.event.transform);
			classliney.attr("transform", d3.event.transform);
			bAxisGroup.call(bAxis.scale(d3.event.transform.rescaleX(axisScale)));
			rAxisGroup.call(rAxis.scale(d3.event.transform.rescaleY(axisScale)));
		
		}





		//brush function 
		var brush = d3.brush()
					.on("start brush", brushstart)
					.on("end", brushend);
		var svgBrush = svgContainer.append("g")
		    .attr("class", "brush")
		    .call(brush);	

		var repr2;
		var repr3;
		var atomPair1 = [];
		var sidechainselec1 = "(";
		function brushstart(){

			brushtag = 1;

			/*if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom"){
				console.log("HI");
				return;
			}*/

			var s = d3.event.selection;
			var xstart, xend, ystart, yend;
			

			//clear everything
			d3.selectAll(".blue").selectAll("rect").style("fill", "steelblue");
			ngl.getStructureComp().removeRepresentation(repr2);	
			ngl.getStructureComp().removeRepresentation(repr3);
			atomPair1 = [];
			sidechainselec1 = "";


			xstart = s[0][0];
			xend = s[1][0];
			ystart = s[0][1];
			yend = s[1][1];

			/*
			console.log("xstart: " + xstart);
			console.log("ystart: " + ystart);
			console.log("xend: " + xend);
			console.log("yend: " + yend);*/

			//saving representation info while dragging
			d3.selectAll(".blue").selectAll("rect").each(function(d,i){
				
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
				//clear everything when clear on gray rect
				d3.selectAll(".blue").selectAll("rect").style("fill", "steelblue");
				atomPair1 = [];
				sidechainselec1 = "";
				ngl.getStructureComp().removeRepresentation(repr2);	
				ngl.getStructureComp().removeRepresentation(repr3);

				brushtag = 0;
			}

			else{
				//adding representation in ngl after mouse release
				//ngl.getStructureComp().removeRepresentation(repr2);
				//ngl.getStructureComp().removeRepresentation(repr3);
				sidechainselec1 = sidechainselec1.substring(0, sidechainselec1.length-3);
				sidechainselec1 = sidechainselec1 + ")";
				//console.log(sidechainselec1);
				if(sidechainselec1 !== ")"){
					repr2 = ngl.getStructureComp().addRepresentation( "distance", { atomPair: atomPair1 });
					repr3 = ngl.getStructureComp().addRepresentation("licorice", { sele: sidechainselec1});
				}
			}
		}







		//creating scale for axis 
		//domain: length of the residue, range: length of svg
		var axisScale = d3.scaleLinear().domain([0,size]).range([0,svgsize]);
		
		var bAxis = d3.axisBottom().scale(axisScale);
		var rAxis = d3.axisRight().scale(axisScale);
		bAxis.tickSizeOuter(0);
		rAxis.tickSizeOuter(0);
		var bAxisGroup = svgContainer.append("g").call(bAxis);
		var rAxisGroup = svgContainer.append("g").call(rAxis);



		//div for tooltips
		var div = d3.select("body").append("div")
								.attr("class", "tooltip")
								.style("opacity", 0);




		//drawing the blue residue rect
		var rects1blue = svgContainer.append("g").attr("class", "blue");
		var rects1 = rects1blue.selectAll("rect").data(residuerectdata).enter().append("rect");
		var rectattr1 = rects1.attr("x", function(d){return residueToSvg(d[0]);})
							  .attr("y", function(d){return residueToSvg(d[1]);})
							  .attr("height", unit)
							  .attr("width", unit)
							  .style("fill", "steelblue")
							  .on("mouseover", mouseover)
							  .on("mouseout", mouseout);
	}


	function loadsvg(tag){
		
		//"http://localhost:8000/examples/5sx3.json"
		//using local file
		//D3 json method
		if(tag === 0){
			console.log("tag = 0");
			d3.json(svgurl, function(data){
				
				//getting res size
				var size = data.ressize;
				console.log("Res size: " + size);

				console.log(data);

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
			console.log("tag = 1");

			//Set res size
			var size = svgdata.maxRes;
			console.log("Res size: " + size);

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

	this.getcmsvgdata = function(){
		return cmsvgdata;
	}

	this.getresiduesize = function(){
		return residuesize;
	}

}