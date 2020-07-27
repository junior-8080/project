const jwt = require('jsonwebtoken');
const dashboardService = require('../services/userServices/dashboard')
const service = require('../services/registerLogin')
const {
    body,
    validationResult
} = require('express-validator')
const bcrypt = require('bcrypt');
const saltBound = 10;


function account(req, res) {
    const decoded = jwt.verify(req.token, 'secretKey', (err, decoded) => {
        if (err) {
            console.log(err)
            return res.redirect('/');
        }
        if (typeof (decoded) === "undefined") {
            console.log('undefined decoded')
            return res.redirect('/')
        }
        return decoded
    })
    return res.render('pages/account')
}

function Profile(req, res) {
    let data = req.body
    const decoded = jwt.verify(req.token, 'secretKey', (err, decoded) => {
        console.log(typeof (decoded));
        if (err) {
            console.log(err)
            return res.redirect('/')
        }
        if (typeof (decoded) === "undefined") {
            return res.redirect('/')
        }
        return decoded

    })
    let id = decoded.payload.userId;
    data.userId = id;
    data.payloadEmail = decoded.payload.email;
    console.log(data)
    dashboardService.searchEdit(data, (err, result) => {
        
        if (err) {
            console.log(err)
            return res.redirect('http://localhost:3001')
        }
        return res.json({
            status: 200,
            message: result

        })

    })
}

function editProfile(req, res) {
    let data = req.body;
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.json({
            status: 422,
            errors: error.array(),
        })
    }
    let decoded = jwt.verify(req.token, 'secretKey', (err, decoded) => {
        if (err) {
            return res.send('<h1>Internal Server Error</h1>')
        }
        if (!decoded) {
            console.log('undefined decoded')
            return res.json({
                url:"http://localhost:3001/"
            })
        }
        return decoded

    })

    let phonenumber = data.phonenumber;
    let payloadEmail = decoded.payload.email;
    let id = decoded.payload.userId
    data.userId = id;
    dashboardService.searchEdit(data, (err, user) => {
        if (err) {
            return res.send('<h1>Internal Server Error')
        }
        if (!user) {
            service.phoneNumber(phonenumber, (err, number) => {
                if (number) {
                    if (number.phonenumber !== phonenumber) {
                        return res.json({
                            message: 'number exit'
                        })
                    } else {
                        service.editUser(data, (err, user) => {
                            if (err) {
                                return res.json({
                                    status: 500,
                                    error: 'internal server error'
                                })
                            }
                            let payload = {
                                userId: id,
                                email: data.email
                            }
                            jwt.sign({
                                payload
                            }, 'secretKey', {
                                expiresIn: '4hr'
                            }, (err, token) => {
                                return res.json({
                                    message: 'updated',
                                    token: token
                                })
                            })
                        })

                    }

                }
                if (!number) {
                    service.editUser(data, (err, user) => {
                        if (err) {
                            return res.json({
                                status: 500,
                                error: 'internal server error'
                            })
                        }
                        let payload = {
                            userId: id,
                            email: data.email
                        }
                        jwt.sign({
                            payload
                        }, 'secretKey', {
                            expiresIn: '4hr'
                        }, (err, token) => {
                            return res.json({
                                message: 'updated',
                                token: token
                            })
                        })
                    })
                }
            })

        }
        if (user) {
            if (user.user_email === payloadEmail) {
                service.phoneNumber(phonenumber, (err, number) => {
                    if (number) {
                        if (number.phonenumber === phonenumber) {
                            return res.json({
                                message: 'number exit'
                            })
                        }
                        else{
                            service.editUser(data, (err, user) => {
                                if (err) {
                                    return res.json({
                                        status: 500,
                                        error: 'internal server error'
                                    })
                                }
                                let payload = {
                                    userId: id,
                                    email: data.email
                                }
                                jwt.sign({
                                    payload
                                }, 'secretKey', {
                                    expiresIn: '4hr'
                                }, (err, token) => {
                                    return res.json({
                                        message: 'updated',
                                        token: token
                                    })
                                })
                            })
                        }

                    }
                    if (!number) {
                        service.editUser(data, (err, result) => {
                            if (err) {
                                return res.json({
                                    status: 500,
                                    error: 'internal server error'
                                })
                            }
                            let payload = {
                                userId: id,
                                email: payloadEmail
                            }
                            jwt.sign({
                                payload
                            }, 'secretKey', {
                                expiresIn: '4hr'
                            }, (err, token) => {
                                return res.json({
                                    message: 'updated',
                                    token: token
                                })
                            })
                        })
                    }
                })

            } else {
                res.json({
                    message: 'user already exit'
                })
            }
        }
    })
}

function reset(req, res) {
    let data = req.body;
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.json({
            status: 422,
            errors: error.array(),
        })
    }
    const decoded = jwt.verify(req.token, 'secretKey', (err, decoded) => {
        if (err) {
            return res.send('<h1>Internal Server Error</h1>')
        }
        if (!decoded) {
            return res.json({
                url:'http://localhost:3001/'
            })
        }
        return decoded

    })
    data.userId = decoded.payload.userId
    bcrypt.hash(req.body.password, saltBound, (err, hash) => {
        data.password = hash;
        dashboardService.reset(data, (err, result) => {
            if (err) {
                return res.send('<h1>Internal serve error')
            }
            return res.json({
                message: 'password reset'
            })
        })
    })
}

module.exports = {
    account,
    Profile,
    editProfile,
    reset
}