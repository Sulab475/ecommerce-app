const svgNS = "http://www.w3.org/2000/svg";

// Numbers
const numbersGroup = document.getElementById("numbers");
for (let i = 1; i <= 12; i++) {
  let angle = (i * Math.PI) / 6;
  let x = 200 + Math.sin(angle) * 150;
  let y = 200 - Math.cos(angle) * 150;

  let text = document.createElementNS(svgNS, "text");
  text.setAttribute("x", x);
  text.setAttribute("y", y);
  text.textContent = i;
  numbersGroup.appendChild(text);
}

// Spider
const spider = document.getElementById("spider");

// body
let body = document.createElementNS(svgNS, "circle");
body.setAttribute("cx", 200);
body.setAttribute("cy", 200);
body.setAttribute("r", 8);
body.setAttribute("fill", "orange");
spider.appendChild(body);

// legs
for (let i = 0; i < 8; i++) {
  let angle = (i * Math.PI) / 4;
  let x = 200 + Math.cos(angle) * 25;
  let y = 200 + Math.sin(angle) * 25;

  let leg = document.createElementNS(svgNS, "line");
  leg.setAttribute("x1", 200);
  leg.setAttribute("y1", 200);
  leg.setAttribute("x2", x);
  leg.setAttribute("y2", y);
  leg.setAttribute("stroke", "orange");

  spider.appendChild(leg);
}

// Gears (simple rotating circles)
function createGear(className, radius, speed) {
  const gear = document.querySelector("." + className);

  let circle = document.createElementNS(svgNS, "circle");
  circle.setAttribute("cx", 200 + Math.random() * 100 - 50);
  circle.setAttribute("cy", 200 + Math.random() * 100 - 50);
  circle.setAttribute("r", radius);
  circle.setAttribute("stroke", "orange");
  circle.setAttribute("fill", "none");

  gear.appendChild(circle);

  let angle = 0;
  function rotate() {
    angle += speed;
    gear.setAttribute("transform", `rotate(${angle} 200 200)`);
    requestAnimationFrame(rotate);
  }
  rotate();
}

createGear("gear1", 30, 0.5);
createGear("gear2", 20, -1);
createGear("gear3", 15, 0.8);

// Clock Hands
function updateClock() {
  const now = new Date();

  const sec = now.getSeconds();
  const min = now.getMinutes();
  const hr = now.getHours();

  document.getElementById("second")
    .setAttribute("transform", `rotate(${sec * 6} 200 200)`);

  document.getElementById("minute")
    .setAttribute("transform", `rotate(${min * 6} 200 200)`);

  document.getElementById("hour")
    .setAttribute("transform", `rotate(${(hr % 12) * 30 + min * 0.5} 200 200)`);

  requestAnimationFrame(updateClock);
}

updateClock();