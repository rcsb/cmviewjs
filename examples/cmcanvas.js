function load(unit){
	//http://localhost:8000/examples/tst4.json
	//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
	var oReq = new XMLHttpRequest();
	var url = "http://localhost:8000/examples/test.json";


//data.length1; //122
//data.residue1[0]; //24


	oReq.open("GET", url);
	oReq.responseType = "json";
	oReq.send();

	oReq.onload = function() {
		var data = oReq.response;
		draw(data);

		var canvasw = document.getElementById('canvas').width;
		var size = data.length1;


		//console.log(size);
		//console.log(canvasw);
		//console.log(unit1);
	
	}

	//console.log(unit);

}



function draw(data){
	

	


	//console.log(data.length1);

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
	for(var i = 0; i < canvaswidth; i++){
		for(var j = 0; j < canvaswidth; j++){
			ctx.fillStyle = "rgb(255,255,255)";
			ctx.fillRect(i,j,1,1);
		}
	}


	//ctx.fillStyle = "rgb(10,150,200)";
	//ctx.scale(unitround, unitround);
	//ctx.fillRect(0, 0, 1, 1);	

	for(var k = 0; k < residue1.length; k++){
		var num1 = residue1[k];
		var num2 = residue2[k];
		
		//var x = 10;
		//ctx.fillStyle = 'rgb(' + Math.floor(255 - x) + ',' +
         //              Math.floor(2*x) + ',0)';
		ctx.fillStyle = "rgb(10,150,200)";
		//ctx.fillStyle = "rgb(200, 100, 100)";
		
		/*ctx.scale(unitround, unitround);
		ctx.fillRect(num1, num2, 1, 1);	
		ctx.fillRect(num2, num1, 1, 1);
		ctx.setTransform(1, 0, 0, 1, 0, 0);*/	

		//ctx.fillRect(num2, num1, 1, 1);	*unit), unitround, unitround);	
		//ctx.strokeRect(M
		ctx.fillRect(Math.round(num2*unit), Math.round(num1*unit), unitround+1, unitround+1);	
		ctx.fillRect(Math.round(num1*unit), Math.round(num2*unit), unitround+1, unitround+1);

		//console.log("num1: "+num1+" "+"num2: "+num2);
		//ctx.strokeRect(Math.round(num2*unit), Math.round(num1ath.round(num1*unit), Math.round(num2*unit), unitround, unitround);	
		//x = x + 10;
		
	}


	var zoomctx = document.getElementById('zoom').getContext('2d');
	//zoom(event,zoomctx)
	var zoom = function(event) {
    
    var x = event.layerX;
    // x/unit = x axis
    //console.log("X-axis: "+Math.round(x/unit));
    var y = event.layerY;
    // y/unit = y axis
    //console.log("Y-axis: "+Math.round(y/unit));
    //console.log("X: "+x);
    //console.log("Y: "+y);
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
			var x1 = Math.floor(x/unitround);
			var y1 = Math.floor(y/unitround);
			var x2 = Math.round(x1*unitround);
			var y2 = Math.round(y1*unitround);


			var x3 = Math.round(x/unit);
			var y3 = Math.round(y/unit);
			console.log("x3: "+x3);
			console.log("y3: "+y3);


			if(select == 0){
				select = 1;
				ctx.fillStyle = "rgb(200,100,100)";
				ctx.fillRect(Math.floor(x2), Math.floor(y2), Math.round(unitround), Math.round(unitround));	
				ctx.fillRect(Math.floor(y2), Math.floor(x2), Math.round(unitround), Math.round(unitround));

				selectx = Math.floor(x2);
				selecty = Math.floor(y2);		
			}

			if(select == 1){


				ctx.fillStyle = "rgb(10,150,200)";
				ctx.fillRect(selectx, selecty, Math.round(unitround), Math.round(unitround));	
				ctx.fillRect(selecty, selectx, Math.round(unitround), Math.round(unitround));

				ctx.fillStyle = "rgb(200,100,100)";
				ctx.fillRect(Math.floor(x2), Math.floor(y2), Math.round(unitround), Math.round(unitround));	
				ctx.fillRect(Math.floor(y2), Math.floor(x2), Math.round(unitround), Math.round(unitround));				
				
				selectx = Math.floor(x2);
				selecty = Math.floor(y2);	
			}
		}

		else{

			if(selectx !== -1 && selecty !== -1){
				ctx.fillStyle = "rgb(10,150,200)";
				ctx.fillRect(selectx, selecty, Math.round(unitround), Math.round(unitround));	
				ctx.fillRect(selecty, selectx, Math.round(unitround), Math.round(unitround));   	
				select = 0;			
			}
		}	
	};
	canvas.addEventListener('click', color);
  }









