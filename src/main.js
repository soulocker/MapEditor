$(document).ready(function(){

    window.URL = window.URL || window.webkitURL;
    window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;

    //菜单控制
    new MenuFile();
    new MenuConfig();

    MapWidth = $("#mapImg").width();
    MapHeight = $("#mapImg").height();

    var w = getValidWidth(MapWidth);
    var h = getValidHeight(MapHeight);

    MapName = "HowtoUse.png";

    //范围选择器
    var selector = new RangeSelector();

    areaLayer = new AreaLayer("areaLayer", selector, w, h);
    terrainLayer = new TerrainLayer("terrainLayer", selector, w, h);

    areaLayer.setEnable(false);
    terrainLayer.setEnable(true);

    areaLayer.isClear = false;
    terrainLayer.isClear = false;

    $(document).keydown(function (event) {
        let gridTypeCheckboxGroup = $("#terrainSelect input[name='terrainLayer']")
        switch (event.keyCode) {
            case 18:
                areaLayer.setEnable(false);
                terrainLayer.setEnable(false);

                areaLayer.isClear = false;
                terrainLayer.isClear = true;
                break;
            case 49:
                switchCheckboxStatus(gridTypeCheckboxGroup[0], true);
                switchCheckboxStatus(gridTypeCheckboxGroup[1], false);
                break;
            case 50:
                switchCheckboxStatus(gridTypeCheckboxGroup[1], true);
                switchCheckboxStatus(gridTypeCheckboxGroup[0], false);
                break;
            default:
                break;
        }
    });

    $(document).keyup(function (event) {

        if (event.keyCode === 18) {

            areaLayer.setEnable(false);
            terrainLayer.setEnable(true);

            areaLayer.isClear = false;
            terrainLayer.isClear = false;

        }

    });

    //地表编辑设置
    $("#terrainSelect input[name='editorType']").change(function () {

        if ($(this).val() === "0") {

            areaLayer.setEnable(true);
            terrainLayer.setEnable(false);

            areaLayer.isClear = false;
            terrainLayer.isClear = false;

        } else if ($(this).val() === "1") {

            areaLayer.setEnable(false);
            terrainLayer.setEnable(true);

            areaLayer.isClear = false;
            terrainLayer.isClear = false;

        } else {

            areaLayer.setEnable(false);
            terrainLayer.setEnable(false);

            if ($(this).val() === "2") {
                areaLayer.isClear = true;
                terrainLayer.isClear = false;
            } else {
                areaLayer.isClear = false;
                terrainLayer.isClear = true;
            }
        }

    });

    var sceneXElement = $("#sceneX");
    var sceneYElement = $("#sceneY");

    $("#terrainLayer").mousemove(function(event) {

        sceneXElement.text(event.offsetX + "(" + parseInt(event.offsetX / GRID_WIDTH) + ")");
        sceneYElement.text(event.offsetY + "(" + parseInt(event.offsetY / GRID_HEIGHT) + ")");

    });

    $("#areaAlphaSet").slider({
        formatter: function(value) {

            areaLayer && areaLayer.setOpacity(value);

            return value;
        }
    });

    $("#terrainAlphaSet").slider({
        formatter: function(value) {

            terrainLayer && terrainLayer.setOpacity(value);

            return value;
        }
    });

});

/*
* 切换地块勾选状态
* @param {HTMLInputElement} checkbox
* @mode: true - 选中，false - 取消，undefined - 切换
* @return {void}
* */
function switchCheckboxStatus(checkbox, mode) {
    if ((mode === undefined && checkbox.hasAttribute("checked")) || mode === false) {
        checkbox.removeAttribute("checked");
    } else {
        let x = document.createAttribute("checked");
        checkbox.attributes.setNamedItem(x);
    }
}