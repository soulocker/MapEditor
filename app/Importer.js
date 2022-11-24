const { dialog } = require("electron");

class Importer {
  constructor() {
    this._mapPicPath = null;
    this._mapTerrainPath = null;
  }

  ImportFileDialog() {
    dialog
      .showOpenDialog({
        title: "必须先导入图片再导入配置",
        buttonLabel: "导入",
        filters: [
          {
            name: "全部（jpg、jpeg、png、terrain）",
            extensions: ["jpg", "jpeg", "png", "terrain"],
          },
          {
            name: "图片（jpg、jpeg、png）",
            extensions: ["jpg", "jpeg", "png"],
          },
          {
            name: "配置（terrain）",
            extensions: ["terrain"],
          },
        ],
      })
      .then((result) => {
        this._mapPicPath = result.filePaths;
        console.log(result.canceled);
        console.log(result.filePaths);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

let ImporterHandler = new Importer()

module.exports = { ImporterHandler };
