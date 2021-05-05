const express = require ('express');
const bodyParser= require('body-parser')
const cookieSession = require('cookie-session')
const usersRepo = require('./repositories/users')
const app= express()
const port= 3000;

//Middlewares

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
    keys:['zertgbghtbrg7e4gzt5q8v5']
}));

app.get('/signup', (req,res) =>{
    res.send(`
    <div>
        Your Id is : ${req.session.userId}
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <input name="passwordConfirmation" placeholder="password confirmation" />
            <button> Signup </button>
        </form>
    </div>
    `)
})


app.post('/signup', async (req,res) => {
    const {email,password,passwordConfirmation}= req.body;

    const existingUser= await usersRepo.getOneBy({email});
    if (existingUser){
        return res.send('Email in use')
    }

    if(password !== passwordConfirmation){
        return res.send("Passwords must match")
    }

    // create user in user repo
    const user= await usersRepo.create({email, password})

    // store the id of the user inside the users cookie
    req.session.userId = user.id // req.session is added by the cookie is userID is ca chosen name 

    console.log(req.body);
    res.send('account created !!')

})

app.get('/signout', (req, res) =>{
    req.session = null;
    res.send('your are log out')
})

app.get('/signin', (req,res) =>{
    res.send(`
    <div>
    Your Id is : ${req.session.userId}
    <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <button> Sign In </button>
    </form>
    </div>
    `)
})

app.post('/signin', async (req,res) => {
    const {email,password}= req.body;

    const user = await usersRepo.getOneBy({email});

    if(!user){
        return res.send('Email not found')
    };

    const validPassword = await usersRepo.comparePasswords(
        user.password,
        password
    );
    if (!validPassword){
        return res.send('invalid password')
    }

    req.session.userId= user.id;
    res.send('You are signed in !!')
})

app.listen(port, () =>{
    console.log(`Listening on port ...${port}`);
})
