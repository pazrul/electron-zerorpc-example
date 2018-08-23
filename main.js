const {app, BrowserWindow} = require('electron');
const zerorpc = require("zerorpc");
const ipc = require('electron').ipcMain;
const fs = require('fs');
const { spawn } = require('child_process');
const { myConsole } = require('./utils/helpers.js');

let ui;
let spawnedChild;
let zerorpcClient;

app.on('window-all-closed', () => {
    if (spawnedChild) {
        spawnedChild.stdin.pause();
        spawnedChild.kill();
    }
    app.quit();
})

app.on('ready', () => {
    spawnPythonServer();
    ui = new BrowserWindow({
        height: 1024,
        width: 1075,
        resizable: true
    });
    ui.loadURL('file://' + __dirname + '/index.html');

    ui.on('closed', () => {
        app.quit();
    });
});

function spawnPythonServer() {
    spawnedChild = spawn('python3',  ['-i', 'zerorpc-server.py']);

    spawnedChild.on('close', (code, signal) => {
        console.log(`child error: ${code}, ${signal}`);
    });
    spawnedChild.on('error', (err) => console.error(err));
    connectToZeroRPC();
}

function connectToZeroRPC() {
    zerorpcClient = new zerorpc.Client();
    zerorpcClient.connect('tcp://127.0.0.1:4242');

    ipc.on('hello', () => {
        zerorpcClient.invoke('hello', 'RPC', (error, res, more) => {
            ui.webContents.send('hello-response', res);
            // myConsole.log(res);
        });
    });

    ipc.on('array', () => {
        zerorpcClient.invoke('get_array', (error, res, more) => {
            ui.webContents.send('array-response', res);
        });
    });

    ipc.on('object', () => {
        zerorpcClient.invoke('get_object', (error, res, more) => {
            ui.webContents.send('object-response', res);
        });
    });

    ipc.on('type', (event, val) => {
        zerorpcClient.invoke('determine_type', val, (error, res, more) => {
            ui.webContents.send('type-response', res);
        });
    });
}
