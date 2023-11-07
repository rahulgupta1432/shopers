const { render } = require("ejs");
let authModel = require("../model/authModel");

async function createAuthUser(req, res) {
  // console.log(req.body);
  let modelData = await authModel.register(req.body).catch((err) => {
    return { error: err };
  });
  // console.log(modelData.error);
  if (!modelData || (modelData && modelData.error)) {
    let error = modelData && modelData.error ? modelData.error : "Internal Server 2";
    return res.send({ error });
  }
  return res.redirect("/?msg=success");
}

async function loginAuthUser(req, res) {
  let loginData = await authModel.login(req.body).catch((error) => {
    return { error };
  });
  if (!loginData || (loginData && loginData.error)) {
    let error = loginData && loginData.error ? loginData.error : "Internal Server Login Error";
    return res.send({ error });
  }
  req.session.token = loginData.token
  return res.redirect("/dashboard");
  // return res.send({ data: loginData.data, token: loginData.token });
}

async function registerLoginUI(req, res) {
  return res.render("reglog.ejs", {});
}
module.exports = {
  createAuthUser,
  loginAuthUser,
  registerLoginUI
};
