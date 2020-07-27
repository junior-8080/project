const jwt = require('jsonwebtoken');
const {
    body,
    validationResult
} = require('express-validator');
const bcrypt = require('bcrypt')
const service = require('../services/registerLogin')
const saltBound = 10;

//middlewares : 

function verifyToken(req, res, next) {
    // console.log('verify')
    // console.log(req.cookies);
    let cookieToken = req.cookies.token;
    // const bearerHeader = req.headers['authorization'];
    // console.log(typeof(bearerHeader));
    if (!cookieToken) {
        // const bearerArray = bearerHeader.split(' ');
        // const token = bearerArray[1];
        // console.log(token)controllerRegister.verifyToken,
        return res.redirect('http://localhost:3001/')

    } else {
        console.log(req.body)
    //    console.log('llll')
       req.token = cookieToken;

            
    }

    next()
}

// SIGNUP.
function signUp(req, res) {
    let data = req.body;
    let email = req.body.email;
    let phonenumber = req.body.phonenumber

    //validate credentials.
    console.log(req.body);
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.json({
            status: 422,
            errors: error.array(),
        })
    }

    service.searchUser(email, (err, result) => {
        if (err) {
            return res.send(
                '<h1>internal server Error</h1>')
        }
        if (result) {
            if (result.user_email === email) {
                return res.json({
                    errorMessage: 'user exits',
                    param:"email"
                })
            }

        }
        service.phoneNumber(phonenumber, (err, number) => {
            if (err) {
                return res.json({
                    status: 500,
                   errorMessage: 'internal server Error'
                })
            }
            if (number) {
                if (number.phonenumber === phonenumber) {
                    return res.json({
                        errorMessage: 'number exist',
                        param:"phonenumber"
                    })
                }

            }
            if (!number) {
                return bcrypt.hash(req.body.password, saltBound, (err, hash) => {
                    req.body.password = hash;
                    //check if user doest exit

                    service.createUser(data, (err, result) => {
                        if (err) {
                            return res.json({
                                status: 500,
                                error: 'internal server error'
                            })
                        }
                        res.json({
                            status: 200,
                            url: 'http://localhost:3001/api/login',
                            message:'user created'
                        })
                    })

                })
            }


        })
        //send the data to database.

    })
}

function signIn(req, res) {
    let data = req.body;
    let email = data.email;
    let password = data.password;
    console.log(data);
    service.searchUser(email, (err, user) => {
        console.log(typeof (user) + ' ok');

        if (err) {
            console.log('error')
            return res.json({
                status: 500,
                message: 'internal server error'
            });

        } else if (typeof (user) === 'undefined') {
            console.log('user not found')

            return res.json({
                status: 403,
                errorMessage: 'user not found',
                param:'heading'

            });

        } else {
            // console.log('user found')
            let hashPassword = user.user_password;
            let payload = {
                userId: user.user_id,
                email: user.user_email,
                phonenumber:user.phonenumber,
                role:user.roles
            }

            // console.log(payload + ' payload');
            bcrypt.compare(password, hashPassword, (err, result) => {
                console.log('Am hasing');
                console.log(result)
                if (err) {
                    return res.json({
                        status: 500,
                        message: 'internal server error'
                    });
                } else if (result === false) {
                    // console.log('fasle');
                    return res.json({
                        status: 403,
                        data: null,
                        errorMessage: 'Wrong email or password',
                        param:"heading"
                    })
                } else {
                    console.log('Am sending token')
                    jwt.sign({
                        payload
                    }, 'secretKey', {
                        expiresIn: '4hr'
                    }, (err, token) => {
                        if(payload.role === 'user'){
                            return res.json({
                                status: 200,
                                access_token: token,
                                user_profile:payload
                            })
                        }
                        if(payload.role === 'admin'){
                            return res.json({
                                status: 200,
                                admin_access_token: token,
                                user_profile:payload
                            })
                        }
                        
                    })
                }
            })

        }
    })
}


//change password.
function resetPassword(req, res) {
    let data = req.body;
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.json({
            status: 422,
            errors: error.array(),
        })
    }
    service.editUser(data, (err, result) => {

        bcrypt.hash(req.body.password, saltBound, (err, hash) => {
            if (err) {
                return res.send('<h1>Internal Server Error</h1>')
            }

            req.body.password = hash;
            //check if user doest exit
            service.editUser(data, (err, result) => {
                if (err) {
                    return res.json({
                        status: 500,
                        error: 'internal server error'
                    })
                }
                return res.json({
                    status: 200,
                    message: result
                })
            })

        })
    })

}


module.exports = {
    verifyToken,
    signUp,
    signIn,
    resetPassword,
}