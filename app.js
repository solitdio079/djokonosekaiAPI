import "dotenv/config"

import express from "express"

import routes from "./routes/index.js"

const app = express()

app.use("/users", routes.user)
app.use("/posts", routes.post)
app.use("/comments", routes.comment)


app.get("/", (req,res)=> {
    return res.json({
        message: "Welcome to my world!"
    })
})

app.use((err,req,res,next) => {
    if(err) return res.status(500).json({error:err.message})
})
app.listen(process.env.PORT, () => {
    console.log("Server listening on 3000!")
})