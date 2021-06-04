const express = require('express');
const router = express.Router();
const Account = require('../models/account');
const mongoose = require('mongoose');
const account = require('../models/account');
const bcryptjs = require('bcryptjs')
const isUserAuth = require('../middleware/isUserAuth');
const { request, response } = require('express');

router.post('/register', async(request, response) => {
    const id = mongoose.Types.ObjectId();
    const fullname = request.body.fullname;
    const email = request.body.email;
    const password = request.body.password;

    Account.findOne({email: email})
    .then(async account => {
        if(account){
        console.log('This email is noy available');
        response.redirect('/')
        }else{
            //Create new account
            const hash = await bcryptjs.hash(password, 10);
            const _account = new Account({
                _id:id,
                fullname: fullname,
                email: email,
                password: hash,
            });
            _account.save()
            .then(account_created => {
                console.log(account_created);
                response.redirect('/')
            })
            .catch(error => {
                console.log(error);
                response.redirect('/')
            })
        }
    })
    .catch(error => {
        console.log(error);
        response.redirect('/')
    })
})
router.post('/login', (request, response) => {
    const email = request.body.email;
    const password = request.body.password;

    Account.findOne({email: email})
    .then(async account => {
        if(account){
            const isMatch = await bcryptjs.compare(password,account.password);
            if(isMatch){
                //SESSION
                request.session.isLoggedIn = true;
                request.session.account = account;
                request.session.save();
                response.redirect('/dashboard')

            }else{
                console.log('Password not match');
                response.redirect('/')
            }
        }else{
            console.log('Account not exist');
            response.redirect('/')
        }
        
    })
    .catch(error => {
        console.log(error);
        response.redirect('/') 
    })
})

router.get('/logout', isUserAuth, async(request, response) => {
    request.session.destroy();
    response.redirect('/');
})

module.exports = router;