const productService = require('../services/userServices/product');
const jwt = require('jsonwebtoken');

function fetchProducts(req, res) {

  productService.fetchProducts((err, result) => {
    // console.log(result)
    result = result.reverse()
    // req.flash("Welcome to Busify");
    return res.render('pages/homepage', {
      products: result
    })

  })
}


function fetchProductByCat(req, res) {
  let data = req.params
  let category = req.params.category
  productService.fetchProductByCat(data, (err, result) => {
    result = result.reverse()
    return res.render('pages/category', {
      products: result,
      category: category,
      email: null

    })

  })

}

function fetchProductByCatAcc(req, res) {
  let data = req.params;
  let category = req.params.category

  const decoded = jwt.verify(req.token, 'secretKey', (err, decoded) => {
    if (err) {
      console.log(err);
      return res.redirect("http://localhost:3001")
    }
    return decoded

  })
  let email = decoded.payload.email;
  productService.fetchProductByCat(data, (err, result) => {
    result = result.reverse();
    return res.render('pages/category', {
      products: result,
      category: category,
      email: email
    })

  })

}

function accProducts(req, res) {
  const decoded = jwt.verify(req.token, 'secretKey', (err, decoded) => {
    if (err) {
      console.log(err)
      return res.redirect("http://localhost:3001")
    }
    return decoded
  })
  let emails = decoded.payload.email;
  productService.fetchProducts((err, result) => {
    result = result.reverse()
    res.render('pages/homeAccount', {
      products: result,
      email: emails
    })
  })
}

module.exports = {
  fetchProducts,
  accProducts,
  fetchProductByCat,
  fetchProductByCatAcc
}