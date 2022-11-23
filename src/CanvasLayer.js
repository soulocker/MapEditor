/**
 * Created by Administrator on 2017/6/16.
 */
let CanvasLayer = function (id, rangeSelector, w, h) {

    this._id = id;
    //canvas元素
    this._canvas = document.getElementById(id);
    //2d渲染上下文
    this._context = this._canvas.getContext("2d");
    //是否能够操作
    this._enable = false;
    //当前是否为清除操作
    this.isClear = false;
    //选择器
    this._selector = rangeSelector;

    //格子集合
    this._grids = {};

    this.resizeCanvas(w, h);

};

CanvasLayer.prototype = {

    constructor: CanvasLayer,

    getEnable: function () {
        return this._enable || this.isClear;
    },

    setEnable: function (value) {

        this._enable = value;

        let elements = $("#terrainSelect input[name='" + this._id + "']");

        if (value) {

            elements.removeAttr("disabled");
            $(this._canvas).css("z-index", 1);

        } else {

            elements.attr("disabled", "true");
            $(this._canvas).css("z-index", 0);

        }

    },

    setOpacity: function (value) {
        $(this._canvas).css("opacity", value);
    },

    resizeCanvas: function (w, h) {

        $(this._canvas).attr("width", w);
        $(this._canvas).attr("height", h);

    },

    /**
     * 添加格子
     * */
    addGrid: function (grid) {

        this._grids[grid.id] = grid;
        grid.draw(this._context);

    },

    /**
     * 删除一个格
     */
    removeGrid: function (id) {

        let grid = this._grids[id];
        if (grid == null) return;
        delete this._grids[id];
        grid.clear(this._context);
    },

    /**
     * 获得格
     * */
    getGrid: function (x, y) {

        return this._grids[generateGridKey(x, y)];

    },


    /**
     * 移除所有格子
     * */
    removeAllGrids: function () {

        let grid;
        for (let key in this._grids) {
            grid = this._grids[key];
            grid.clear(this._context);
        }
        this._grids = {};
    }

};

/**
 * 区域层
 * */
let AreaLayer = function (id, rangeSelector, w, h) {

    this._areaList = {};
    CanvasLayer.prototype.constructor.call(this, id, rangeSelector, w, h);
    rangeSelector.addCallback(this.updateArea.bind(this));

};

AreaLayer.prototype = Object.create(CanvasLayer.prototype);

Object.assign(AreaLayer.prototype, {

    constructor: AreaLayer,

    getAllAreas: function () {
        let list = [];
        for (let key in this._areaList) {
            list.push(key);
        }
        list.sort(function (a0, a1) {
            return a0 - a1;
        });
        return list;
    },

    addGrid: function (grid) {

        let oldGrid = this._grids[grid.id];
        if (oldGrid) {

            this.removeGrid(grid.id);

        }

        CanvasLayer.prototype.addGrid.call(this, grid);

        if (this._areaList.hasOwnProperty(grid.area)) ++this._areaList[grid.area]; else this._areaList[grid.area] = 1;

    },

    removeGrid: function (id) {

        let grid = this._grids[id];
        if (grid && this._areaList.hasOwnProperty(grid.area)) {


            if (--this._areaList[grid.area] === 0) {

                delete this._areaList[grid.area];

            }
        }

        CanvasLayer.prototype.removeGrid.call(this, id);

    },

    /**
     * 移除所有格子
     * */
    removeAllGrids: function () {

        CanvasLayer.prototype.removeAllGrids.call(this);

        this._areaList = {};

    },


    updateArea: function (selector) {
        if (!this.getEnable()) return;
        let rect = selector.getRect();
        let gridMinX = Math.floor(rect.x / GRID_WIDTH);
        let gridMaxX = Math.floor((rect.x + rect.width) / GRID_WIDTH);
        let gridMinY = Math.floor(rect.y / GRID_HEIGHT);
        let gridMaxY = Math.floor((rect.y + rect.height) / GRID_HEIGHT);
        let i, j;
        if (this.isClear) {
            for (i = gridMinX; i <= gridMaxX; ++i) {
                for (j = gridMinY; j <= gridMaxY; ++j) {
                    this.removeGrid(i + "_" + j);
                }
            }
        } else {
            let area = $("#areaId").val();
            if (!area) {
                alert("请输入区域id");
                return;
            }
            for (i = gridMinX; i <= gridMaxX; ++i) {
                for (j = gridMinY; j <= gridMaxY; ++j) {
                    let terrain = new AreaGrid(i, j, parseInt(area));
                    this.addGrid(terrain);
                }
            }
        }
    }
})


/**
 * 地形层
 * */
let TerrainLayer = function (id, rangeSelector, w, h) {

    CanvasLayer.prototype.constructor.call(this, id, rangeSelector, w, h);
    rangeSelector.addCallback(this.updateTerrain.bind(this));
};

TerrainLayer.prototype = Object.create(CanvasLayer.prototype);

Object.assign(TerrainLayer.prototype, {

    constructor: TerrainLayer,

    updateTerrain: function (selector) {

        if (!this.getEnable()) return;

        let rect = selector.getRect();
        let gridMinX = Math.floor(rect.x / GRID_WIDTH);
        let gridMaxX = Math.floor((rect.x + rect.width) / GRID_WIDTH);

        let gridMinY = Math.floor(rect.y / GRID_HEIGHT);
        let gridMaxY = Math.floor((rect.y + rect.height) / GRID_HEIGHT);


        let i, j;

        if (this.isClear) {

            for (i = gridMinX; i <= gridMaxX; ++i) {

                for (j = gridMinY; j <= gridMaxY; ++j) {

                    this.removeGrid(i + "_" + j);

                }

            }

        } else {

            let type = 0;

            $("#terrainSelect input[name='terrainLayer']:checked").each(function () {

                type |= parseInt($(this).val());

            });

            for (i = gridMinX; i <= gridMaxX; ++i) {

                for (j = gridMinY; j <= gridMaxY; ++j) {

                    let terrain = new TerrainGrid(i, j, type);
                    this.addGrid(terrain);

                }

            }

        }

    }
})