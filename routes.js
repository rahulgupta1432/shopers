let express = require("express");
let routes = express.Router();
let user = require("./controller/userController");
let product = require("./controller/productController");
let auth = require("./controller/authController");
let authMid = require("./middleware/authMiddleware");
let dashboard = require("./controller/dashboard");


// USER CREATION
routes.get("/", auth.registerLoginUI)
routes.get("/login", auth.registerLoginUI);
routes.post("/register", auth.createAuthUser);
routes.post("/login", auth.loginAuthUser);
routes.get("/dashboard", authMid.auth("user"), dashboard.index)

// product route
routes.get("/product/create", authMid.auth("create_product"), product.addUI)
routes.post("/product/create", authMid.auth("product_create"), product.createProduct)
routes.get("/products", authMid.auth("product_view"), product.viewAll)
routes.get("/product/:id", authMid.auth("product_view"), product.viewDetails)
routes.get("/product/update/:id", authMid.auth("product_update"), product.updateUI)
routes.post("/product/:id", authMid.auth("product_update"), product.updateProduct)
routes.post("/product/delete/:id", authMid.auth("product_delete"), product.productDelete)
routes.post("/product/restore/:id", authMid.auth("product_restore"), product.productRestore)

module.exports = {
  routes
}