const express = require('express');
const dbConnect = require('./config/dbConnect');
const bodyparser = require('body-parser')
const app = express()
const dotenv = require('dotenv').config()
const authRouter = require('./routes/authRoute');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 4000;

dbConnect()
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:false}))
app.use(cookieParser())

app.use('/api/user',authRouter)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`)
  })