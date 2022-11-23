/**
 * Created by Administrator on 2017/4/25.
 */

let MenuFile = function () {
  this._fileMenu = $("#fileMenu");
  this._itemOpen = $("#open");
  this._itemExportTerrain = $("#exportTerrain");
  this._itemExportMapZone = $("#exportMapZone");
  this._itemExportThumbnail = $("#exportThumbnail");
  this._itemExportTileData = $("#exportTileData");

  this._fileInput = document.createElement("input");
  this._fileInput.type = "file";
  this._importer = new Importer();
  this._exporter = new Exporter();

  this.addEventListeners();
};

MenuFile.prototype = {
  constructor: MenuFile,

  addEventListeners: function () {
    this._fileInput.addEventListener("change", this.loadFileHandler.bind(this));
    this._itemOpen.click(this.openFileHandler.bind(this));

    this._itemExportTerrain.click(this.exportTerrainHandler.bind(this));
    this._itemExportMapZone.click(this.exportMapZoneHandler.bind(this));
    this._itemExportThumbnail.click(this.exportThumbnailHandler.bind(this));
    this._itemExportTileData.click(this.exportTileHandler.bind(this));
  },

  loadFileHandler: function (event) {
    this._importer.importFile(this._fileInput.files[0]);
  },

  openFileHandler: function (event) {
    this._fileInput.click();
  },

  exportTerrainHandler: function (event) {
    let j;
    var swfArray = [];
    swfArray.push(MapWidth, MapHeight);
    let filename = MapName.split(".").shift();
    let key, areaGrid, terrainGrid, terrainType, areaID;
    let gv;
    for (let i = 0; i < GridVerticalNum; ++i) {
      for (j = 0; j < GridHorizontalNum; ++j) {
        key = generateGridKey(j, i);
        areaGrid = areaLayer.getGrid(j, i);
        terrainGrid = terrainLayer.getGrid(j, i);
        areaID = areaGrid ? areaGrid.area : 0;
        terrainType = terrainGrid ? terrainGrid.type : 0;
        swfArray.push(terrainType, areaID);
        gv = 1;
        if (terrainGrid != null) {
          if (terrainGrid.isSolid()) gv = 9;
          else if (terrainGrid.isSafe()) gv = 2;
          else if (terrainGrid.isExp0()) gv = 6;
          else if (terrainGrid.isExp1()) gv = 7;
          else if (terrainGrid.isExp2()) gv = 8;
          else gv = 1;
        }
        gv += 10 * areaID;
      }
    }

    if (areaPanel) {
      let nbs = areaPanel.getAllNeighbors();
      for (j = 0; j < nbs.length; ++j) {
        swfArray.push(parseInt(nbs[j].area0), parseInt(nbs[j].area1));
      }
    }

    console.log("~~~", swfArray[0], swfArray[1]);

    let buff = new ArrayBuffer(swfArray.length + 2); //2个16位 + N个 8位
    let dv = new DataView(buff);
    let offSet = 0;
    dv.setUint16(offSet, swfArray.shift());
    offSet += 2;
    dv.setUint16(offSet, swfArray.shift());
    offSet += 2;
    while (swfArray.length) {
      dv.setUint8(offSet, swfArray.shift());
      offSet++;
    }

    let inflate = new Zlib.Deflate(new Uint8Array(buff));
    let newBuff = inflate.compress();

    filename = MapName.split(".").shift();
    this._exporter.export(
      newBuff,
      filename + ".terrain",
      "application/octet-binary"
    );
  },

  initTileData: function () {
    let img = document.getElementById("mapImg");

    let zoneWidth = Math.ceil($("#mapImg").width() / MAP_TILE_WIDTH);
    let zoneHeight = Math.ceil($("#mapImg").height() / MAP_TILE_HEIGHT);
    let extensive = MapName.split(".").pop();
    let toEx = extensive === "jpg" ? "jpeg" : "png";
    let rData = [];
    let fName;
    for (let i = 0; i < zoneHeight; ++i) {
      for (let j = 0; j < zoneWidth; ++j) {
        fName = j + "_" + i + "." + extensive;
        rData.push({
          n: fName,
          x: j * MAP_TILE_WIDTH,
          y: i * MAP_TILE_HEIGHT,
          z: 0,
          w: MAP_TILE_WIDTH,
          h: MAP_TILE_HEIGHT,
        });
      }
    }

    return rData;
  },

  exportTileHandler: function (event) {
    let rData = this.initTileData();

    let data = new Laya.Byte();
    data.writeInt16(rData.length);

    let rend;
    for (const element of rData) {
      rend = element;
      data.writeUTFString(rend.n);
      data.writeInt16(rend.x);
      data.writeInt16(rend.y);
      data.writeInt16(rend.z);
      data.writeInt16(rend.w);
      data.writeInt16(rend.h);
    }
    data.endian = Laya.Byte.LITTLE_ENDIAN;
    var inflate = new Zlib.Deflate(new Uint8Array(data.buffer));
    let newBuff = inflate.compress();
    let filename = MapName.split(".").shift();
    this._exporter.export(
      newBuff,
      filename + ".ttd",
      "application/octet-binary"
    );
  },

  exportMapZoneHandler: function (event) {
    let img = document.getElementById("mapImg");
    let rData = this.initTileData();

    MAP_TILE_WIDTH = $("#tileWidth").val();
    MAP_TILE_HEIGHT = $("#tileHeight").val();

    let canvas = document.createElement("canvas");
    canvas.setAttribute("width", MAP_TILE_WIDTH.toString());
    canvas.setAttribute("height", MAP_TILE_HEIGHT.toString());
    let ctx = canvas.getContext("2d");

    let extensive = MapName.split(".").pop();
    let toEx = extensive === "jpg" ? "jpeg" : "png";

    let rend;
    for (const element of rData) {
      rend = element;
      ctx.clearRect(0, 0, MAP_TILE_WIDTH, MAP_TILE_HEIGHT);

      ctx.drawImage(img, rend.x, rend.y, rend.w, rend.h, 0, 0, rend.w, rend.h);

      let code = canvas.toDataURL("image/" + toEx);

      let parts = code.split(";base64,");
      let contentType = parts[0].split(":")[1];
      let raw = window.atob(parts[1]);
      let rawLength = raw.length;

      let uInt8Array = new Uint8Array(rawLength);

      for (let k = 0; k < rawLength; ++k) {
        uInt8Array[k] = raw.charCodeAt(k);
      }

      this._exporter.export(uInt8Array.buffer, rend.n, contentType);
    }
  },

  exportThumbnailHandler: function () {
    const img = document.getElementById("mapImg");

    let iw = $("#mapImg").width();
    let ih = $("#mapImg").height();

    let s = Math.min(630 / iw, 500 / ih);

    let cw = iw * s;
    let ch = ih * s;

    let canvas = document.createElement("canvas");
    canvas.setAttribute("width", cw);
    canvas.setAttribute("height", ch);

    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, cw, ch);

    let code = canvas.toDataURL("image/jpeg");

    let parts = code.split(";base64,");
    let contentType = parts[0].split(":")[1];
    let raw = window.atob(parts[1]);
    let rawLength = raw.length;

    let uInt8Array = new Uint8Array(rawLength);

    for (let k = 0; k < rawLength; ++k) {
      uInt8Array[k] = raw.charCodeAt(k);
    }

    this._exporter.export(
      uInt8Array.buffer,
      MapName.split(".").shift() + ".jpg",
      contentType
    );
  },
};

function mapLoaded() {
  let mapImg = $("#mapImg");

  MapWidth = mapImg.width();
  MapHeight = mapImg.height();

  console.log(
    "加载地图图片资源，map width: " + MapWidth + " height: " + MapHeight
  );

  let w = getValidWidth(MapWidth);
  let h = getValidHeight(MapHeight);

  GridHorizontalNum = w / GRID_WIDTH;
  GridVerticalNum = h / GRID_HEIGHT;

  console.log("实际地图有效宽高: " + w + " | " + h);

  if (areaLayer) {
    areaLayer.resizeCanvas(w, h);
  }
  if (terrainLayer) {
    terrainLayer.resizeCanvas(w, h);
  }
}

function saveMapTerrain(bytes) {
  let data = new Uint8Array(bytes.length);

  for (let i = 0; i < bytes.length; ++i) {
    data[i] = bytes[i];
  }
  let filename = MapName.split(".").shift();
  new Exporter().export(
    data.buffer,
    filename + ".terrain",
    "application/octet-binary"
  );
}

function openMapTerrain(bytes) {
  let mw = bytes.shift();
  let mh = bytes.shift();

  if (mw !== MapWidth || mh !== MapHeight) {
    console.log("地图和加载配置定义的图片尺寸大小不一致，请仔细检查");
  }

  let t, a, gridX, gridY, index, area, terrain;

  let len = Math.min(2 * GridHorizontalNum * GridVerticalNum, bytes.length);

  let chunk;

  for (chunk = 0; chunk < len; chunk += 2) {
    t = bytes[chunk];
    a = bytes[chunk + 1];

    index = chunk / 2;

    gridX = index % GridHorizontalNum;
    gridY = Math.floor(index / GridHorizontalNum);

    if (a > 0) {
      area = new AreaGrid(gridX, gridY, a);
      areaLayer.addGrid(area);
    }

    if ((t & (SOLID | MASK | WATER | JUMP | SAFE | EXP0 | EXP1 | EXP2)) > 0) {
      terrain = new TerrainGrid(gridX, gridY, t);
      terrainLayer.addGrid(terrain);
    }
  }

  let anps = [];

  while (chunk < bytes.length) {
    if (!areaPanel) areaPanel = new AreaConfigPanel();
    anps.push(new AreaNeighborPair(bytes[chunk++], bytes[chunk++]));
  }

  areaPanel.setAllNeighbors(anps);
}
