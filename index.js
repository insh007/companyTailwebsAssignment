require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const route = require('./src/routes/routes')

const app = express()
app.use(express.json())

mongoose.connect(process.env.STRING,{
    useNewUrlParser : true
},mongoose.set('strictQuery', false))
.then(()=>console.log("MongoDB is connected"))
.catch((err)=>console.log(err.message))

app.use('/',route)

app.use('/*', function(req,res){
    res.status(400).send("provided url is wrong")
})

app.listen(process.env.PORT, () => console.log(`Express app is running on ${process.env.PORT} port`))