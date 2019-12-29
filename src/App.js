const { app, BrowserWindow, protocol, ipcMain, session, Menu } = require("electron")
const { autoUpdater } = require("electron-updater")

const manifest = require("../package.json")
const fs = require("fs")
const path = require("path")

// TODO: clear all code.
class App {
    constructor(app) {
        this.config = null;
        this.window = null;
        this.app = app;
        this.view = null;
        this.message = [];
        this.lod_Enable = false;
    }

    init() {
        this.getApp().on("window-all-closed", () => {
            if (process.platform !== 'darwin') {
                app.quit()
            }
        });
        const tmp = [
            {
                label: "settings",
                submenu: [
                    {role:'about', click: async () => {
                        const { shell } = require('electron')
                        await shell.openExternal('https://habbocity.me')
                    }},
                    // {role: 'separator'},
                    {role: 'reload'},
                    // {role: 'separator'},
                    {role: 'quit'},
                ]
            },
            {
                label: "Project",
                submenu: [
                    {label: "Github", click: async () => {
                        const { shell } = require('electron')
                        await shell.openExternal("https://github.com/Poulpinounette/hbct")
                    }},
                    {role: 'toggleDevTools'}
                ]
            }
        ]

        let m= Menu.buildFromTemplate(tmp)
        Menu.setApplicationMenu(m)
        // FLASH    
        let pluginName
        switch (process.platform) {
            case 'win32':
                pluginName = 'pepflashplayer64_32_0_0_303.dll'
                break
            case 'darwin': //TODO: support other platform.
                pluginName = 'PepperFlashPlayer.plugin'
                break
            case 'linux': 
                pluginName = 'libpepflashplayer.so'
                break
        }
        //TODO: maybe support if flash is on computer
        let p1 = app.getPath('pepperFlashSystemPlugin');

        app.commandLine.appendSwitch('ppapi-flash-path', p1)
        app.commandLine.appendSwitch('ppapi-flash-version', '32.0.0.303');

        this.getApp().on("ready", () => {
            this.createWindow()

            this.update()

            

            this.getWindow().loadFile(this.getURL("app/main.html"))

        })


        this.getApp().on('activate', () => {
            if (win === null) {
                this.createWindow()
            }
        })
    }


    createWindow() {

        this.window = new BrowserWindow({
            "height": 800,
            "width": 800,
            "webPreferences": {
                "webviewTag": true,
                "nodeIntegration": true,
                "plugins": true
            }
        })



        this.window.webContents.on('did-finish-load', () => {
            this.lod_Enable = true;
        })

        this.getWindow().on('closed', () => {
            this.window = null;
        })
    }

    update() {
        if(!this.isDev()){
            autoUpdater.checkForUpdatesAndNotify();

            setInterval(() => {
                autoUpdater.checkForUpdatesAndNotify();
            }, 10 * 60 * 1000)


        // autoUpdater.on('checking-for-update', () => {
        // })
        // autoUpdater.on('update-available', (info) => {
        // })
        // autoUpdater.on('update-not-available', (info) => {
        // })
        // autoUpdater.on('error', (err) => {
        // })
        // autoUpdater.on('download-progress', (progressObj) => {
        // })
        // autoUpdater.on('update-downloaded', (info) => {
        //   autoUpdater.quitAndInstall();  
        // })
        }
    }

    // TODO: maybe remove all function below ? 

    getURL(url) {
        return this.isDev() ? path.join("../", url) : url
    }

    readFile(p) {
        return fs.readFileSync(path.join(this.getApplicationPath(), p));
    }


    isFileExist(p) {
        let f = true;
        try {
            fs.accessSync(path.join(this.getApplicationPath(), p), fs.constants.F_OK)
        } catch (e) {
            f = false;
        }
        return f;
    }

    writeFile(p, buffer) {
        console.log("try to create...")
        fs.writeFileSync(path.join(this.getApplicationPath(), p), buffer, (err) => {
            if (err) {
                console.error("eee", err)
            }
        })
    }


    /**
     * @return app
     */
    getApp() {
        return app;
    }
    /**
     * @return BrowserWindow
     */
    getWindow() {
        return this.window
    }

    /**
     * @return webvienTag
     */
    getView() {
        return this.view;
    }

    isDev() {
        return typeof process.env["DEV"] !== "undefined" ? true : false
    }

    getApplicationPath() {
        return path.join(process.env['ProgramFiles'] || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : process.env.HOME + "/.local/share"), "\\", manifest.name, "\\")
    }

}



module.exports = App;