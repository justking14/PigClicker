(function () {

  const overworld = new newOverworld({
    element: document.querySelector(".game-container")
  });
  window.overworld = overworld;
  overworld.init();
})();