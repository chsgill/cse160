// DrawRectangle.js
function main() {
// Retrieve <canvas> element                                  <- (1)
	var canvas = document.getElementById('asg0');
	if (!canvas) {
		console.log('Failed to retrieve the <canvas> element');
		return;
	}

// Get the rendering context for 2DCG                          <- (2)
	var ctx = canvas.getContext('2d');

// Draw a rectangle                                       <- (3)
	ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a color
	ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color

}

function drawVector(v, color)
{
	var canvas = document.getElementById('asg0');
	if (!canvas) {
		console.log('Failed to retrieve the <canvas> element');
		return;
	}
	var ctx = canvas.getContext('2d');
	let vx = v.getX(); // 2.25
	let vy = v.getY(); // 2.25
	ctx.beginPath();
	ctx.moveTo(200, 200);
	ctx.lineWidth = 1;
	ctx.strokeStyle = color;
	ctx.lineTo(200+(vx*20), 200-(vy*20));
	ctx.stroke();
}

function handleDrawEvent()
{	
	var canvas = document.getElementById('asg0');
	if (!canvas) {
		console.log('Failed to retrieve the <canvas> element');
		return;
	}
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
	ctx.fillRect(0, 0, canvas.width, canvas.height); //clear rect??
	var ctx = canvas.getContext('2d');
	let v1x = parseFloat(document.getElementById("v1x").value);
	let v1y = parseFloat(document.getElementById("v1y").value);
	let v2x = parseFloat(document.getElementById("v2x").value);
	let v2y = parseFloat(document.getElementById("v2y").value);

	var v1 = new Vector3([v1x, v1y, 0]);
	var v2 = new Vector3([v2x, v2y, 0]);

	drawVector(v1, "red");
	drawVector(v2, "blue");
}

function handleDrawOperationEvent()
{	
	var canvas = document.getElementById('asg0');
	if (!canvas) {
		console.log('Failed to retrieve the <canvas> element');
		return;
	}
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
	ctx.fillRect(0, 0, canvas.width, canvas.height); //clear rect??
	var ctx = canvas.getContext('2d');
	let v1x = parseFloat(document.getElementById("v1x").value);
	let v1y = parseFloat(document.getElementById("v1y").value);
	let v2x = parseFloat(document.getElementById("v2x").value);
	let v2y = parseFloat(document.getElementById("v2y").value);

	var v1 = new Vector3([v1x, v1y, 0]);
	var v2 = new Vector3([v2x, v2y, 0]);

	drawVector(v1, "red");
	drawVector(v2, "blue");

	if(document.getElementById("op-select").value == "add")
	{
		var v3 = v1.add(v2);
		drawVector(v3, "green");
	}
	if(document.getElementById("op-select").value == "sub")
	{
		var v3 = v1.sub(v2);
		drawVector(v3, "green");
	}
	if(document.getElementById("op-select").value == "mul")
	{
		var scalar = parseFloat(document.getElementById("scalar").value);
		var v3 = v1.mul(scalar);
		var v4 = v2.mul(scalar);
		drawVector(v3, "green");
		drawVector(v4, "green");
	}
	if(document.getElementById("op-select").value == "div")
	{
		var scalar = parseFloat(document.getElementById("scalar").value);
		var v3 = v1.div(scalar);
		var v4 = v2.div(scalar);
		drawVector(v3, "green");
		drawVector(v4, "green");
	}
	if(document.getElementById("op-select").value == "dot")
	{
		var ang = Math.acos((Vector3.dot(v1, v2))/(v1.magnitude()*v2.magnitude()));
		console.log("Angle Between: "+ang*(180/Math.PI));
	}
	if(document.getElementById("op-select").value == "crs")
	{
		var v3 = Vector3.cross(v1, v2);
		//var crs = Math.abs(v3.getZ());
		console.log("Area of the triangle: "+v3.magnitude()*0.5);
	}
	if(document.getElementById("op-select").value == "mag")
	{
		console.log("Magnitude v1: "+v1.magnitude());
		console.log("Magnitude v2: "+v2.magnitude());
	}
	if(document.getElementById("op-select").value == "nor")
	{
		v1 = v1.normalize();
		v2 = v2.normalize();
		drawVector(v1, "green");
		drawVector(v2, "green");
	}


}