const express= require('express');
const {check, validationResult}= require('express-validator');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const router= express.Router()

router.get('/signup', (req,res) =>{
    res.send(signupTemplate({req}))
})


router.post('/signup',[
    check('email')
        .trim()
        .normalizeEmail()
        .isEmail(),
    check('password')
        .trim()
        .isLength({min: 4, max : 50}),
    check('passwordConfirmation')
        .trim()
        .isLength({min: 4, max : 50})
    ], async (req,res) => {
        const errors = validationResult(req);
        console.log(errors);
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

router.get('/signout', (req, res) =>{
    req.session = null;
    res.send('your are log out')
})

router.get('/signin', (req,res) =>{
    res.send(signinTemplate({req}))
})

router.post('/signin', async (req,res) => {
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

module.exports = router;