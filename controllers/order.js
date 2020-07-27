const jwt = require('jsonwebtoken')
const {
    body,
    validationResult
} = require('express-validator')

const transcationService = require('../services/userServices/transcation');
const productService = require('../services/userServices/product')
const nodemailer = require('nodemailer');
const fetch = require('node-fetch');
const adminService = require('../services/adminServices/dashboard');


function Order(req, res) {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.json({
            status: 422,
            errors: error.array(),
        })
    }
    console.log('body', req.body)
    const decoded = jwt.verify(req.token, 'secretKey', (err, decoded) => {
        if (err) {
            console.log(err);
            // return res.redirect("http://localhost:3001")
        }
        return decoded
    })
    let number = decoded.payload.phonenumber;
    let serialNumber = generateSerial();
    adminService.aProduct(req.body.id, (err, result) => {
        console.log('heyy result')
        console.log(result);
        if (err) {
            console.log(err);
        } else {
            if (result.product_ordered === '1') {
                return res.json({
                    message: "Already ordered"
                })
            } else {
                fetch(`https://apps.mnotify.net/smsapi?key=HNJBKO9txQTVO6LD4v7bhVKT8&to=0541152085&msg=Serial Number: ${serialNumber}&sender_id=PROJECT2020`)
                    .then(res => res.json())
                    .then(body => {
                        console.log(body.code);
                        if (body.code === '1000') {
                            console.log('serial sent')
                            res.json({
                                message: 'Serial sent to your via sms.Expires in 24 hours'
                            })
                            productService.createSerialNumber({
                                product_id: req.body.id,
                                serialNumber: serialNumber
                            }, (err, result) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    productService.editProducStatus({
                                        id: result.product_id
                                    }, (err, result) => {
                                        if (err) {
                                            console.log(err)
                                        }
                                    })
                                }
                            })
                        } else {
                            console.log(body)
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        }
    })

}

function generateSerial() {
    const chars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const serialLength = 10;
    let randomSerial = "";
    for (i = 0; i < serialLength; i = i + 1) {
        randomNumber = Math.floor(Math.random() * chars.length);
        randomSerial += chars.substring(randomNumber, randomNumber + 1);
    }
    return randomSerial
}

function report(req, res) {
    const error = validationResult(req);
    let data = req.body;
    console.log(data)
    if (!error.isEmpty()) {
        return res.json({
            status: 422,
            errors: error.array(),
        })
    }
    transcationService.report(data, (err, result) => {
        if (err) {
            console.log(err);
        }
        if (result) {
            return res.json({
                message: 'product reported successfully'
            })
        }
    })


}

module.exports = {
    Order,
    report
}