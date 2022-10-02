class DirectionInput {
     constructor() {
          this.heldDirections = [];
          this.map = {
               "ArrowUp": "up",       "KeyW": "up",
               "ArrowDown": "down",   "KeyS": "down",
               "ArrowLeft": "left",   "KeyA": "left",
               "ArrowRight": "right", "KeyD": "right",
          }
     }
     //returns the first held direction
     get direction() {return this.heldDirections[0];}
     init() {
          document.addEventListener("keydown", e => {
               const dir = this.map[e.code];//returns up, down, left, right
               if (dir && this.heldDirections.indexOf(dir) === -1) {
                    //if direction exists and is not currently being held, add it to front of array
                    this.heldDirections.unshift(dir);console.log(this.heldDirections)
               }
          });
          document.addEventListener("keyup", e => {
               const dir = this.map[e.code];
               const index = this.heldDirections.indexOf(dir);
               if (index > -1) {this.heldDirections.splice(index, 1);}//if direction in array, remove it
          })
     }
}