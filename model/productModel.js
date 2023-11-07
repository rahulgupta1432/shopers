let { Product } = require("../schema/productSchema");
let joi = require("joi");
async function check(data) {
  let schema = joi.object({
    name: joi.string().required(),
    price: joi.number().required(),
    desc: joi.string().required(),
  });
  let valid = await schema.validateAsync(data).catch((err) => {
    return { error: err };
  });
  if (!valid || (valid && valid.error)) {
    let msg = [];
    for (let i of valid.error.details) {
      console.log("valid.error.details");
      msg.push(i.message);
    }
    return { error: msg };
  }
  return { data: valid };
}

async function createPro(params) {
  let valid = await check(params).catch((err) => {
    return { error: err };
  });
  if (!valid || (valid && valid.error)) {
    return { error: valid.error };
  }
  let productData = {
    name: params.name,
    price: params.price,
    description: params.desc,
  };
  let data = await Product.create(productData).catch((err) => {
    // console.log("data", data1);
    return { error: err };
  });
  if (!data || (data && data.error)) {
    return { error: "Internal Server error" };
  }
  return { data: data };
}

async function viewAllProduct(params, permission) {
  let limit = (params.limit) ? parseInt(params.limit) : 10;
  let page = (params.page) ? parseInt(params.page) : 1;
  let offset = (page - 1) * limit;
  let where = {}
  if (!permission.product_delete) {
    where: { is_deleted: false }
  } else {

  }
  let counter = await Product.count({ where }).catch((error) => {
    return { error }
  })
  // console.log(counter)
  if (!counter || (counter && counter.error)) {
    return { error: "Counter error" + counter.error }
  }
  if (counter <= 0) {
    return { error: "Record not found" }
  }
  let data = await Product.findAll({ where, limit, offset, raw: true }).catch((error) => {
    return { error }
  })
  if (!data || (data && data.error)) {
    return { error: "Internal server Error" + data.error }
  }
  return { data: data, total: counter, page, limit }
}

async function viewOne(id) {
  let data = await Product.findOne({ where: { id: id } }).catch((error) => {
    return { error }
  })
  if (!data || (data && data.error)) {
    return { error: "User is not found in DB" }
  }
  return { data: data }
}

async function checkUpdate(data) {
  let schema = joi.object({
    id: joi.number().required(),
    name: joi.string(),
    price: joi.string(),
    desc: joi.string()
  })

  let valid = await schema.validateAsync(data).catch((err) => {
    return { error: err }
  })

  if (!valid || (valid && valid.error)) {
    let msg = []
    for (let i of valid.error.details) {
      msg.push(i.message)
    }
    return { error: msg }
  }
  return { data: valid }
}

async function update(id, params) {
  params.id = id;
  let valid = await checkUpdate(params).catch((err) => {
    return { error: err }
  })
  if (!valid || (valid && valid.error)) {
    return { error: valid.error }
  }

  let data = await Product.findOne({ where: { id }, raw: true }).catch((err) => {
    return { error: err }
  })
  if (!data || (data && data.error)) {
    return { error: "internal server error1" }
  }

  data.name = params.name,
    data.price = params.price,
    data.description = params.desc;

  let updateProduct = await Product.update(data, { where: { id } }).catch((err) => {
    return { error: err }
  })
  if (!updateProduct || (updateProduct && updateProduct.error)) {
    return { error: "internal server error2" }
  }
  return { data: data }
}

async function checkDelete(data) {
  let schema = joi.object({
    id: joi.number().required()
  })

  let valid = await schema.validateAsync(data).catch((err) => {
    return { error: err }
  })

  if (!valid || (valid && valid.error)) {
    let msg = []
    for (let i of valid.error.details) {
      msg.push(i.message)
    }
    return { error: msg }
  }
  return { data: valid }
}
async function proDelete(id) {
  let valid = await checkDelete({ id }).catch((error) => {
    return { error }
  })
  if (!valid || (valid && valid.error)) {
    return { error: valid.error }
  }
  let data = await Product.findOne({ where: { id } }).catch((error) => {
    return { error }
  })
  if (!data || (data && data.error)) {
    return { error: "Internal Issue" }
  }
  if (data.is_deleted == true) {
    return { error: "Product is already deleted" }
  }
  let updateProduct = await Product.update({ is_deleted: true }, { where: { id } }).catch((error) => {
    return { error }
  })
  if (!updateProduct || (updateProduct && updateProduct.error)) {
    return { error: "Internal Issue" }
  }
  if (updateProduct <= 0) {
    return { error: "Record is not deleted" }
  }
  return { data: "Record Successfuly Deleted" }
}
async function proRestore(id) {
  let data = await Product.findOne({ where: { id } }).catch((error) => {
    return { error }
  })
  if (!data || (data && data.error)) {
    return { error: "Internal Issue" }
  }
  if (data.is_deleted == false) {
    return { error: "Product is already deleted" }
  }
  let updateProduct = await Product.update({ is_deleted: false }, { where: { id } }).catch((error) => {
    return { error }
  })
  if (!updateProduct || (updateProduct && updateProduct.error)) {
    return { error: "Internal Issue" }
  }
  if (updateProduct <= 0) {
    return { error: "Record is not deleted" }
  }
  return { data: "Record Successfuly Restore" }
}
module.exports = {
  createPro,
  viewAllProduct,
  viewOne,
  update,
  proDelete,
  proRestore
};
