const fs = require("fs");

class NoteService {
  constructor(file) {
    // passing in the notes.json file when we create this class
    // notes.json is the file where the users input the notes
    this.file = file;

    // init Promise initially initialized to null
    this.initPromise = null;

    // we also call this.init() upon creating the class
    this.init();
  }

  init() {
    // if this.initPromise is null
    if (this.initPromise === null) {
      // Create a new promise -> callback ->
      this.initPromise = new Promise((resolve, reject) => {
        // returns this.notes as an object
        this.read()
          .then(() => {
            resolve();
          })
          .catch(() => {
            // if the notes.json file is empty
            // create a new object for you
            this.notes = {};
            // calls the write method
            this.write().then(resolve).catch(reject);
          });
      });
    }
    return this.initPromise;
  }

  // reads from the notes.json files
  // parses it
  // returns this.notes as a js object
  read() {
    return new Promise((resolve, reject) => {
      // reads file
      fs.readFile(this.file, "utf-8", (err, data) => {
        if (err) {
          reject(err);
        }
        try {
          // parsing the data from the file
          // this.notes would be an javascript object
          console.log("Getting the stuff from the file:", JSON.parse(data));
          this.notes = JSON.parse(data);
        } catch (e) {
          return reject(e);
        }
        // return the notes if read succesfully
        return resolve(this.notes);
      });
    });
  }

  //every time the user inputs a new note, will convert to string format and write to notes.json file.
  write() {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.file, JSON.stringify(this.notes), (err) => {
        if (err) {
          return reject(err);
        }
        resolve(this.notes);
      });
    });
  }
  //add method. the purpose of the add method is to work with a note and user
  // whatever user inputs is pushed onto the array that you can see in ther notes.json file
  add(note, user) {
    return this.init().then(() => {
      this.notes[user].push(note); // pushes onto notes.json
      return this.write(); // invokes write method.
    });
  }

  // checks to see if user and note is not empty, invoke read method.  if undefined
  // given a user, returns an array of notes that the user inputs
  // the notes are in array format, in notes.json file
  list(user) {
    if (typeof user !== "undefined") {
      return this.init() //just checks to see if it has run once.
        .then(() => {
          return this.read();
        })
        .then(() => {
          if (typeof this.notes[user] === "undefined") {
          } else {
            return this.notes[user];
          }
        });
    } else {
      return this.init().then(() => {
        return this.read();
      });
    }
  }
}

module.exports = NoteService;
