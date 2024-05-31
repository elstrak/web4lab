const width = 1000;
const height = 1000;
const svg = d3.select("svg").attr("width", width).attr("height", height);

const centerX = width / 2;
const centerY = height / 2;

function updateSmileyColor() {
  const newColor = document.getElementById("color").value;
  d3.select("#smiley-head").attr("fill", newColor); 
}

let smileyGroup; 

function drawFigure() {
  const radius = 80;
  const group = svg.append("g")
  .attr("id", "smileyGroup")
  .attr("transform", `translate(0, 0)`); 

  smileyGroup = svg.append("g") 
  .attr("id", "smileyGroup")
  .attr("transform", `translate(0, 0)`);


  group.append("circle")
    .attr("cx", centerX)
    .attr("cy", centerY)
    .attr("r", radius)
    .attr("fill", "yellow")
    .attr("id", "smiley-head");

    group.append("circle")
    .attr("cx", centerX - 40)
    .attr("cy", centerY - 30)
    .attr("r", 20)
    .attr("fill", "white"); 

  group.append("circle")
    .attr("cx", centerX - 40)
    .attr("cy", centerY - 30)
    .attr("r", 10)
    .attr("fill", "black");

  group.append("circle") 
    .attr("cx", centerX + 40)
    .attr("cy", centerY - 30)
    .attr("r", 20)
    .attr("fill", "white");

  group.append("circle")
    .attr("cx", centerX + 40)
    .attr("cy", centerY - 30)
    .attr("r", 10)
    .attr("fill", "black");



  const mouthArc = d3.arc() 
    .innerRadius(0)      
    .outerRadius(45)    
    .startAngle(Math.PI / 2) 
    .endAngle(Math.PI * 3 / 2);

  group.append("path")
    .attr("d", mouthArc)
    .attr("transform", `translate(${centerX}, ${centerY + 20})`)
    .attr("fill", "#E91E63"); 

    group.append("rect")
    .attr("x", centerX - 20)
    .attr("y", centerY + 20)
    .attr("width", 10)
    .attr("height", 20)
    .attr("fill", "white");

  group.append("rect")
    .attr("x", centerX + 10)
    .attr("y", centerY + 20)
    .attr("width", 10)
    .attr("height", 20)
    .attr("fill", "white");

 
  group.append("circle")
    .attr("cx", centerX - 40)
    .attr("cy", centerY - 30)
    .attr("r", 25)
    .attr("fill", "none")
    .attr("stroke", "black");

  group.append("circle")
    .attr("cx", centerX + 40)
    .attr("cy", centerY - 30)
    .attr("r", 25)
    .attr("fill", "none")
    .attr("stroke", "black");


  group.append("line")
    .attr("x1", centerX - 15)
    .attr("y1", centerY - 30)
    .attr("x2", centerX + 15)
    .attr("y2", centerY - 30)
    .attr("stroke", "black")
    .attr("stroke-width", 3);


  group.append("line")
    .attr("x1", centerX + 65)
    .attr("y1", centerY - 30)
    .attr("x2", centerX + 80)
    .attr("y2", centerY - 30) 
    .attr("stroke", "black")
    .attr("stroke-width", 3);


  group.append("line")
    .attr("x1", centerX - 65)
    .attr("y1", centerY - 30)
    .attr("x2", centerX - 80)
    .attr("y2", centerY - 30) 
    .attr("stroke", "black")
    .attr("stroke-width", 3);

    d3.select("#color").on("input", updateSmileyColor); 
}

function generateSpiralData(centerX, centerY, maxRadius, turns, points) {
  const data = [];
  for (let i = 0; i <= points; i++) {
    const t = i / points;
    const angle = -t * 2 * Math.PI * turns;
    const radius = t * maxRadius;

    const x = centerX + radius * Math.cos(angle + Math.PI/2); 
    const y = centerY + radius * Math.sin(angle + Math.PI/2); 

    data.push({ x, y });
  }
  return data;
}

const spiralMaxRadius = 300; 
const spiralTurns = 3;
const spiralPoints = 500; 
const spiralData = generateSpiralData(0, 100, spiralMaxRadius, spiralTurns, spiralPoints);

function translateAlong(path) {
  const length = path.getTotalLength();
  return function(t) {
    const { x, y } = path.getPointAtLength(t * length);
    return `translate(${x}, ${y})`;
  }
}

function animateSmiley() {
  
  const smileyGroup = d3.select("#smileyGroup");
  const duration = parseInt(d3.select("#duration").node().value, 10) || 5000;
  const lineGenerator = d3.line()
  .x(d => d.x) 
  .y(d => d.y); 

const spiralPath = svg.append("path")
  .attr("d", lineGenerator(spiralData)) 
    .attr("stroke", "none")
    .attr("fill", "none");

  smileyGroup.transition()
    .duration(duration) 
    .ease(d3.easeLinear) 
    .attrTween("transform", () => translateAlong(spiralPath.node())) 
    .on("end", () => spiralPath.remove()); 
}



function clear() {
  svg.selectAll("*").remove();
}



  d3.select("#start").on("click", animateSmiley);
  d3.select("#clear").on("click", clear);
drawFigure(); 

