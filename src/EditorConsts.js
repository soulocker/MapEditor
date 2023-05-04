/**
 * Created by Administrator on 2017/4/24.
 */
if (!Object.assign) {
    // 定义assign方法
    Object.defineProperty(Object, "assign", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (target) {
            // assign方法的第一个参数
            "use strict";
            // 第一个参数为空，则抛错
            if (target === undefined || target === null) {
                throw new TypeError("Cannot convert first argument to object");
            }
            let to = Object(target);
            // 遍历剩余所有参数
            for (let i = 1; i < arguments.length; i++) {
                let nextSource = arguments[i];
                // 参数为空，则跳过，继续下一个
                if (nextSource === undefined || nextSource === null) {
                    continue;
                }
                nextSource = Object(nextSource);
                // 获取改参数的所有key值，并遍历
                let keysArray = Object.keys(nextSource);
                for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    let nextKey = keysArray[nextIndex];
                    let desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    // 如果不为空且可枚举，则直接浅拷贝赋值
                    if (desc !== undefined && desc.enumerable) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
            return to;
        }
    });
}
var MapEditorMode = { Edit: 0, View: 1 };
// ----------------------------------------------------------------
// 通过网页设置获取格子宽高并且监听实时改变
// ----------------------------------------------------------------
let gridWidthValueControl = document.getElementById("gridWidth");
let gridHeightValueControl = document.getElementById("gridHeight");
gridWidthValueControl.addEventListener("change", function (e) {
    GRID_WIDTH = e.target.value;
});
gridHeightValueControl.addEventListener("change", function (e) {
    GRID_HEIGHT = e.target.value;
});

//格子宽度
var GRID_WIDTH = parseInt(gridWidthValueControl.value);
//格子高度
var GRID_HEIGHT = parseInt(gridHeightValueControl.value);

var MAP_TILE_WIDTH = $("#tileWidth").val();
var MAP_TILE_HEIGHT = $("#tileHeight").val();

//障碍点
const SOLID = 1;
//遮罩
const MASK = 2;
//水路
const WATER = 4;
//跳点
const JUMP = 8;
//安全区
const SAFE = 16;

//经验区
const EXP0 = 32;

const EXP1 = 64;

const EXP2 = 128;

// 编辑器模式
var Mode = MapEditorMode.Edit;
//区域的canvas层
var areaLayer;
//地形的canvas层
var terrainLayer;

var areaPanel;

var GridHorizontalNum, GridVerticalNum;

var MapWidth, MapHeight;

var MapName;

function getValidWidth(width) {
    return Math.ceil(width / GRID_WIDTH) * GRID_WIDTH;
}

function getValidHeight(height) {
    return Math.ceil(height / GRID_HEIGHT) * GRID_HEIGHT;
}

ViewportScale = 1;
