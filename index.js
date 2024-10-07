const express = require("express")
const mongoose = require("mongoose")
const config = require("config")
const fileUpload = require("express-fileupload")
const authRouter = require("./routes/auth.routes")
const fileRouter = require("./routes/file.routes")
const userRouter = require("./routes/user.routes")
const app = express()
const PORT = process.env.PORT || config.get("serverPort");
const corsMiddleware = require('./middleware/cors.middleware')
const filePathMiddleware = require('./middleware/filepath.middleware')
const staticPathMiddleware = require('./middleware/staticpath.middleware')
const path = require('path')

app.use(fileUpload({}))
app.use(corsMiddleware)
app.use(filePathMiddleware(path.resolve(__dirname, "files")))
app.use(staticPathMiddleware("files/static"))
app.use(express.json())
app.use(express.static('files/static'))
app.use("/api/auth", authRouter)
app.use("/api/files", fileRouter)
app.use("/api/admin", userRouter)


const start = async () => {
    try {
        await mongoose.connect(process.env.dbUrl || config.get("dbUrl"), {
            useNewUrlParser:true,
            useUnifiedTopology:true
        })

        app.listen(PORT, () => {
            console.log('Server started on port ', PORT)
        })
    } catch (e) {
        console.log(e)
    }
}

start()
