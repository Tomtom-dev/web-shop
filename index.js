const express = require ('express');
const bodyParser= require('body-parser')
const usersRepo = require('./repositories/users')
const app= express()
const port= 3000;

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req,res) =>{
    res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <input name="passwordConfirmation" placeholder="password confirmation" />
            <button> Signup </button>
        </form>
    </div>
    `)
})


app.post('/', async (req,res) => {
    const {email,password,passwordConfirmation}= req.body;

    const existingUser= await usersRepo.getOneBy({email});
    if (existingUser){
        return res.send('Email in use')
    }

    if(password !== passwordConfirmation){
        return res.send("Passwords must match")
    }

    console.log(req.body);
    res.send('account created !!')

})

app.listen(port, () =>{
    console.log(`Listening on port ...${port}`);
})

// Middleware function
// const bodyParser = (req, res, next) => {
//     // get access to email, password, password confirmation
//     if (req.method === 'POST'){
//         req.on('data', data =>{
//             const parsed = data.toString('utf8').split('&')
//             const formData= {};
//             for (let pair of parsed){
//                 const [key,value] = pair.split('=');
//                 formData[key]=value;
//             }
//             req.body = formData;
//             next();
//         })
//     } else {
//         next();
//     }
// }