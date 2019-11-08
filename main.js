var ps = [];
var colors = [[60, 60, 60], [255, 0, 0], [0, 255, 0], [0, 0, 255], [0, 190, 240], [210, 0, 210], [190, 190, 0]];
var canvas, ctx;
var width, height
function init() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  width = canvas.width;
  height = canvas.height;

  for(var i=0; i<colors.length; i++)
    ps.push([Math.random()* width, Math.random()* height]);

  draw();
}

function draw(){
  var image_data = ctx.createImageData(width, height);
  for (var y = 0; y < height; y++)
    for (var x = 0; x < width; x++) {
      var i = (x + y * width) * 4;
      var color = colors[nearest([x, y], manhattan)];
      image_data.data[i] = color[0];
      image_data.data[i + 1] = color[1];
      image_data.data[i + 2] = color[2];
      image_data.data[i + 3] = 255;
    }
  ctx.putImageData(image_data, 0, 0);

  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ps.forEach(p => {
    ctx.beginPath();
    ctx.arc(p[0], p[1], 5, 0, 2 * Math.PI);
    ctx.fill();
  });
}

function nearest(x, d){
  var a=0;
  var min=d(x, ps[a]);
  for(var i=1; i<ps.length; i++) {
    var b = d(x, ps[i]);
    if(b<min) a=i, min=b;
  }
  return a;
}

function manhattan(a, b){
  return Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]);
}

window.onload = init;
