const env = require("./env.json")
const shell = require("child_process")



shell.exec(`env GH_TOKEN='${env["token"]}' build --win -p always`, (e, s, se) => {
    if(e) {
        console.error(e)
    }
    console.log(s)
})