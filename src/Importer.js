/**
 * @author mrdoob / http://mrdoob.com/
 */

let Importer = function () {

	let scope = this;

	this.texturePath = '';

	this.importFile = function (file) {

		let filename = file.name;
		let extension = filename.split('.').pop().toLowerCase();
		let reader = new FileReader();

		areaLayer.removeAllGrids();
    	terrainLayer.removeAllGrids();

		switch (extension) {
			case 'terrain':
				reader.addEventListener('load', function (event) {
					let buff = event.target.result;
					let inflate = new Zlib.Inflate(new Uint8Array(buff));
					let newBuff = inflate.decompress();

					buff = newBuff.buffer;
					let dv = new DataView(buff);
					let bytes = [];
					let offSet = 0;
					bytes.push(dv.getUint16(offSet));
					offSet += 2;
					bytes.push(dv.getUint16(offSet));
					offSet += 2;
					while (offSet < newBuff.length) {
						bytes.push(dv.getUint8(offSet));
						offSet ++;
					}
					window["openMapTerrain"](bytes);
				}, false);
				reader.readAsArrayBuffer(file);

				break;

			case 'jpg':
			case 'png':

				reader = new FileReader();
				reader.addEventListener('load', function (event) {

					$("#mapImg").attr("src", event.target.result);
					MapName = filename;

				}, false);
				reader.readAsDataURL(file);
				break;
			default:
				alert("编辑器只支持打开【.terrain文件】和【图片(jpg|png)文件】");
				break;
		}
	}
}