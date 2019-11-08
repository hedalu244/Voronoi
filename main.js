var ps = [];
var colors = [[60, 60, 60], [255, 0, 0], [0, 255, 0], [0, 0, 255], [0, 190, 240], [210, 0, 210], [190, 190, 0]];
var canvas, ctx;
var width, height;
var holding;
var mouseX, mouseY;


const manhattan = (dx, dy) => Math.abs(dx)+Math.abs(dy);
const euclid = (dx, dy) => Math.sqrt(dx*dx + dy*dy);

var distance = manhattan;

function init() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  width = canvas.width;
  height = canvas.height;

  for(var i=0; i<colors.length; i++)
    ps.push([Math.floor(Math.random()* width), Math.floor(Math.random()* height)]);

  draw();

  canvas.onmousedown = (event)=>{
    ps.forEach(p => {
      if(euclid(p[0] - event.offsetX, p[1] - event.offsetY) < 5) holding = p;
    });
    update();
  };
  canvas.onmousemove = (event)=>{
    mouseX = event.offsetX;
    mouseY = event.offsetY;
  }
  canvas.onmouseup = (event)=>{
    holding = null;
  };

  document.getElementById("distance-select").onchange = (event) => {
    // 選択されているoption要素を取得する
    var selected = event.target.options[event.target.selectedIndex].value;
    console.log(selected);
    switch (selected) {
      default:
      case "manhattan":
        distance = manhattan;
        document.getElementById("distance-function").value = manhattan.toString();
        document.getElementById("distance-function").disabled = true;
        break;
      case "euclid":
        distance = euclid;
        document.getElementById("distance-function").value = euclid.toString();
        document.getElementById("distance-function").disabled = true;
        break;
      case "other":
        document.getElementById("distance-function").disabled = false;
        distance = eval(document.getElementById("distance-function").value);
        break;
    }
    draw();
  }

  document.getElementById("distance-function").value = manhattan.toString();
  document.getElementById("distance-function").oninput = () => {
    distance = eval(document.getElementById("distance-function").value);
    draw();
  }
}

function update(){
  if(!holding) return;

  holding[0] = mouseX;
  holding[1] = mouseY;
  draw();

  setTimeout(update, 16);
}

function draw(){
  var image_data = ctx.createImageData(width, height);
  for (var y = 0; y < height; y++)
    for (var x = 0; x < width; x++) {
      var i = (x + y * width) * 4;
      var color = colors[nearest([x, y], distance)];
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

function nearest(p, d){
  var a=0;
  var min=d(p[0] - ps[a][0], p[1] - ps[a][1]);
  for(var i=1; i<ps.length; i++) {
    var b = d(p[0] - ps[i][0], p[1] - ps[i][1]);
    if(b<min) a=i, min=b;
  }
  return a;
}

window.onload = init;
