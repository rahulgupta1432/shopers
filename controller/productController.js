let productModel = require("../model/productModel");
let { Product } = require("../schema/productSchema");

async function addUI(req, res) {
  return res.render("product/add")
}
async function createProduct(req, res) {
  let modelData = await productModel.createPro(req.body).catch((err) => {
    return { error: err };
  });
  if (!modelData || (modelData && modelData.error)) {
    let error = modelData && modelData.error ? modelData.error : "Internal Server";
    return res.send({ error });
  }
  // return res.send({ data: modelData.data });
  return res.redirect("/product")
}

async function viewAll(req, res) {
  let products = await productModel.viewAllProduct(req.query, req.userData.permissions).catch((error) => {
    return { error }
  })
  if (!products || (products && products.error)) {
    let error = (products && products.error) ? products.error : "Internal Product Issue";
    return res.render("product/view", { error: products.error })
  }
  return res.render("product/view", { products: products.data, total: products.total, page: products.page, limit: products.limit, permissions: req.userData.permissions })
}

async function viewDetails(req, res) {
  let products = await productModel.viewOne(req.params.id).catch((error) => {
    return { error }
  })
  if (!products || (products && products.error)) {
    let error = (products && products.error) ? products.error : "Internal Issue";
    return res.render("product/view")
  }
  return res.render("product/details", { products: products.data })
}
async function updateProduct(req, res) {
  let products = await productModel.update(req.params.id, req.body).catch((err) => {
    return { error: err };
  });
  console.log(products);
  if (!products || (products && products.error)) {
    let url = (products && products.data && products.data.id) ? '/product/' + products.data.id : '/products';
    return res.redirect(url);
  }
  let url = (products && products.data && products.data.id) ? '/product/' + products.data.id : '/products';
  return res.redirect(url)
}

async function updateUI(req, res) {
  let products = await productModel.viewOne(req.params.id).catch((err) => {
    return { error: err }
  })
  if (!products || (products && products.error)) {
    let url = (products && products.data && products.data.id) ? '/products/' + products.data.id : '/products';
    return res.redirect(url)
  }
  return res.render('product/update', { products: products.data })
}

async function productDelete(req, res) {
  let products = await productModel.proDelete(req.params.id, true).catch((error) => {
    return { error }
  })
  if (!products || (products && products.error)) {
    let url = (req.params && req.params.id) ? '/product' + req.params.id : '/products';
    return res.redirect(url)
  }
  return res.redirect("/products")
}
// async function productRestore(req, res) {
//   let products = await productModel.proDelete(req.params.id).catch((error) => {
//     return { error }
//   })
//   if (!products || (products && products.error)) {
//     let url = (req.params && req.params.id) ? '/products' + req.params.id : '/products';
//     return res.redirect(url)
//   }
//   return res.redirect("/products")
// }
async function productRestore(req, res) {
  let products = await productModel.proDelete(req.params.id, false).catch((error) => {
    return { error }
  })
  console.log(products.error);
  if (!products || (products && products.error)) {
    let url = (req.params && req.params.id) ? '/products' + req.params.id : '/products';
    return res.redirect(url)
  }
  return res.redirect("/products")
}


module.exports = { createProduct, viewAll, viewDetails, updateProduct, addUI, updateUI, productDelete, productRestore };
