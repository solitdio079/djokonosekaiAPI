import "dotenv/config"
import passport from "passport"
import express from "express"
import routes from "./routes/index.js"
import "./utils/passportJwt.js"

const app = express()


app.use("/auth", routes.auth)
app.use("/posts", routes.post)
app.use(passport.authenticate('jwt',{session:false}))
app.use("/comments", routes.comment)
app.use("/users", routes.user)

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