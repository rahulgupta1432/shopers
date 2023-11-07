let { User } = require("../schema/userSchema");
let joi = require("joi");
async function create(params) {
  let valid = await check(params).catch((err) => {
    return { error: err };
  });
  if (!valid || (valid && valid.error)) {
    console.log(valid.error);
    return { error: valid.error };
  }
  let userData = {
    username: params.name,
    email_id: params.email,
    contact: params.phone,
    password: params.password,
  };
  let data = await User.create(userData).catch((err) => {
    console.log(data);
    return { error: err };
  });
  if (!data || (data && data.error)) {
    return { error: "Internal Server Error" };
  }
  return { data: data };
}

async function update(params, id) {
  let updateUser = await checkUp(params).catch((err) => {
    return { error: err };
  });
  if (!updateUser || (updateUser && updateUser.error)) {
    return { error: updateUser.error };
  }

  let updatedata = await User.update(params, {
    where: { id: id },
  }).catch((err) => {
    return { error: err };
  });
  if (!updatedata || (updatedata && updatedata.error)) {
    return { error: updatedata.error };
  }
  return { data: "data is updated" };
}
async function check(data) {
  let schema = joi.object({
    name: joi.string().min(4).max(14),
    email: joi.string().min(8).max(30),
    phone: joi.string(),
    password: joi.string().min(8).max(14),
  });
  let valid = await schema.validateAsync(data).catch((err) => {
    return { error: err };
  });
  if (!valid || (valid && valid.error)) {
    let msg = [];
    for (let i of valid.error.details) {
      // console.log("usermodel valid.error");
      msg.push(i.message);
    }
    return { error: msg };
  }
  return { data: valid };
}

async function checkUp(data) {
  let schema = joi.object({
    username: joi.string().required(),
    email_id: joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ["org", "com"] } }),
    contact: joi.string(),
    password: joi.string(),
  });
  let updateValid = await schema.validateAsync(data).catch((err) => {
    return { error: err };
  });
  if (!updateValid || (updateValid && updateValid.error)) {
    let msg = [];
    for (let i of updateValid.error.details) {
      console.log("updateValid.error.details", updateValid.error.details);
      msg.push(i.message);
    }
    return { error: msg };
  }
  return { data: updateValid };
}

module.exports = { create, update };
