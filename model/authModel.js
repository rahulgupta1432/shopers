let { User } = require("../schema/userSchema");
let { UserPermission } = require("../schema/userPermission");
let { sequelizeCon, Model, DataTypes } = require("../init/dbconfig");
let joi = require("joi");
let bcrypt = require("bcrypt");
let security = require("../helper/security");
async function check(data) {
  let schema = joi.object({
    name: joi.string().required(),
    password: joi.string().required(),
    email: joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "org"] } })
      .required(),
    phone: joi.string().required(),
  });
  let valid = await schema
    .validateAsync(data, { abortEarly: false })
    .catch((err) => {
      return { error: err };
    });
  if (!valid || (valid && valid.error)) {
    let msg = [];
    for (let i of valid.error.details) {
      msg.push(i.message);
    }
    return { error: msg };
  }
  return { data: valid };
}

async function register(params) {
  let valid = await check(params).catch((error) => {
    return { error };
  });
  if (!valid || (valid && valid.error)) {
    return { error: valid.error };
  }
  let findUser = await User.findOne({
    where: { email_id: params.email },
  }).catch((error) => {
    return { error };
  });
  if (findUser || (findUser && findUser.error)) {
    return { error: "User already exist" };
  }
  let hash_pwd = await security.hash(params.password).catch((error) => {
    return { error };
  });
  // console.log(hash_pwd);
  if (!hash_pwd || (hash_pwd && hash_pwd.error)) {
    return { error: "Internal Server error hash" };
  }
  let userData = {
    username: params.name,
    password: hash_pwd.data,
    email_id: params.email,
    contact: params.phone,
  };
  let data = await User.create(userData).catch((error) => {
    return { error };
  });

  if (!data || (data && data.error)) {
    console.log(data.error);
    return { error: "Internal Server 1" };
  }
  let userPermission = {
    user_id: data.id,
    permission_id: 1
  };
  let upData = await UserPermission.create(userPermission).catch((error) => {
    return { error };
  });
  if (!upData || (upData && upData.error)) {
    return { error: upData.error };
  }
  return { data: data };
}

async function loginDataValid(params) {
  let schema = joi.object({
    email: joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "org"] } })
      .required(),
    password: joi.string().required(),
  });
  let valid = await schema.validateAsync(params).catch((error) => {
    return { error };
  });
  if (!valid || valid.error) {
    let msg = [];
    for (let i of valid.error.details) {
      msg.push(i.message);
    }
    return { error: msg };
  }
  return { data: valid };
}

async function login(params) {
  let valid = await loginDataValid(params).catch((error) => {
    return { error };
  });
  if (!valid || valid.error) {
    return { error: valid.error };
  }
  let findUser = await User.findOne({
    where: { email_id: params.email },
  }).catch((error) => {
    return { error };
  });
  // console.log(findUser);
  if (!findUser || (findUser && findUser.error)) {
    return { error: "user is not found" };
  }
  let com_pwd = await security
    .compare(params.password, findUser.password)
    .catch((error) => {
      return { error };
    });
  // console.log("compare", com_pwd);
  if (!com_pwd || (com_pwd && com_pwd.error)) {
    return { error: "User password is not found" };
  }

  let usertoken = await security
    .encrypt({ id: findUser.id }, "<Its_?>")
    .catch((error) => {
      return { error };
    });
  if (!usertoken || (usertoken && usertoken.error)) {
    return { error: usertoken.error };
  }
  // console.log(usertoken);
  let updateData = await User.update(
    { token: usertoken },
    {
      where: { id: findUser.id },
    }
  ).catch((err) => {
    return { error: err };
  });

  if (!updateData || (updateData && updateData.error)) {
    return { error: updateData.error };
  }
  // return { data: usertoken };
  return { data: "Login Successfully", token: usertoken };
  // return { data: { usertoken: updateData } };
}

module.exports = {
  register,
  login,
};
