const tileSize = 16
const utils = {
     withGrid(n) {return n * tileSize;},
     asGridCoord(x,y) {return `${x*tileSize},${y*tileSize}`},

     nextPosition(initialX, initialY, direction) {
          let x = initialX; let y = initialY;
          const size = tileSize;
          if (direction === "left") {         x -= size;
          } else if (direction === "right") { x += size;
          } else if (direction === "up") {    y -= size;
          } else if (direction === "down") {  y += size;}
          return {x,y};
     },
     oppositeDirection(direction) {
          if (direction === "left") { return "right" }
          if (direction === "right") { return "left" }
          if (direction === "up") { return "down" }
          return "up"
     },

     wait(ms) {
          return new Promise(resolve => {
               setTimeout(() => {resolve()}, ms)//wait x milliseconds before continuing 
          })
     },

     randomFromArray(array) {
          return array[Math.floor(Math.random()*array.length)]
     },

     emitEvent(name, detail) {
          const event = new CustomEvent(name, {detail});
          document.dispatchEvent(event);
     }
}