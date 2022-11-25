/**
 * Created by Administrator on 2017/4/24.
 */

var RangeSelector = function () {
  this._callbacks = [];
  this._rect = new Rectangle(0, 0, 0, 0);

  this._offsetX = $("#terrainSelect").width();
  this._offsetY = 36;

  this._startX = 0;
  this._startY = 0;

  let div = "<div id='border'></div>";
  let _map = $("#map");
  _map.append(div);
  $("#border").css({
    position: "absolute",
  });

  _map.mousedown(this._mouseDownHandler.bind(this));
  _map.mouseup(this._mouseUpHandler.bind(this));
};

RangeSelector.prototype = {
  constructor: RangeSelector,

  addCallback: function (callback) {
    if (this._callbacks.indexOf(callback) !== -1) return;
    this._callbacks.push(callback);
  },

  removeCallback: function (callback) {
    let index = this._callbacks.indexOf(callback);
    if (index === -1) return;
    this._callbacks.splice(index, 1);
  },

  _mouseDownHandler: function (event) {
    if (event.button === 0) {
      let _map = $("#map");
      this.startX = event.clientX - this._offsetX + _map.scrollLeft();
      this.startY = event.clientY - this._offsetY + _map.scrollTop();

      this._startX = parseInt(event.offsetX / GRID_WIDTH);
      this._startY = parseInt(event.offsetY / GRID_HEIGHT);
      this.endX = this.startX;
      this.endY = this.startY;

      $("#border").css({
        left: this.startX + "px",
        top: this.startY + "px",
        border: "1px solid  #0000ff",
        width: 0,
        height: 0,
        display: "block",
      });
      _map.mousemove(this._mouseMoveHandler.bind(this));
      this.draw();
    }
  },

  _mouseMoveHandler: function (event) {
    let _mapZone = $("#map");
    this.endX = event.clientX - this._offsetX + _mapZone.scrollLeft();
    this.endY = event.clientY - this._offsetY + _mapZone.scrollTop();
    this.draw();
  },

  _mouseUpHandler: function (event) {
    if (Mode === MapEditorMode.View) {
      let endX = parseInt(event.offsetX / GRID_WIDTH);
      let endY = parseInt(event.offsetY / GRID_HEIGHT);
      console.log("起点 X:" + this._startX + " | 起点 Y:" + this._startY);
      console.log("终点 X:" + endX + " | 终点 Y:" + endY);

      let width = endX - this._startX + 1;
      let height = endY - this._startY + 1;
      let copyTxt =
        this._startX + "\t" + this._startY + "\t" + width + "\t" + height;
      navigator.clipboard.writeText(copyTxt).then(() => {
        console.log("复制：" + copyTxt);
      });
    }
    $("#border").css({
      border: "0px solid  #0000ff",
      width: 0,
      height: 0,
      display: "none",
    });
    $("#map").unbind("mousemove");
    for (const element of this._callbacks) {
      element(this);
    }
  },

  getRect: function () {
    return this._rect;
  },

  draw: function () {
    var minX, maxX, minY, maxY;
    if (this.startX <= this.endX) {
      minX = this.startX;
      maxX = this.endX;
    } else {
      minX = this.endX;
      maxX = this.startX;
    }
    if (this.startY <= this.endY) {
      minY = this.startY;
      maxY = this.endY;
    } else {
      minY = this.endY;
      maxY = this.startY;
    }
    $("#border").css({
      left: minX + "px",
      top: minY + "px",
      width: maxX - minX + "px",
      height: maxY - minY + "px",
    });
    this._rect.x = minX;
    this._rect.y = minY;
    this._rect.width = maxX - minX;
    this._rect.height = maxY - minY;
  },
};
