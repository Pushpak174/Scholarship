const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const scholarshipRouter  = require('./App/routes/scholarship')
const userRouter = require('./App/routes/users');

require('dotenv').config()
const app=express()

app.use(cors())
app.use(express.json())

app.use('/website/scholarship',scholarshipRouter);
app.use('/website/user', userRouter );

mongoose.connect(process.env.DBURL)
.then(()=>{
    console.log('connected to MongoDB')
    app.listen(process.env.PORT,()=>{
        console.log('server is running')
    })
})
.catch((err)=>{
    console.log(err)
})