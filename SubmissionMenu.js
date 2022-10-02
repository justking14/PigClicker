class SubmissionMenu { 
     constructor({ onComplete, overworld }) {
          this.onComplete = onComplete
          this.overworld = overworld
          this.lastAudio = null//audioUpgrades["Oink1"]
          this.lastSkin = skinUpgrades["Default"]
     }
     getPages() {
          const backOption = {
               label: "Go Back", description: "Return to Previous Page",
               handler: () => {this.keyboardMenu.setOptions(this.getPages().root)}
          };
          const gpUpgrades = []
          Object.values(gamePlayUpgrades).forEach(c => {
               gpUpgrades.push((c.returnObject(this.overworld, this)))
          })

          const auUpgrades = []
          Object.values(audioUpgrades).forEach(c => {
               if (this.lastAudio && c.name === this.lastAudio.name) {
                    c.active = true 
               } else {
                    c.active = false
               }
               auUpgrades.push((c.returnObject(this.overworld, this)))
          })

          const visUpgrades = []
          Object.values(visualUpgrades).forEach(c => {
               visUpgrades.push((c.returnObject(this.overworld, this)))
          })

          const skUpgrades = []
          Object.values(skinUpgrades).forEach(c => {
               skUpgrades.push((c.returnObject(this.overworld, this)))
               if (this.lastSkin && c.name === this.lastSkin.name) {
                    c.active = true 
               } else {
                    c.active = false
               }
          })

          return {
               root: [
                    {
                         label: "Gameplay", description: "Buy Gameplay Upgrades",
                         handler: () => { this.keyboardMenu.setOptions(this.getPages().gamePlay) }
                    },
                    {
                         label: "Visual", description: "Buy Visual Upgrades",
                         handler: () => { this.keyboardMenu.setOptions(this.getPages().visual) }
                    },
                    {
                         label: "Skins", description: "Buy New Skins",
                         handler: () => { this.keyboardMenu.setOptions(this.getPages().skin) }
                    },
                    {
                         label: "Audio", description: "Buy New Audio Options",
                         handler: () => { this.keyboardMenu.setOptions(this.getPages().audio) }
                    },
               ],
               gamePlay: [
                    ...gpUpgrades,
                    backOption
               ],
               visual: [
                    ...visUpgrades,
                    backOption
               ],
               audio: [
                    ...auUpgrades,
                    backOption
               ],
               skin: [
                    ...skUpgrades,
                    backOption
               ]
          }
     }

     menuSubmit(action, instanceId=null) {
          this.keyboardMenu?.end();
          this.onComplete({
               action,
               target: action.targetType === "friendly" ? this.caster : this.enemy
          })
     }

     showMenu(container, bookmark) {
          console.log(bookmark)
          this.container = container
          if(this.keyboardMenu){this.keyboardMenu.end()}
          this.keyboardMenu = new KeyboardMenu();
          this.keyboardMenu.init(container);
          this.keyboardMenu.setOptions( bookmark || this.getPages().root)
     }

     init(container) {this.showMenu(container)}
}

class Upgrade{
     constructor(name, description, type, cost) {
          this.name = name;
          this.description = description
          this.cost = cost;
          this.unlocked = false 
          this.active = false 
          this.type = type 
     }

     returnObject(overworld, menu){
          return {
               label: this.name,
               description: this.description,
               right: () => {
                    if (this.unlocked === false) {
                         if (this.cost === 1) {
                              return "Cost: " + this.cost + " Bit of Bacon"
                         }
                         return "Cost: " + this.cost + " Bits of Bacon"
                    } else {
                         return "Active: " + this.active 
                    }
               },
               handler: () => {
                    if (this.unlocked === false) {
                         if (this.cost <= overworld.score) {
                              overworld.score -= this.cost;
                              this.unlocked = true 
                              this.active = true

                              if (this.type === "audio") {
                                   menu.lastAudio = this
                              } else if (this.type === "skin") {
                                   menu.lastSkin = this
                              }
                              
                              //menu.keyboardMenu.end()
                              menu.keyboardMenu.setOptions(menu.getPages()[this.type])
                              //menu.showMenu(menu.container, menu.getPages()[this.type])
                         }
                    } else {
                         if (this.type === "audio") {
                              menu.lastAudio = this
                         } else if (this.type === "skin") {
                              menu.lastSkin = this
                         }
                         if (this.active === true) {
                              this.active = false
                              menu.keyboardMenu.setOptions(menu.getPages()[this.type])
                         } else {
                              this.active = true
                              menu.keyboardMenu.setOptions(menu.getPages()[this.type])

                         }
                    }
               }
          }
     }
}

let gamePlayUpgrades = {
     AutoClick: new Upgrade("Auto-Click", "Automatically clicks every 20 seconds", "gamePlay", 1),

     TW: new Upgrade("Time Warp", "Accelerates time to make each second move faster", "gamePlay", 5),
          
     DP: new Upgrade("Double Points", "Doubles the amount of bacon earned from clicking", "gamePlay", 10),

     TW2: new Upgrade("Ultra Time Warp", "Shortens the length of a second", "gamePlay", 25),
     TW3: new Upgrade("Super Ultimate Time Warp", "Distorts the bounds of time and space", "gamePlay", 50),
     
     AutoClick2: new Upgrade("Super Auto-Click", "Automatically clicks every 10 seconds", "gamePlay", 100),

}
let audioUpgrades = {
     Oink1: new Upgrade("Simple Oink", "A Simple Oink", "audio", 5),
     Oink2: new Upgrade("Excited Oink", "An Excited Oink", "audio", 10),
     Oink3: new Upgrade("Haunted Oink", "A Ghostly Oink", "audio", 25),
     Moo1:  new Upgrade("Regular Oink", "An Oink...From A Pig", "audio", 100),
}

let visualUpgrades = {
     Fireworks: new Upgrade("Click Fireworks!", "Trigger Fireworks on Click", "visual", 5),
     RandomFireworks: new Upgrade("Random Fireworks!", "Triggered Randomly", "visual", 50),
     GradientBackground: new Upgrade("New Background", "Changes Background to a Rainbow", "visual", 100),
}

let skinUpgrades = {
     Default: new Upgrade("Regular Pig", "Default Pig Skin", "skin", 1),
     CoolPig: new Upgrade("Cool Pig", "A Very Cool Looking Pig", "skin", 5),
     InvisiblePig: new Upgrade("Invisible Pig", "He's Still There.  I Promise.", "skin", 10),
     Cow: new Upgrade("Spotted Pig", "He's Still A Pig.  I Promise.", "skin", 100),

}


//audioUpgrades["Oink1"].active = true 
//audioUpgrades["Oink1"].unlocked = true 

skinUpgrades["Default"].active = true 
skinUpgrades["Default"].unlocked = true 
console.log(gamePlayUpgrades)