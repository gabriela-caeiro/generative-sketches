const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

/* //to create animation w/o canvas-sketch animate:true
const animate = () => {
  console.log("Domestika");
  requestAnimationFrame(animate);
};
animate(); */

const sketch = ({ context, width, height }) => {
  const agents= [];

  for (let i = 0; i < 55; i++){
    const x = random.range(0, width);
    const y = random.range(0, height);
    agents.push(new Agent(x, y));
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];

      for (let j = i + 1; j < agents.length; j++) {
        const other = agents[j];

        const dist = agent.pos.getDistance(other.pos); 

        if (dist > 200) continue;

        context.lineWidth = math.mapRange(dist, 0, 200, 7, 0.7);

        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y);
        context.lineTo(other.pos.x, other.pos.y);
        context.strokeStyle = "white";
        context.stroke();
      }
    }

    agents.forEach(agent => {
      agent.update();
      agent.draw(context);
      agent.bounce(width, height);
    });

/*     //const point = { x: 800, y: 400, radius : 10};
    const agentA = new Agent(800, 400);
    const agentB = new Agent(300, 700);

    agentA.draw(context);
    agentB.draw(context); */

   /*  //without Agent, only wit Point constructor
    context.beginPath();
    context.arc(pointA.x, pointA.y, pointA.radius, 0, Math.PI * 2);
    context.fillStyle = "black";
    context.fill();
;
    context.arc(pointB.x, pointB.y, pointB.radius, 0, Math.PI * 2);
    context.fillStyle = "black";
    context.fill(); */
  };
};

canvasSketch(sketch, settings);

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getDistance(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

class Agent {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(random.range(-1.2, 1.2), random.range(-1.2, 1.2));
    this.radius = random.range(4, 11);
  }

  bounce(width, height) {
    if(this.pos.x <= 0 || this.pos.x >= width) this.vel.x *= -1; 
    if(this.pos.y <= 0 || this.pos.y >= height) this.vel.y *= -1; 
  }

  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  draw(context) {
    context.fillStyle = "black";

    context.save();
    context.translate(this.pos.x, this.pos.y);

    context.lineWidth = 2;
  
    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    context.restore();
  }
}


