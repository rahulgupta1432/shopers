let userModel = require("../model/userModel");
async function createUser(req, res) {
  let modelData = await userModel.create(req.body).catch((err) => {
    return { error: err };
  });
  if (!modelData || (modelData && modelData.error)) {
    let error =
      modelData && modelData.error ? modelData.error : "Internal Server";
    console.log(modelData.error);
    return res.send({ error });
  }
  return res.send({ data: modelData.data });
}

async function updateUser(req, res) {
  let upModelData = await userModel
    .update(req.body, req.params.id)
    .catch((err) => {
      return { error: err };
    });
  if (!upModelData || (upModelData && upModelData.error)) {
    console.log("error", upModelData.error);
    let error2 =
      upModelData && upModelData.error
        ? upModelData.error
        : "Internal Server Update";
    return res.send({ error2 });
  }
  return res.send({ data: upModelData.data });
}
module.exports = {
  createUser,
  updateUser,
};
