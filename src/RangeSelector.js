/**
 * Created by Administrator on 2017/4/24.
 */
var RangeSelector = function () {

    this._callbacks = [];
    this._rect = new Rectangle(0, 0, 0, 0);

    this._offsetX = $("#terrainSelect").width();
    this._offsetY = 36;

    let div = "<div id='border'></div>";
    $("#map").append(div);
    $("#border").css({

        position: "absolute"

    });

    $("#map").mousedown(this._mouseDownHandler.bind(this));
    $("#map").mouseup(this._mouseUpHandler.bind(this));

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
            this.startX = event.clientX - this._offsetX + $("#map").scrollLeft();
            this.startY = event.clientY - this._offsetY + $("#map").scrollTop();

            this.endX = this.startX;
            this.endY = this.startY;

            $("#border").css({

                left: this.startX + "px",
                top: this.startY + "px",
                border: "1px solid  #0000ff",
                width: 0,
                height: 0,
                display: "block"

            });
            $("#map").mousemove(this._mouseMoveHandler.bind(this));
            this.draw()
        }
    },

    _mouseMoveHandler: function (event) {
        this.endX = event.clientX - this._offsetX + $("#map").scrollLeft();
        this.endY = event.clientY - this._offsetY + $("#map").scrollTop();
        this.draw();
    },

    _mouseUpHandler: function (event) {
        $("#border").css({
            border: "0px solid  #0000ff", width: 0, height: 0, display: "none"
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
            left: minX + "px", top: minY + "px", width: (maxX - minX) + "px", height: (maxY - minY) + "px"
        });
        this._rect.x = minX;
        this._rect.y = minY;
        this._rect.width = maxX - minX;
        this._rect.height = maxY - minY;
    }
}