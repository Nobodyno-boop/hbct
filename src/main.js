const {app} = require("electron");
const cp = require("./App")

const city = new cp(app)


// init the application
city.init()