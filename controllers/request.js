const productService = require('../services/userServices/product');
const jwt = require('jsonwebtoken');

function path(req, res, next) {
  jwt.verify(req.token, 'secretKey', (err, decoded) => {
    if (err) {
      console.log(err)
      return res.redirect('/')
    }
    if (typeof (decoded) === "undefined") {
      return res.redirect('/')
    }
    console.log(decoded)
    // return decoded

    let files = req.files;
    console.log(req.files)
    let arr = []
    let data = {}
    files.forEach(file => {
      if (file.path) {
        data.path = file.path.split('public')[1]
        data.name = req.body.name
        productService.savePath(data, (err, result) => {
          if (err) {
            console.log(err)
            return res.send("Internal Server Error")
          }
          console.log('add')
          console.log(result)
          arr.push(result.image_id)
          req.image = arr
        })
      } else {
        return console.log(nothing)
      }

    })
  })
  next()
}

function request(req, res, next) {
  const decoded = jwt.verify(req.token, 'secretKey', (err, decoded) => {
    if (err) {
      console.log(err)
      return res.redirect('/')
    }
    if (typeof (decoded) === "undefined") {
      return res.redirect('/')
    }
    return decoded

  })
  let data = JSON.stringify(req.body)
  let id = decoded.payload.userId;
  let dataObj = JSON.parse(data)
  dataObj.price = parseInt(dataObj.price)
  dataObj.userId = id;
  console.log(dataObj)
  // saving the data into product table.
  productService.saveRequest(dataObj, (err, result) => {
    if (err) {
      console.log(err)
      return res.send('Internal server error')
    }
    // console.log(result)
    console.log('hi current', req.image)
    req.image.forEach(image => {
      console.log('IMAE')
      console.log(image)
      let data = {
        product_id: result.product_id,
        image_id: image
      }
      console.log(data)
      productService.saveProduct_image(data, (err, result) => {
        if (err) {
          console.log('err')
        }
        // console.log(result)

      })
    })
  })
  return res.send('product uploaded')

}

module.exports = {
  path,
  request
  // uploadImage
}