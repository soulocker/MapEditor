const { app, Menu, BrowserWindow } = require("electron");
// include the Node.js 'path' module at the top of your file
const path = require("path");

let configFilePath = path.join("config", "config.xml");
if (app.isPackaged)
  configFilePath = path.join(process.cwd(), "/resources/config", "config.xml");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1920,
    height: 1280,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  let menuTemplate = [
    {
      label: "导入",
      submenu: [{ label: "地图图片" }, { label: "地编数据" }],
    },
    {
      label: "导出",
      submenu: [
        { label: "地编数据" },
        { label: "地图瓦片" },
        { label: "缩略地图" },
      ],
    },
    {
      label: "帮助",
      submenu: [
        {
          label: "控制台",
          click: () => {
            win.webContents.openDevTools({ mode: "right" });
          },
        },
        { label: "关于" },
      ],
    },
  ];
  let template = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(template);

  win.loadFile("index.html").then((r) => console.log(r));
};

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
