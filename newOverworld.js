class newOverworld {
     constructor(config) {
          this.element = config.element;
          this.canvas = this.element.querySelector(".game-canvas");
          this.ctx = this.canvas.getContext("2d");
          this.map = null;

          this.countDown = 10;
          this.score = 0//1000
          this.isPaused = false
          this.canClick = false 

          this.r = 0, this.b = 0, this.g = 0;
          this.r2 = 250, this.b2 = 0, this.g2 = 0;
          this.colorCounter = 0;

          this.timePerSecond = 1000
          
          this.particleSystem =  []
                    
          this.audio1 = new Audio('oink1.wav');
          this.audio2 = new Audio('oink2.wav');
          this.audio3 = new Audio('oink3.wav');
          this.audio4 = new Audio('moo1.wav');

                   
          this.element.addEventListener("click", this.mouseDownFunction);
          this.pigButton = document.getElementById("pigButton")
          this.pigButton.disabled = true
          console.log(this.pigButton)
          this.counterTimeout = setTimeout(() => { this.doCount() }, 1000)
          this.autoTimer = null;
          this.pigButton.addEventListener("click", () => {
               //if (this.canClick) {
               //clearTimeout(this.counterTimeout)
               this.incrementScore()
               //}
          });

          this.element = document.createElement("div");
          this.element.classList.add("Battle");
          document.querySelector(".game-container").appendChild(this.element)
              
          const menu = new SubmissionMenu({
               onComplete: submission => { resolve(submission) },
               overworld: this
          })
          menu.init( this.element )

          new KeyPressListener("Escape", () => {
               this.score = 99999
          })
     }
      mouseDownFunction() {
          if (window.overworld.canClick === true) {window.overworld.incrementScore()}
     }

     changeButton(enabled, disabled) {
          ///console.log(document.getElementById("div1"))
          document.getElementById("div1").querySelector('.buttonCentered').style.background = "url(" + enabled + ") no-repeat";

          if (document.getElementById("div1").querySelector('.buttonCentered:disabled') !== null) {
               document.getElementById("div1").querySelector('.buttonCentered:disabled').style.background = "url("+disabled+") no-repeat";
          }
          if (document.getElementById("div1").querySelector('.buttonCentered:enabled') !== null) {
               document.getElementById("div1").querySelector('.buttonCentered:enabled').style.background = "url("+enabled+") no-repeat";
          }
     }

     incrementScore() {
          console.log(this.score)


          if (audioUpgrades["Oink1"].active === true) { this.audio1.play() }
          if (audioUpgrades["Oink2"].active === true) { this.audio2.play() }
          if (audioUpgrades["Oink3"].active === true) { this.audio3.play() }
          if (audioUpgrades["Moo1"].active === true) { this.audio4.play() }

          if (visualUpgrades["Fireworks"].active === true) {
               this.particleSystem.push(new ParticleSystem(this.canvas, 100, true))
          }


          this.canClick = false;
          this.countDown = 10;
          let baseValue = 1
          if (gamePlayUpgrades["DP"].active === true) {baseValue = baseValue * 2}
          //if (gamePlayUpgrades["TP"].active === true) { baseValue = baseValue * 3 }



          this.score += baseValue
          document.getElementById("pigButton").disabled = true

          document.getElementById("Counter").innerHTML = "Click in " + this.countDown + " Seconds"
          this.counterTimeout = setTimeout(() => { this.doCount() }, 1000)

     }

     doCount() {
          console.log(this.particleSystem.length)
          if (visualUpgrades["RandomFireworks"].active === true) {
               if (Math.random() > 0.6 && this.particleSystem.length < 20) {
                    this.particleSystem.push(new ParticleSystem(this.canvas, 100, false))
               }
          }
          this.countDown -= 1
          if (this.countDown > 0) {
               if (this.countDown > 1) {
                    document.getElementById("Counter").innerHTML = "Click in " + this.countDown + " Seconds"
               } else {
                    document.getElementById("Counter").innerHTML = "Click in " + this.countDown + " Second"
               }
               this.counterTimeout = setTimeout(() => { this.doCount() }, this.timePerSecond)
               return
          }
          this.canClick = true
          document.getElementById("Counter").innerHTML = "Click Now"
          document.getElementById("pigButton").disabled = false

          console.log(gamePlayUpgrades["AutoClick"].active, gamePlayUpgrades["AutoClick2"])
          if (gamePlayUpgrades["AutoClick"].active === true && gamePlayUpgrades["AutoClick2"].active === false) {
               this.autoTimer = setTimeout(() => { document.getElementById("pigButton").click(); }, 10000)
          } else if (gamePlayUpgrades["AutoClick2"].active === true) {
               console.log(gamePlayUpgrades)
               this.autoTimer = setTimeout(() => {document.getElementById("pigButton").click() ; }, 1000)
               
          }
     }

     startGameLoop() {
          const step = () => {
               this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);//Clear off the canvas
               const cameraPerson = null//this.map.gameObjects.hero;

               if (this.score === 1) {
                    document.getElementById("Score").innerHTML = this.score + " Bit of Bacon" //"Score: " + this.score 
               } else {
                    document.getElementById("Score").innerHTML = this.score + " Bits of Bacon" //"Score: " + this.score 
               }

               let baseTime = 1000
               if (gamePlayUpgrades["TW"].active === true) { baseTime = baseTime * 0.7}
               if (gamePlayUpgrades["TW2"].active === true) { baseTime = baseTime * 0.5}
               if (gamePlayUpgrades["TW3"].active === true) { baseTime = baseTime * 0.2}
               this.timePerSecond = baseTime
                         
               if (skinUpgrades["Default"].active === true) {
                    this.changeButton("pig1b.png", "pig1a.png")//a is eyes closed
               } else if (skinUpgrades["CoolPig"].active === true) {
                    this.changeButton("cool1.png", "cool2.png")
               }else if (skinUpgrades["InvisiblePig"].active === true) {
                    this.changeButton("invisible1.png", "invisible2.png")
               }else if (skinUpgrades["Cow"].active === true) {
                    this.changeButton("cow1.png", "cow2.png")
               }


               let count = 0;
               let i = this.particleSystem.length
               while (i--) {
                    //console.log(this.particleSystem[i])
                    this.particleSystem[i].draw(this.ctx)
                    //console.log(this.particleSystem[i].particles.length)
                    if (this.particleSystem[i].particles.length < 10) {
                         this.particleSystem.splice(i,1)
                    }
               }


               

               if (!this.isPaused) {
                    requestAnimationFrame(() => {step();})//if game is not paused, keep stepping
               }
          }
          step();
     }

     bindActionInput() {
          /* 
          //new KeyPressListener("Enter", () => {this.map.checkForActionCutscene()})
         
          new KeyPressListener("Escape", () => {
               if (!this.map.isCutscenePlaying) {
                    this.map.startCutscene([{type: "pause"}])
               }
          })
          */
     }

     async init() {
          const container = document.querySelector(".game-container")

          this.bindActionInput();
          this.directionInput = new DirectionInput();
          this.directionInput.init();

          this.startGameLoop();
          this.bg()

     }
     
     bg() {
  
          this.colorCounter+=1
	if (this.r <= 255 && this.g == 0 && this.b == 0) {
		this.r ++;
	}

	if (this.r == 255 && this.b == 0 && this.g <= 255) {
		this.g++;
	}

	if (this.r == 255 && this.g == 255 && this.b <= 255) {
		this.b++;
	}

	if (this.b == 255 && this.g == 255 && this.r > 0) {
		this.r --;
	}

	if (this.r == 0 && this.b == 255 && this.g > 0) {
		this.g --;
	}

	if (this.r == 0 && this.g == 0 && this.b > 0) {
		this.b --;
     }
          
          
     if (this.r2 <= 255 && this.g2 == 0 && this.b2 == 0) {
		this.r2++;
	}

	if (this.r2 == 255 && this.b2 == 0 && this.g2 <= 255) {
		this.g2++;
	}

	if (this.r2 == 255 && this.g2 == 255 && this.b2 <= 255) {
		this.b2++;
	}

	if (this.b2 == 255 && this.g2 == 255 && this.r2 > 0) {
		this.r2--;
	}

	if (this.r2 == 0 && this.b2 == 255 && this.g2 > 0) {
		this.g2--;
	}

	if (this.r2 == 0 && this.g2 == 0 && this.b2 > 0) {
		this.b2--;
	}


	setTimeout(function() {
		window.overworld.bg();
     }, 10);
          
          if (visualUpgrades["GradientBackground"].active === true) {

               let string = "linear-gradient(" + this.colorCounter + "deg, " + this.rgbToHex(this.r2, this.g2, this.b2) + ", " + this.rgbToHex(this.r, this.g, this.b) + ")"
               document.querySelector(".game-container").style.setProperty("background", string)
          }
     }
          
     componentToHex(c) {
          var hex = c.toString(16);
          return hex.length == 1 ? "0" + hex : hex;
     }
     rgbToHex(r, g, b) {
          return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
     }
}

class ParticleSystem{
     constructor(canvas, count, isCentered) {
          this.x = canvas.width / 2
          this.y = canvas.height / 2 - 50
          if (isCentered === false) {
               this.x = Math.random() * canvas.width
               this.y = (Math.random() * canvas.height) 
          }
          this.particles = []
          this.count = count
          for (var i = 0; i < count; i++){
               this.particles.push(new Particle(this.x, this.y))
          }
     }
     draw(ctx) {
          let i = this.particles.length 
          console.log()
          while (i--) {
               this.particles[i].draw(ctx)
               this.particles[i].update(i)
               //console.log(this.particles[i].alpha)
               if (this.particles[i].alpha <= 0.9) {
                    this.particles.splice(i, 1);
               }
          }
     }
}
function Particle( x, y ) {
	this.x = x;
     this.y = y;
     hue = Math.random() * 360
	// track the past coordinates of each particle to create a trail effect, increase the coordinate count to create more prominent trails
	this.coordinates = [];
	this.coordinateCount = 5;
	while( this.coordinateCount-- ) {
		this.coordinates.push( [ this.x, this.y ] );
	}
	// set a random angle in all possible directions, in radians
	this.angle = random( 0, Math.PI * 2 );
	this.speed = random( 1, 5 );
	// friction will slow the particle down
	this.friction = 0.98;
	// gravity will be applied and pull the particle down
	this.gravity = 1;
	// set the hue to a random number +-50 of the overall hue variable
	this.hue = random( hue - 50, hue + 50 );
	this.brightness = random( 50, 80 );
	this.alpha = 1;
	// set how fast the particle fades out
	this.decay = random( 0.00015, 0.0003 );
}

// update particle
Particle.prototype.update = function( index ) {
	// remove last item in coordinates array
	this.coordinates.pop();
	// add current coordinates to the start of the array
	this.coordinates.unshift( [ this.x, this.y ] );
	// slow down the particle
	this.speed *= this.friction;
	// apply velocity
	this.x += Math.cos( this.angle ) * this.speed;
	this.y += Math.sin( this.angle ) * this.speed + this.gravity;
	// fade out the particle
	this.alpha -= this.decay;
	
	// remove the particle once the alpha is low enough, based on the passed in index
	
}

// draw particle
Particle.prototype.draw = function(ctx) {
     ctx.beginPath();
     ctx.lineWidth = 3
	// move to the last tracked coordinates in the set, then draw a line to the current x and y
	ctx.moveTo( this.coordinates[ this.coordinates.length - 1 ][ 0 ], this.coordinates[ this.coordinates.length - 1 ][ 1 ] );
	ctx.lineTo( this.x, this.y );
	ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
	ctx.stroke();
}
function random( min, max ) {
	return Math.random() * ( max - min ) + min;
}
