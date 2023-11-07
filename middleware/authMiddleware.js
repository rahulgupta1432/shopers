const { sequelizeCon, QueryTypes } = require("../init/dbconfig");
let security = require("../helper/security");

function auth(permission) {
  return async (req, res, next) => {
    let token = req.session.token;
    if (typeof token != "string") {
      return res.redirect("/login?msg=NotFound404")
    }
    let decrypt = await security.decrypt(token, "<Its_?>").catch((error) => {
      return { error };
    });
    if (!decrypt || (decrypt && decrypt.error)) {
      return res.redirect("/login?msg=unauthorized")
      // return res.status(401).send({ error: decrypt.error + "||" + "Unauthorized Access" });
    }
    let Query = `select user.id,user.username,p.name as permission
    from user
    left join userpermission as up
    on user.id=up.user_id
    left join permission as p
    on up.permission_id=p.id
    where user.id='${decrypt.id}' and token='${token}'`;

    let user = await sequelizeCon
      .query(Query, { type: QueryTypes.SELECT })
      .catch((error) => {
        return { error };
      });
    if (!user || (user && user.error)) {
      return res.redirect("/login?user.error")
    }
    let permissions = {};
    for (let i of user) {
      if (i.permission) {
        permissions[i.permission] = true;
      }
    }
    if (permissions.length <= 0 || !permissions[permission]) {
      return res.redirect("/login?msg=unauthorized")
    } 
    req["userData"] = {
      username: user[0].username,
      id: user[0].id,
      permissions,
    };
    console.log(req.userData);
    next();
  };
}

module.exports = {
  auth,
};
