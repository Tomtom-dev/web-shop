const express = require ('express');
const bodyParser= require('body-parser')
const cookieSession = require('cookie-session')
const authRouter = require('./routes/admin/auth')

const app= express()
const port= 3000;

//Middlewares

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
    keys:['zertgbghtbrg7e4gzt5q8v5']
}));
app.use(authRouter)



app.listen(port, () =>{
    console.log(`Listening on port ...${port}`);
})
