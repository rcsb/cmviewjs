function canvasclass(arg1){
	var property1 = arg1;
	var canvasdata;
	var residuesize = 0;


	/*var load = function(){
		var oReq = new XMLHttpRequest();
		var url = "http://localhost:8000/examples/tst4.json";
		oReq.open("GET", url);
		oReq.responseType = "json";
		oReq.send();

		var data = oReq.response;

	}

	var loadbtn = document.getElementById('loadbtn');
 	loadbtn.addEventListener('click', load);*/


	function load(){
		

	
		//http://localhost:8000/examples/tst4.json
		//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
		



		var oReq = new XMLHttpRequest();
		var url = "http://localhost:8000/examples/tst4.json";


		oReq.open("GET", url);
		oReq.responseType = "json";
		oReq.send();

		oReq.onload = function() {
			var data = oReq.response;
			//callback(data);
			
			//canvasclass.canvasdata = data;
			//canvasclass.residuesize = data.length1;

			//this.canvasdata = data;
			//this.residuesize = data.length1;

			//this.residuesize = data.length1;
			//console.log(data.length1);
			//console.log(this.residuesize);
			//callback(data);
			
			draw(data);
			//init(data);
			//var canvasw = document.getElementById('canvas').width;

			//console.log(residuesize);
		
		};
		/*return new Promise(function(resolve, reject){
			window.onload = resolve;
		});*/
	}






	this.loadcanvas = function(){
		
		/*
		load(function(data){
			this.canvasdata = data;
			this.residuesize = data.length1;
			//canvasdata = data;
			//residuesize = canvasdata.length1;

			//this.canvasdata = data;
			//this.residuesize = canvasdata.length1;

			//console.log(this.residuesize);
		});
		*/



		/*load(function(data){
			//this.canvasdata
			this.canvasdata = data;
			this.residuesize = data.length1;
		});*/






		load();
		/*load().then(function(){
			//console.log("Hi");
			//canvasdata = data;
			//residuesize = canvasdata.length1;
		});*/
	};

	/*function init(data){
		canvasdata = data;
		residuesize = canvasdata.length1;
		console.log(residuesize);
	}*/



	function draw(data){
		
		//console.log(this.residuesize);

		
		var size = data.length1;
		var residue1 = data.residue1;
		var residue2 = data.residue2;


		//console.log(residue1.length);

		//console.log(residue1[2]);
		//var residue1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		//var residue2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		var canvas = document.getElementById('canvas');
		var ctx = document.getElementById('canvas').getContext('2d');
		//ctx.canvas.width  = window.innerWidth;
		//ctx.canvas.height = window.innerHeight;
		var canvaswidth = canvas.width;
		//var canvasheight = document.getElementById('canvas').height;
		//var unit = Math.round(canvaswidth/size);
		var unit = canvaswidth/size;
		var unitround = Math.floor(unit);


		//console.log(canvaswidth);
		//var width = document.getElementById('canvas').getWidth();

		//filling white color
		for(var i = 0; i < canvaswidth; i++){
			for(var j = 0; j < canvaswidth; j++){
				ctx.fillStyle = "rgb(255,255,255)";
				ctx.fillRect(i,j,1,1);
			}
		}


		//ctx.fillStyle = "rgb(10,150,200)";
		//ctx.scale(unitround, unitround);
		//ctx.fillRect(0, 0, 1, 1);	


		//filling canvas data
		for(var k = 0; k < residue1.length; k++){
			var num1 = residue1[k];
			var num2 = residue2[k];
			
			ctx.fillStyle = "rgb(10,150,200)";
			//ctx.fillStyle = "rgb(200, 100, 100)";


			//ctx.fillRect(num2, num1, 1, 1);	*unit), unitround, unitround);	
			//ctx.strokeRect(M
			//ctx.fillRect(Math.round(num2*unit), Math.round(num1*unit), unitround, unitround);	
			//ctx.fillRect(Math.round(num1*unit), Math.round(num2*unit), unitround, unitround);

			ctx.fillRect(num2*unit, num1*unit, unitround, unitround);	
			ctx.fillRect(num1*unit, num2*unit, unitround, unitround);
			
		}


		var zoomctx = document.getElementById('zoom').getContext('2d');
		//zoom(event,zoomctx)
		var zoom = function(event) {
	    
	    var x = event.layerX;
	    var y = event.layerY;

	    var xunit = x/unit;
	    var yunit = y/unit;
	    //console.log(xunit);
	    //console.log(yunit);


	    zoomctx.drawImage(canvas,
	                      Math.abs(x - 5),
	                      Math.abs(y - 5),
	                      10, 10,
	                      0, 0,
	                      200, 200);
		};
		canvas.addEventListener('mousemove', zoom);







		var select = 0;
		var selectx = -1;
		var selecty = -1;
		var color = function(event){
			var x = event.layerX;
			var y = event.layerY;
			var pixel = ctx.getImageData(x,y,1,1);
			var data = pixel.data;
			var r = data[0];
			var g = data[1];
			var b = data[2];


			//console.log("x: "+x);
			//console.log("y: "+y);


			//if(r == 10 && g == 150 && b == 200){
				//ctx.fillStyle = "rgb(200,100,100)";
				//ctx.fillRect(x, y, Math.round(unitround), Math.round(unitround));	
			//}
			if(r == 10 && g == 150 && b == 200){
				var x1 = Math.floor(x/unit);
				var y1 = Math.floor(y/unit);
				var x2 = x1*unit;
				var y2 = y1*unit;



				if(select == 0){
					select = 1;
					ctx.fillStyle = "rgb(200,100,100)";
					ctx.fillRect(x2, y2, unitround,unitround);	
					ctx.fillRect(y2, x2, unitround,unitround);

					selectx = x2;
					selecty = y2;		
				}

				if(select == 1){


					ctx.fillStyle = "rgb(10,150,200)";
					ctx.fillRect(selectx, selecty, unitround, unitround);	
					ctx.fillRect(selecty, selectx, unitround, unitround);

					ctx.fillStyle = "rgb(200,100,100)";
					ctx.fillRect(x2, y2, unitround, unitround);	
					ctx.fillRect(y2, x2, unitround, unitround);				
					
					selectx = x2;
					selecty = y2;	
				}
			}

			else{

				if(selectx !== -1 && selecty !== -1){
					ctx.fillStyle = "rgb(10,150,200)";
					ctx.fillRect(selectx, selecty, unitround, unitround);	
					ctx.fillRect(selecty, selectx, unitround, unitround);   	
					select = 0;			
				}
			}	
		};
		canvas.addEventListener('click', color);

	}

	/*this.drawcanvas = function(){
		draw(data);
	};*/



}









