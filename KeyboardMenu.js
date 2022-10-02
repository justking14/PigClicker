class KeyboardMenu{
     constructor(config = {}) {
          this.options = [];
          this.up = null; this.down = null;
          this.prevFocus = null;
          this.descriptionContainer = config.descriptionContainer || null
          this.lastPick = null;
     }

     setOptions(options) {
          this.options = options
          console.log(options)
          this.element.innerHTML = this.options.map((option, index) => {
               const disabledAttribute = "" //option.disabled ? "disabled" : ""
               return (`
                    <div class="option">
                    <button ${disabledAttribute}  data-button="${index}" data-description="${option.description}">
                    ${option.label}</button>
                    <span class="right">${option.right ? option.right() : ""}</span>
               `)
               
          }).join("")
                    
          this.element.classList.add("noselect")

          let pickedButton = null
          this.element.querySelectorAll("button").forEach(button => {
               //console.log(button, pickedButton, this.lastPick, button.getAttribute("data-description"))
               
               button.addEventListener("click", () => {
                    const chosenOption = this.options[Number(button.dataset.button)]
                    chosenOption.handler()
               })
               button.addEventListener("mouseenter", () => {
                    this.lastPick = button.getAttribute("data-description")
                    button.focus();
               })
               button.addEventListener("mouseover", () => {
                    this.lastPick = button.getAttribute("data-description")
                    button.focus();
               })
               button.addEventListener("focus", () => {
                    this.prevFocus = button
                    this.descriptionElementText.innerText = button.dataset.description
               })

               if (this.lastPick && this.lastPick === button.getAttribute("data-description")) {
                    pickedButton = button
               } 
       
          })

          setTimeout(() => {
               if (pickedButton) {
                    pickedButton.focus()
               } else {
                    this.element.querySelector("button[data-button]:not([disabled])").focus()
               }
          }, 10)
     }
     createElement() {
          this.element = document.createElement("div")
          this.element.classList.add("KeyboardMenu")

          //description box element
          this.descriptionElement = document.createElement("div")
          this.descriptionElement.classList.add("DescriptionBox")
          this.descriptionElement.classList.add("noselect")
          this.descriptionElement.innerHTML = (`<p>Info </p>`)
          this.descriptionElementText = this.descriptionElement.querySelector("p")//saves a reference so it can be changed later

     }
     end() {
          this.element.remove()
          this.descriptionElement.remove()
          //clean up bindings
          this.up.unbind()
          this.down.unbind()
     }

     init(container) {
          this.createElement();
          (this.descriptionContainer || container).appendChild(this.descriptionElement)
          container.appendChild(this.element)

          this.up = new KeyPressListener("ArrowUp", () => {
               const current = Number(this.prevFocus.getAttribute("data-button"))
               const nextButton = Array.from(this.element.querySelectorAll("button[data-button]")).reverse().find(el => {
                    return el.dataset.button < current && !el.disabled
               })
               nextButton?.focus()
               if (nextButton) {
                    this.lastPick = nextButton["data-description"]
               }
          })

          this.down = new KeyPressListener("ArrowDown", () => {
               const current = Number(this.prevFocus.getAttribute("data-button"))
               const nextButton = Array.from(this.element.querySelectorAll("button[data-button]")).find(el => {
                    return el.dataset.button > current && !el.disabled
               })
               nextButton?.focus()
               if (nextButton) {
                    this.lastPick = nextButton["data-description"]
               }
          })
     }
}