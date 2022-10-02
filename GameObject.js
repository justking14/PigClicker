class GameObject {
     constructor(config) {
          this.id = null;
          this.isMounted = false;
          this.x = config.x || 0, this.y = config.y || 0;
          this.direction = config.direction || "down";
          this.sprite = new Sprite({
               gameObject: this,
               src: config.src || "/images/characters/people/hero.png",
          });

          this.behaviorLoop = config.behaviorLoop || [];
          this.behaviorLoopIndex = 0;
          this.talking = config.talking || [];
          this.retryTimeout = null;
     }

     mount(map) {
          this.isMounted = true;
          //If we have a behavior, kick off after a short delay
          setTimeout(() => {this.doBehaviorEvent(map)}, 10)
     }
     update() { }
     
     async doBehaviorEvent(map) { 
          if (this.behaviorLoop.length === 0) { return }//Do nothing if nothing to do
          
          //wait a second and retry if cutscene is playing
          if (map.isCutscenePlaying) {
               if(this.retryTimeout){clearTimeout(this.retryTimeout)}//reset timeout
               this.retryTimeout = setTimeout(() => {this.doBehaviorEvent(map)}, 1000)
          }

          let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
          eventConfig.who = this.id;

          //Create an event instance out of our next event config
          const eventHandler = new OverworldEvent({ map, event: eventConfig });
          await eventHandler.init();//wait for event to finish

          //set up next event to trigger
          this.behaviorLoopIndex += 1;
          if (this.behaviorLoopIndex === this.behaviorLoop.length) {this.behaviorLoopIndex = 0} 

          //Do it again!
          this.doBehaviorEvent(map);
     }
}