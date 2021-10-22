const Store = require('electron-store');
const store = new Store();

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
  const VERSION = '1.0';
  replaceText(`enrutador-version`, VERSION);

  //Pongo la URL
  let {url} = store.get('url');
  document.getElementById("url-base").value = url;

})