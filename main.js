const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;

// set environment
//process.env.NODE_ENV = 'production';

let mainWindow;
let adddWindow;

// listen for the app to be ready
app.on('ready', function () {
  //create new window
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  // load html file in window
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'mainWindow.html'),
      protocol: 'file',
      slashes: true,
    })
  );
  // Quit app when closed
  mainWindow.on('close', function () {
    app.quit();
  });

  // build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Inster the menu
  Menu.setApplicationMenu(mainMenu);
});

// Handel create add window
function createAddWindow() {
  //create new window
  adddWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add shopping list item',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  // load html file in window
  adddWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'addWindow.html'),
      protocol: 'file',
      slashes: true,
    })
  );
  // garbage collection handle
  adddWindow.on('close', function () {
    adddWindow = null;
  });
}

// Catch item add
ipcMain.on('item:add', function (e, item) {
  mainWindow.webContents.send('item:add', item);
  adddWindow.close();
});

// create menu template
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Item',
        click() {
          createAddWindow();
        },
      },
      {
        label: 'Clear Item',
        click() {
          mainWindow.webContents.send('item:clear');
        },
      },
      {
        label: 'Quit',
        accelerator: process.platfrom == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        },
      },
    ],
  },
];
// If MAC add empty Object to menu
if (process.platfrom == 'darwin') {
  mainMenuTemplate.unshift({});
}

// Add developer tool items if not production
if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: process.platfrom == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      {
        role: 'reload',
      },
    ],
  });
}
