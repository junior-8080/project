const adminService = require('../services/adminServices/dashboard')
const jwt = require('jsonwebtoken');
const dashboardService = require('../services/userServices/dashboard');
const {
    render
} = require('ejs');
const {
    delProduct
} = require('../services/adminServices/dashboard');


let products = [];
let orders = [];

function verifyToken(req, res, next) {
    // console.log('verify')
    // console.log(req.cookies);
    let cookieToken = req.cookies.admin_token;
    // const bearerHeader = req.headers['authorization'];
    // console.log(typeof(bearerHeader));
    if (!cookieToken) {
        // const bearerArray = bearerHeader.split(' ');
        // const token = bearerArray[1];
        // console.log(token)controllerRegister.verifyToken,
        return res.redirect('http://localhost:3001/api/login')

    } else {
        console.log(req.body)
        //    console.log('llll')
        req.token = cookieToken;


    }

    next()
}

function adminPage(req, res) {
    const decoded = jwt.verify(req.token, 'secretKey', (err, decoded) => {
        console.log(typeof (decoded));
        if (err) {
            console.log(err)
            return res.redirect('/api/login')
        }
        if (typeof (decoded) === "undefined") {
            return res.redirect('/api/login')
        }
        return decoded

    })

    adminService.AllProducts((err, result1) => {
        if (err) {
            return console.log(err)
        }
        // console.log(result1)
        let products = result1;
        console.log(products)
        adminService.orders((err, result) => {
            return res.render('pages/adminDashboard', {
                numberOrder: result.length,
                numberProduct: products.length,
                email: decoded.payload.email,
                products: products
            })
        })

    })
}

function adminProfile(req, res) {
    let data = req.body;
    const decoded = jwt.verify(req.token, 'secretKey', (err, decoded) => {
        console.log(typeof (decoded));
        if (err) {
            console.log(err)
            return res.redirect('/api/login')
        }
        if (typeof (decoded) === "undefined") {
            return res.redirect('/api/login')
        }
        return decoded

    })
    let id = decoded.payload.userId;
    data.userId = id;
    data.payloadEmail = decoded.payload.email;
    dashboardService.searchEdit(data, (err, result) => {
        if (err) {
            console.log(err)
            return res.redirect('http://localhost:3001/api/login')
        }
        console.log(result);
        return res.render('pages/profile', {
            users: result,
            email: decoded.payload.email,
            phonenumber: decoded.payload.phonenumber
        })

    })
}

function allProducts(req, res) {
    console.log(products)
    const decoded = jwt.verify(req.token, 'secretKey', (err, decoded) => {
        console.log(typeof (decoded));
        if (err) {
            console.log(err)
            return res.redirect('/api/login')
        }
        if (typeof (decoded) === "undefined") {
            return res.redirect('/api/login')
        }
        return decoded

    })
    adminService.AllProducts((err, result) => {
        console.log(result)
        if (err) {
            return console.log(err)
        }
        return res.render('pages/products', {
            products: result,
            email: decoded.payload.email
        })
    })

}

function aProduct(req, res) {
    let param = req.params.id;
    param = parseInt(param);
    const decoded = jwt.verify(req.token, 'secretKey', (err, decoded) => {
        console.log(typeof (decoded));
        if (err) {
            console.log(err)
            return res.redirect('/api/login')
        }
        if (typeof (decoded) === "undefined") {
            return res.redirect('/api/login')
        }
        return decoded

    })
    adminService.aProduct(param, (err, result) => {
        if (err) {
            return console.log(err)
        }

        result.product_price = result.product_price.replace('$', '');
        return res.render('pages/product', {
            email: decoded.payload.email,
            product: result
        })
    })

}

function allOrders(req, res) {

    const decoded = jwt.verify(req.token, 'secretKey', (err, decoded) => {
        console.log(typeof (decoded));
        if (err) {
            console.log(err)
            return res.redirect('/api/login')
        }
        if (typeof (decoded) === "undefined") {
            return res.redirect('/api/login')
        }
        return decoded

    })
    adminService.orders((err, result) => {
        if (err) {
            return console.log(err)
        }
        return res.render('pages/order', {
            email: decoded.payload.email,
            orders: result
        })
    })

}

function uploadProduct(req, res) {
    const decoded = jwt.verify(req.token, 'secretKey', (err, decoded) => {
        console.log(typeof (decoded));
        if (err) {
            console.log(err)
            return res.redirect('/api/login')
        }
        if (typeof (decoded) === "undefined") {
            return res.redirect('/api/login')
        }
        return decoded

    })

    return res.render('pages/post', {
        email: decoded.payload.email,
    })

}

function deleteProduct(req, res) {
    console.log('delete_data')
    let param = req.params.Id;
    const decoded = jwt.verify(req.token, 'secretKey', (err, decoded) => {
        console.log(typeof (decoded));
        if (err) {
            console.log(err)
            return res.redirect('/api/login')
        }
        if (typeof (decoded) === "undefined") {
            return res.redirect('/api/login')
        }
        return decoded

    })
    adminService.delProduct_image(param, (err, result) => {
        if (err) {
            return console.log(err)
        }
        adminService.delOrders(param, (err, result) => {
            if (err) {
                return console.log(err);
            }
            adminService.delProduct(param, (err, result) => {
                if (err) {
                    return console.log(err);
                } else {
                    console.log(result);
                    return res.json({
                        message: 'Product successfully deleted'
                    })
                }

            })
        })
    })

}

module.exports = {
    adminPage,
    adminProfile,
    verifyToken,
    allProducts,
    aProduct,
    allOrders,
    uploadProduct,
    deleteProduct
}