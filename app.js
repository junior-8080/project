//declarations and importing 
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
// const flash = require('express-flash-messages')
const multer = require('multer')
const nodemailer = require('nodemailer');
const {
    check,
    body,
    validationResult
} = require('express-validator');
const PORT = process.env.PORT || 3001;
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const controllerRegister = require('./controllers/register');
const controllerProducts = require('./controllers/product');
const controllerDashboard = require('./controllers/dashboard');
const controllerRequest = require('./controllers/request');
const controllerOrder = require('./controllers/order');
const controllerAdmin = require('./controllers/adminController');
const timeDifference = require('date-timestamp-diff');

// middlewares
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(flash());

const destin = "./public/images/products"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, destin);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const uploadDisk = multer({
    storage: storage
});
// let cpUpload = uploadDisk.fields([{name:"image",count:3}])

const prouductService = require('./services/userServices/product');
const adminController = require('./controllers/adminController');
//get requests.

app.get('/', controllerProducts.fetchProducts);
app.get('/api/signup', (req, res) => {
    res.render('pages/signUp')
});
app.get('/api/login', (req, res) => {
    res.render('pages/login')
});

app.get('/admin/signup', (req, res) => {
    res.render('pages/adminSignUp')
});

app.get('/api/account', controllerRegister.verifyToken, controllerDashboard.account)
app.get('/api/profile', controllerRegister.verifyToken, controllerDashboard.Profile);
app.get('/api/homeAcc/', controllerRegister.verifyToken, controllerProducts.accProducts);
app.get('/api/product/category/:category', controllerProducts.fetchProductByCat);
app.get('/api/account/product/category/:category', controllerRegister.verifyToken, controllerProducts.fetchProductByCatAcc);
app.get('/admin', controllerAdmin.verifyToken, controllerAdmin.adminPage);
app.get('/admin/profile', controllerAdmin.verifyToken, controllerAdmin.adminProfile);
app.get('/admin/orders', controllerAdmin.verifyToken, controllerAdmin.allOrders);
app.get('/admin/products/:id', controllerAdmin.verifyToken, controllerAdmin.aProduct);
app.get('/admin/upload', controllerAdmin.verifyToken, controllerAdmin.uploadProduct)


app.post('/api/signup', [
    check('email').isEmail().withMessage('Invalid Email'),
    check('password').exists()
    .withMessage('Password should not be empty, minimum eight characters, at least one letter, one number and one special character')
    .isLength({
        min: 8
    })
    .withMessage('Password should not be empty, minimum eight characters, at least one letter, one number and one special character')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/)
    .withMessage('Password should not be empty, minimum eight characters, at least one letter, one number and one special character'),
    check('phonenumber').exists().withMessage('phonenumber should not be empty').isLength({
        min: 10,
        max: 16
    }).withMessage('password should not be empty and must start and must be 10 digits')
], body('confirmPassword').custom((value, {
    req
}) => {
    if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
    }
    // Indicates the success of this synchronous custom validator
    return true;
}), controllerRegister.signUp);

app.post('/admin/signup', [
    check('email').isEmail().withMessage('Invalid Email'),
    check('password').exists()
    .withMessage('Password should not be empty, minimum eight characters, at least one letter, one number and one special character')
    .isLength({
        min: 8
    })
    .withMessage('Password should not be empty, minimum eight characters, at least one letter, one number and one special character')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/)
    .withMessage('Password should not be empty, minimum eight characters, at least one letter, one number and one special character'),
    check('phonenumber').exists().withMessage('phonenumber should not be empty').isLength({
        min: 10,
        max: 16
    }).withMessage('password should not be empty and must start and must be 10 digits')
], body('confirmPassword').custom((value, {
    req
}) => {
    if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
    }
    // Indicates the success of this synchronous custom validator
    return true;
}), controllerRegister.signUp);

app.put('/api/resetpassword', [check('password').isLength({
    min: 1
}).withMessage('password too short')], body('confirmPassword').custom((value, {
    req
}) => {
    if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
    }
    return true;
}), controllerRegister.verifyToken, controllerDashboard.reset)

app.post('/api/signin', controllerRegister.signIn);


app.put('/api/editProfile', [
    check('email').exists().isEmail().withMessage('email should not be empty or invalid'),
    check('phonenumber').isLength({
        min: 10,
        max: 16
    }).withMessage('wrong Phone number'),
], controllerRegister.verifyToken, controllerDashboard.editProfile);

app.put('/admin/editProfile', [
    check('email').exists().isEmail().withMessage('email should not be empty or invalid'),
    check('phonenumber').isLength({
        min: 10,
        max: 16
    }).withMessage('wrong Phone number'),
], controllerAdmin.verifyToken, controllerDashboard.editProfile)

app.post('/admin/post',
 controllerAdmin.verifyToken, uploadDisk.array('image', 3), controllerRequest.path, controllerRequest.request)
app.post('/api/order', controllerRegister.verifyToken, controllerOrder.Order);

app.put('/api/resetpassword', [check('password').isLength({
    min: 1
}).withMessage('password too short')], body('confirmPassword').custom((value, {
    req
}) => {
    if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
    }
    return true;
}), controllerAdmin.verifyToken, controllerDashboard.reset);

app.delete('/admin/deleteProduct/:Id',adminController.verifyToken,adminController.deleteProduct)

setInterval(function () {
    prouductService.productInspection((err, result) => {
        if (err) {
            console.log(err);
        } else {
            result.forEach(element => {
                let yourDate = new Date(`${element.orderd_data}`)
                const timeDiff = timeDifference.convertDateToAge(yourDate, new Date());
                 console.log(timeDiff)
                if (timeDiff.day >= 1) {
                    let data = {
                        id: element.product_id,
                        key: 'e'
                    }
                    prouductService.editProducStatus(data,(err,result)=>{
                        if(err){
                            console.log(err)
                        }
                    })
                } else {
                    console.log('nothing')
                }
            });
        }
    })
}, 60 * 1000);

// launch server
app.listen(PORT, () => {
    console.log(`app started on port ${PORT}`);
})