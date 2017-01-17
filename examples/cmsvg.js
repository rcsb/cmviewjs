function svgClass(arg1){
	var property1 = arg1;
	var canvasdata;
	var residuesize;
	//var structurecomp = sc;

	function loadsvg(){


		d3.json("http://localhost:8000/examples/tst4.json", function(data){
			

			var size = data.length1;
			var residue1 = data.residue1;
			var residue2 = data.residue2;
			var svgsize = 700;

			//console.log(size);
			//console.log(residue1[0]);

			
			var residueToSvg = d3.scaleLinear().domain([0,size]).range([0,svgsize]);
			var svgToResidue = d3.scaleLinear().domain([0,svgsize]).range([0,size]);

			var unit = svgsize/size;
			var unitround = Math.floor(unit);


			/*function zoom() {
				svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
			}	*/

			//creating svg
			var svgContainer = d3.select("body").append("svg")
												.attr("width", svgsize)
												.attr("height", svgsize);
			//svgContainer.call(d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoom));



			var residuerectdata = [];
			for(var k = 0; k < residue1.length; k++){
				residuerectdata.push([residue1[k], residue2[k]]);
				residuerectdata.push([residue2[k], residue1[k]]);
			}	

			var coordx;
			var coordy;
			var tag = 0;
			var repr;

			function mouseover(p){
				var tempx = p[0];
				var tempy = p[1];


				coordx = tempx;
				coordy = tempy;
				//console.log(coordx);
				//console.log(coordy);


				if(tag == 1){
				structurecomp.removeRepresentation(repr);
				
				}
				var atomPair = [[coordx,coordy]];
				repr = structurecomp.addRepresentation( "distance", { atomPair: atomPair } );
				tag = 1;
				//stage.centerView();

			}

					



			var grayrectdata = [];
			//drawing many background gray rects
			/*
			
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



			//drawing only one background gray rect
			/*
			grayrectdata.push([0,0]);
			var rectsgray = svgContainer.append("g").attr("class", "gray");
			var rects = rectsgray.selectAll("rect").data(grayrectdata).enter().append("rect");
			var rectattr = rects.attr("x", function(d){return residueToSvg(d[0]);})
								.attr("y", function(d){return residueToSvg(d[1]);})
								.attr("height", svgsize)
								.attr("width", svgsize)
								.style("fill", "#eee")
								.on("mouseover", mouseover);*/
			

			//drawing the blue residue rect
			//
			//.call(d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoom));
			var rects1blue = svgContainer.append("g").attr("class", "blue");
			var rects1 = rects1blue.selectAll("rect").data(residuerectdata).enter().append("rect");
			var rectattr1 = rects1.attr("x", function(d){return residueToSvg(d[0]);})
								  .attr("y", function(d){return residueToSvg(d[1]);})
								  .attr("height", unit)
								  .attr("width", unit)
								  .style("fill", "steelblue")
								  .on("mouseover", mouseover);
			
			


		});

	}

	this.loadsvg = function(){
		loadsvg();
	};
}