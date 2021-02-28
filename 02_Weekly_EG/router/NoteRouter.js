const express = require("express");

class NoteRouter {
  constructor(noteService) {
    this.noteService = noteService;
  }

  router() {
    let router = express.Router();
    router.get("/", this.get.bind(this));
    router.post("/", this.post.bind(this));
    return router;
  }

  get(req, res) {
    console.log("GET");
    return this.noteService
      .list(req.auth.user)
      .then((notes) => {
        res.json(notes);
      })
      .catch((err) => res.status(500).json(err));
  }

  post(req, res) {
    console.log("POST");
    return this.noteService
      .add(req.body.note, req.auth.user)
      .then(() => {
        return this.noteService.list(req.auth.user);
      })
      .then((notes) => {
        res.json(notes);
      })
      .catch((err) => res.status(500).json(err));
  }
}

module.exports = NoteRouter;
