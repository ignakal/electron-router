# Electron-router

## Descripción

Aplicación Electron para iniciar una pagina web y luego poder modificar la URL desde una ventana de preferencias. La aplicación guarda el link por lo tanto cada vez que se inicia, inicia en esa URL base introducida. De ahora en adelante esta URL se denomina URL BASE

## Instalación

	git clone https://github.com/ignakal/electron-router.git
  
	npm install

## Iniciar
  
	npm start

## Modificaciones

En el archivo `main.js` la función `function createWindow ()` contiene las especificaciones de la ventana principal

**Logo**

Dentro de la funcion `createWindow` 
  
	mainWindow = new BrowserWindow({
	  icon: __dirname + '/assets/img/IMAGEN',
    ...

**Nombre de la ventana**

	mainWindow = new BrowserWindow({
	  icon: __dirname + '/assets/img/IMAGEN',
    title: "TITULO DE LA VENTANA",
    ...
_Nota:_ El nombre de la ventana va a cambiar con el según la etiqueta <title> de la URL base 
