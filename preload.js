const Store = require('electron-store');
const store = new Store();
const ipc = require('electron').ipcRenderer

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  //Versiones
  const VERSION = '1.0';
  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
  replaceText(`enrutador-version`, VERSION);

  //Pongo la URL en el input
  let {url} = store.get('url');
  document.getElementById("url-base").value = url;

  //Al pulsar guardar
  document.getElementById('btn-guardar').addEventListener("click", () => {
    var url = document.getElementById("url-base").value;
    store.set('url', { url });
    document.getElementById('mensaje-guardado-correcto').style.display = "block";
    ipc.send('aSynMessage','update mainWindow');
  });
  
  //Si vuelve a editar la URL
  document.getElementById('url-base').addEventListener("input", () => {
    document.getElementById('mensaje-guardado-correcto').style.display = "none";
  });

  //Oculto el mensaje
  document.getElementById('mensaje-guardado-correcto').style.display = "none";


  
})
