/**
 * Created by Administrator on 2017/6/16.
 */
const generateGridKey = function (x, y) {

    return x + "_" + y;

};


let Grid = function (x, y) {

    this.id = generateGridKey(x, y);
    this.x = x;
    this.y = y;

};

Grid.prototype = {

    constructor: Grid,

    clear: function (context) {

        context.clearRect(this.x * GRID_WIDTH - 1, this.y * GRID_HEIGHT - 1, GRID_WIDTH + 2, GRID_HEIGHT + 2);
    },

    draw: function (context) {

        let px = this.x * GRID_WIDTH;
        let py = this.y * GRID_HEIGHT;

        let color = arguments.length > 1 ? arguments[1] : "#FCFF18";

        context.clearRect(px, py, GRID_WIDTH, GRID_HEIGHT);
        context.strokeRect(px, py, GRID_WIDTH, GRID_HEIGHT);
        context.fillStyle = color;
        context.fillRect(px, py, GRID_WIDTH, GRID_HEIGHT);

    },

};

/**
 * 区域格
 * */
let AreaGrid = function (x, y, area) {

    Grid.prototype.constructor.call(this, x, y);
    this.area = area;

};

AreaGrid.prototype = Object.create(Grid.prototype);

Object.assign(AreaGrid.prototype, {

    constructor: AreaGrid,

    draw: function (context) {

        Grid.prototype.draw.call(this, context);

        let px = this.x * GRID_WIDTH;
        let py = this.y * GRID_HEIGHT;

        context.fillStyle = "#000000";
        context.font = "8px Arial";
        context.fillText("区" + this.area, px + 3, py + 17);
    },

});


/**
 * 地形格
 * */
let TerrainGrid = function (x, y, type) {

    Grid.prototype.constructor.call(this, x, y);
    this.type = type;

};

TerrainGrid.prototype = Object.create(Grid.prototype);

Object.assign(TerrainGrid.prototype, {

    constructor: TerrainGrid,

    isSolid: function () {

        return (this.type & SOLID) > 0;

    },

    isSafe: function () {

        return (this.type & SAFE) > 0;

    },

    isExp0: function () {
        return (this.type & EXP0) > 0;
    },

    isExp1: function () {
        return (this.type & EXP1) > 0;
    },

    isExp2: function () {
        return (this.type & EXP2) > 0;
    },

    draw: function (context) {

        let color;

        if ((this.type & SOLID) > 0) {

            color = "#ff0000";

        } else if ((this.type & MASK) > 0) {

            color = "#00ff00";

        } else if ((this.type & WATER) > 0) {

            color = "#41c3ff";

        } else if ((this.type & JUMP) > 0) {

            color = "#ba55d3";

        } else if ((this.type & SAFE) > 0) {

            color = "#5CACEE";

        } else {

            color = "#ffff00";
        }

        Grid.prototype.draw.call(this, context, color);

        let px = (this.x + 0.5) * GRID_WIDTH - 10;
        let py = this.y * GRID_HEIGHT;
        context.fillStyle = "#000000";
        context.font = "10px Arial";
        let c = 0;
        let t = this.type;
        do {
            ++c;
        } while ((t = Math.floor(t / 10)) !== 0)
        let dic = {1: "🚧", 2: "👀"};
        context.fillText(dic[this.type], px + 8 - c * 2, py + 17);
    },
});
