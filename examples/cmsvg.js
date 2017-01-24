function svgClass(name, ngl1){
	var svgname = name;
	var residuesize;
	var cmsvgdata;
	var ngl = ngl1;

	function loadsvg(){


		d3.json("http://localhost:8000/examples/tst4.json", function(data){
			

			var size = data.length1;
			var residue1 = data.residue1;
			var residue2 = data.residue2;
			var svgsize = 700;

			residuesize = size;
			cmsvgdata = data;


			//console.log(size);
			//console.log(residue1[0]);

			
			var residueToSvg = d3.scaleLinear().domain([0,size]).range([0,svgsize]);
			var svgToResidue = d3.scaleLinear().domain([0,svgsize]).range([0,size]);

			var unit = svgsize/size;
			var unitround = Math.floor(unit);


			


			//creating svg
			//"body"
			var svgContainer = d3.select("#svgviewport").append("svg")
												.attr("width", svgsize)
												.attr("height", svgsize);							
			







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

				if(tag == 1){
					ngl1.getStructureComp().removeRepresentation(repr);
				}
				var atomPair = [[coordx,coordy]];
				repr = ngl1.getStructureComp().addRepresentation( "distance", { atomPair: atomPair } );
				tag = 1;



				div.transition()
					.duration(200)
					.style("opacity", .9);
				div.text(p[0] + ", " + p[1])
					.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY - 20) + "px");
			
			}

			function mouseout(p){

				div.transition()
				.duration(500)
				.style("opacity", 0);			       
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
			


			


			//zoom function
			var transform = d3.zoomIdentidy;

			//console.log(size);

			var zoomfactor;
			if(size <= 200){
				zoomfactor = 2;
			}
			if(size > 200){
				zoomfactor = size/100;
			}

			var zoom = d3.zoom()
			    		.scaleExtent([1, zoomfactor])
			    		.translateExtent([[0, 0], [svgsize, svgsize]])
			    		.on("zoom", zoomed);
			
			svgContainer.call(zoom);			

			function zoomed() {
				rects1blue.attr("transform", d3.event.transform);
				bAxisGroup.call(bAxis.scale(d3.event.transform.rescaleX(axisScale)));
  				rAxisGroup.call(rAxis.scale(d3.event.transform.rescaleY(axisScale)));
			}








			//creating scale for axis 
			//domain: length of the residue, range: length of svg
			
			var axisScale = d3.scaleLinear().domain([0,size]).range([0,svgsize]);
			
			//var xAxis = d3.axisTop().scale(axisScale);
			//var yAxis = d3.axisLeft().scale(axisScale);
			var bAxis = d3.axisBottom().scale(axisScale);
			var rAxis = d3.axisRight().scale(axisScale);
			bAxis.tickSizeOuter(0);
			rAxis.tickSizeOuter(0);
			//var xAxisGroup = svgContainer.append("g").attr("transform", "translate(0," + (size - padding) + ")").call(xAxis);
			//var yAxisGroup = svgContainer.append("g").attr("transform", "translate("+padding+",0)").call(yAxis);
			var bAxisGroup = svgContainer.append("g").call(bAxis);
			var rAxisGroup = svgContainer.append("g").call(rAxis);







			
			/*
			<input id="center" value="center" type="button">
			var center = function() {
				console.log("Hi");
			};


			var centerbtn = document.getElementById('center');
			centerbtn.addEventListener('click', center);			
			*/



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
								  


		});

	}







	this.loadsvg = function(){
		loadsvg();
	}

	this.getcmsvgdata = function(){
		return cmsvgdata;
	}

	this.getresiduesize = function(){
		return residuesize;
	}
}