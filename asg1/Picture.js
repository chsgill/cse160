function drawPicture() {
	var canvas = document.getElementById('pic');
	if (!canvas) {
		console.log('Failed to retrieve the <canvas> element');
		return;
	}
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = 'lightskyblue';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	 document.getElementById('pictureButton').onclick = function() {
	drawTriangle2D([-0.35, -0.1, -0.8, -0.45, -.2, -0.4], 'saddlebrown'); // boots
	drawTriangle2D([0.35, -0.1, 0.8, -0.45, .2, -0.4], 'saddlebrown');
	drawTriangle2D([-0.6, 0.1, -0.9, 0, -.7, -0.20], 'gray'); // hands
	drawTriangle2D([0.6, 0.1, 0.9, 0, .7, -0.20], 'gray');
	drawTriangle2D([-0.5, 0.35,  0, 0.5, 0, 0.35], 'green'); // top
	drawTriangle2D([0.5, 0.35,  0, 0.5, 0, 0.35], 'green');
	drawTriangle2D([-0.7, -0.10, -0.5, -0.10, -0.5, 0.35], 'green'); // sides
	drawTriangle2D([0.7, -0.10, 0.5, -0.10, 0.5, 0.35], 'green');
	drawTriangle2D([-0.7, -0.10, 0.0, -0.10, 0.0, -0.35], 'green'); // bottom
	drawTriangle2D([0.7, -0.10, 0.0, -0.10, 0.0, -0.35], 'green');
	drawTriangle2D([-0.35, 0.11, -0.4, 0.6, -0.6, 0.55], 'green'); // ears
	drawTriangle2D([0.35, 0.11, 0.4, 0.6, 0.6, 0.55], 'green');
	drawTriangle2D([-0.5, 0.35, -0.5, 0.1, 0, 0.35], 'green'); // inside top
	drawTriangle2D([0.5, 0.35, 0.5, 0.1, 0, 0.35], 'green');
	drawTriangle2D([-0.5, 0.1, -0.5, -0.1, 0, -0.1], 'green'); // inside bottom
	drawTriangle2D([0.5, 0.1, 0.5, -0.1, 0, -0.1], 'green');
	drawTriangle2D([-0.5, 0.1, 0.5, 0.1, 0, 0.35], 'orange'); // face
	drawTriangle2D([-0.5, 0.1, 0.5, 0.1, 0, -0.1], 'orange');
	drawTriangle2D([-0.15, 0, 0.15, 0, 0, -0.11], 'brown'); // nose
	drawTriangle2D([-0.35, 0.11, -0.15, 0.11, -.25, 0.21], 'blue'); // lefteye
	drawTriangle2D([-0.35, 0.11, -0.15, 0.11, -.25, 0.01], 'blue');
	drawTriangle2D([0.35, 0.11, 0.15, 0.11, .25, 0.21], 'blue'); // righteye
	drawTriangle2D([0.35, 0.11, 0.15, 0.11, .25, 0.01], 'blue');
	};
	
}
function drawTriangle2D(vertices, color = 'red') {
  const canvas = document.getElementById('pic');
  const ctx = canvas.getContext('2d');

  if (vertices.length !== 6) {
    console.error('drawTriangle2D expects 6 values (3 x,y pairs)');
    return;
  }

  // Convert from WebGL coords (-1 to 1) to canvas pixels
  const toCanvasCoords = (x, y) => {
    return [
      (x + 1) * canvas.width / 2,
      (1 - y) * canvas.height / 2
    ];
  };

  const [x0, y0] = toCanvasCoords(vertices[0], vertices[1]);
  const [x1, y1] = toCanvasCoords(vertices[2], vertices[3]);
  const [x2, y2] = toCanvasCoords(vertices[4], vertices[5]);

  // Draw the triangle
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.closePath();
  ctx.fill();
}