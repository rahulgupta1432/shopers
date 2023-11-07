let express = require("express");
let session = require("express-session");
let app = express();
let config = require("config")
let port = config.get("port");
let { routes } = require("./routes");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// session
app.use(session({
  secret: "#*@123",
}));  

// for ejs
app.set("view engine", 'ejs');
// for jquery
app.use(express.static(__dirname + "/public"));
app.use(routes);
app.listen(port, () => {
  console.log("Server is running");
});
