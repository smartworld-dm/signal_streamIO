import { app, BrowserWindow, screen, ipcMain, ipcRenderer } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as ep from 'electron-platform'
import * as Store from 'electron-store';

import * as fs from 'fs-extra';
import {platform} from 'os'

//
//
// let mainWindow = null
// let twinWindow = null

let serve;
const windows = {};


const store = new Store({
  configName: 'user-preferences',
  defaults: {
    windowBounds: {
      width: 1280,
      height: 700,
    },
    account: 'levels',
    node: 0
  }
});
const playPath = store.get('playPath') || {};
(global as any).playPath = playPath;

ipcMain.on('save-path', function(event, windowPlayPath, windowName) {
  playPath[windowName] = windowPlayPath;
  store.set('playPath', playPath);
});

ipcMain.on('click', function(){
    alert('aaaaaaaa');
});
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

// require('electron-debug')({showDevTools: serve});

const appPath = app.getPath('userData');

try {
  require('dotenv').config();
} catch {
  console.log('asar');
}

function sendPath() {

}

function createWindows() {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;
  const displays = electronScreen.getAllDisplays();
  let externalDisplay = null;

  initWindow('main');

  for (const i in displays) {
    if (displays[i].bounds.x > 0 || displays[i].bounds.y > 0) {
      externalDisplay = displays[i];
      break;
    }
  }


  if (process.platform === 'darwin') {
    if (externalDisplay) {
      initWindow('twin', {
        x: externalDisplay.bounds.x,
        y: externalDisplay.bounds.y,
        fullscreen: true
      });
    }
  }

//  if (externalDisplay) {
 /*initWindow('twin', {
      x: 0,
      y: 250,
      width:400,
      height:300,
      fullscreen: false
    });*/

 /*initWindow('third', {
      x: 0,
      y: 0,
      width:500,
      height:300,
      fullscreen: false
    });*/

//  }
}

function initWindow(name, options = {}) {

  const frame = process.platform === 'darwin' ? false : true;

  const win = new BrowserWindow({
    useContentSize: true,
    minWidth: 640,
    minHeight: 480,
    width: 960,
    height: 550,
    center: true,
    icon: path.join(__dirname, 'build', 'icons.icns'),    // fullscreen: true,
    titleBarStyle: 'hidden-inset',
    backgroundColor: '#ffffff',
    webPreferences: {
      webSecurity: false,
      backgroundThrottling: false
    },
    frame: true,
    fullscreen: false,
    ...options
  });
  (win as any).name = name;

  win.webContents.send('path', appPath);

  if (serve) {
    require('electron-reload')(__dirname, {
     electron: require(`${__dirname}/node_modules/electron`)});
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }
  //win.webContents.openDevTools({ detached: true});
  //win.webContents.openDevTools();

    console.log('LAUNCH FINISH');
  let code = `document.addEventListener("click",function(){console.log("clicked!");});`;
    win.webContents.executeJavaScript(code);



  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    windows[name] = null;
    delete windows[name];
  });



  windows[name] = win;
}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindows);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (Object.keys(windows).length === 0) {
      createWindows();
    }
  });

  // console.log(app.getPath('userData'))
  //
  // fs.read(appPath, '/tmp/file', err => {
  //   if (err) return console.error(err)
  //   console.log('success!')
  // })

} catch (e) {
  // Catch Error
  // throw e;
}
