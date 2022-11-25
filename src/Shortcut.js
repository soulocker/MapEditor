let Shortcut = function () {
  let KEY_ZOOM_IN;
  let KEY_ZOOM_OUT;
  let KEY_BRUSH1 = 49;
  let KEY_BRUSH2 = 50;
  let KEY_ERASER = 18;
};

Shortcut.prototype = {
  constructor: Shortcut,
  RegisterKeys: function () {
    $(document).keydown(function (event) {
      let gridTypeCheckboxGroup = $(
        "#terrainSelect input[name='terrainLayer']"
      );
      switch (event.keyCode) {
        case KEY_ERASER:
          areaLayer.setEnable(false);
          terrainLayer.setEnable(false);

          areaLayer.isClear = false;
          terrainLayer.isClear = true;
          break;
        case KEY_BRUSH1:
          switchCheckboxStatus(gridTypeCheckboxGroup[0], true);
          switchCheckboxStatus(gridTypeCheckboxGroup[1], false);
          break;
        case KEY_BRUSH2:
          switchCheckboxStatus(gridTypeCheckboxGroup[1], true);
          switchCheckboxStatus(gridTypeCheckboxGroup[0], false);
          break;
        default:
          break;
      }
    });
  },
};
