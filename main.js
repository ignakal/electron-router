const { app, BrowserWindow, Menu, MenuItem } = require('electron')
const path = require('path')
const Store = require('electron-store');
let mainWindow;

// Inicializo Storage
Store.initRenderer();
const store = new Store({
  configName: 'user-preferences',
  defaults: {
    windowBounds: { 
      width: 800, 
      height: 700
    },
    url:{
      url: ''
    }
  }
});


//Creo las ventanas
function createWindow () {
  let { width, height} = store.get('windowBounds');
  mainWindow = new BrowserWindow({
    icon: __dirname + '/assets/img/logo.png',
    title: "Enrutador",
    width: width,
    height: height,
    autoHideMenuBar: true
  })

  mainWindow.on('resize', () => {
    let { width, height } = mainWindow.getBounds();
    store.set('windowBounds', { width, height });
  });

  mainWindow.on('close', () => {
    app.quit()
  });

  let {url} = store.get('url');

  //Si es la primera vez que entra: mostrar en index que debe ir a preferencias y poner una url base
  if(url == ''){
    mainWindow.loadFile('index.html');
  }else{
    mainWindow.loadURL(url);
  }

}

function createWindowPreferences () {
  const preferencesWindow = new BrowserWindow({
    icon: __dirname + '/assets/img/logo.png',
    title: "Preferencias",
    parent: mainWindow,
    width: 600,
    height: 400,
    // show: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  
  preferencesWindow.loadFile('preferencias.html');
}


//Inicializo el menu superior
const isMac = process.platform === 'darwin'

const template = [
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { label: 'Sobre', role: 'about' },
      { type: 'separator' },
      { label: 'Servicios', role: 'services' },
      { type: 'separator' },
      { label: 'Ocultar', role: 'hide' },
      { label: 'Ocultar otros', role: 'hideOthers' },
      { label: 'Mostrar todo', role: 'unhide' },
      { type: 'separator' },
      { label: 'Salir', role: 'quit' }
    ]
  }] : []),
  {
    label: 'Archivo',
    submenu: [
      isMac ? { label: 'Cerrar', role: 'close' } : { label: 'Cerrar', role: 'quit' } ,
      {
        label: 'Preferencias',
        accelerator: 'Alt+P',
        click: () => { 
          createWindowPreferences()
         }
      }
    ]
  },
  {
    label: 'Editar',
    submenu: [
      { label: 'Atrás', role: 'undo' },
      { label: 'Adelante', role: 'redo' },
      { type: 'separator' },
      { label: 'Cortar', role: 'cut' },
      { label: 'Copiar', role: 'copy' },
      { label: 'Pegar', role: 'paste' },
      ...([
        { label: 'Borrar', role: 'delete' },
        { type: 'separator' },
        { label: 'Seleccionar todo', role: 'selectAll' }
      ])
    ]
  },
  {
    label: 'Vista',
    submenu: [
      { label: 'Recargar', role: 'reload' },
      { label: 'Forzar recarga', role: 'forceReload' },
      { label: 'DevTools', role: 'toggleDevTools' },
      { type: 'separator' },
      { label: 'Resetear Zoom', role: 'resetZoom' },
      { label: 'Zoom +', role: 'zoomIn' },
      { label: 'Zoom -', role: 'zoomOut' },
      { type: 'separator' },
      { label: 'Pantalla completa', role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Window',
    submenu: [
      { label: 'Minimizar', role: 'minimize' },
      { label: 'Zoom', role: 'zoom' },
      ...([
        { label: 'Cerrar', role: 'close' }
      ])
    ]
  },
  {
    label: 'Ayuda', 
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://electronjs.org')
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)


//Empieza el programa
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


//Funciones desde preload.js
const ipc = require('electron').ipcMain;

ipc.on('aSynMessage', (event, args) => {
//  console.log(args);
  if(args == 'update mainWindow'){
    let {url} = store.get('url');
    if(url == ''){
      mainWindow.loadFile('index.html');
    }else{
      mainWindow.loadURL(url);
    }
  }
//  event.sender.send('asynReply','Main said: Async message received')
});
