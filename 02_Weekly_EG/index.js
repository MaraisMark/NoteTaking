// express
const express = require("express");
const { urlencoded, json } = require("express");
const app = express();

//native
const fs = require("fs");
const path = require("path");

// third party
const basicAuth = require("express-basic-auth");
const handlebars = require("express-handlebars");

// user modules
const AuthChallenger = require("./AuthChallenger");
const config = require("./stores/config.json")["development"];
const NoteService = require("./service/NoteService");
const NoteRouter = require("./router/NoteRouter");

//
const noteService = new NoteService(path.join(__dirname, config.notes));

app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

console.log(app.get("view engine"));

app.use(express.static("public"));

app.use(json());
app.use(urlencoded({ extended: false }));

app.use(
  basicAuth({
    authorizer: AuthChallenger(
      JSON.parse(fs.readFileSync(path.join(__dirname, config.user)))
    ),
    challenge: true,
    realm: "Note Taking App",
  })
);

app.get("/", (req, res) => {
  noteService.list(req.auth.user).then((data) => {
    res.render("index", {
      user: req.auth.user,
      notes: data,
    });
  });
});

app.use("/api/notes", new NoteRouter(noteService).router());

app.listen(8080, () => {
  console.log("application is at 8080");
});
