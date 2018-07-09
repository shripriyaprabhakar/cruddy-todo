const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    /*
    counter.getNextUniqueId(function(err, id) {
     var filepath = path.join(exports.dataDir, id + '.txt');
    fs.writeFile(filepath, text, function (err) {
         if (err) {
        callback(err);
      } else {
        callback(null, {id: id, text: text});
      }

      }
    }
    */
    var filepath = path.join(exports.dataDir, id + '.txt'); // /user/nme/Desktop/hrsf99.../data/00001.txt
    fs.writeFile(filepath, text, (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null, {id: id, text: text});
      }
    });
  });
};

exports.readOne = (id, callback) => {
  var filePath = path.join(exports.dataDir, id + '.txt');
  // use fs to read the contents of a file
  fs.readFile(filePath, (err, text) => {
  // call calback with contents of file or err
    if (err) {
        callback(new Error("No item with id" + id));
  // ex: callback( <error>, <object>);
    } else {
  // callback(null, {id: id, text: item});
  callback(null, {id: id, text: text});
}
});
};
 

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error reading data folder');
    }
    // for each file
    var data = _.map(files, (file) => {
      //remove .txt attached to the file use path.basename
      var id = path.basename(file, '.txt');
      // join the file to directory path 
      var filepath = path.join(exports.dataDir, file);
          // reads the files in filepath and for each file data
      return readFilePromise(filepath).then(fileData => {
        //returns an object with id and text, filedata to string
        return {
          id: id,
          text: fileData.toString()
        };
      });
    });
    // waits till all promises are completed
    Promise.all(data)
    //then do a callback on items. items are objects that were created
    // items are objects. Promise creates an array of promises
    // each item undergoes promise from array
      .then(items => callback(null, items), err => callback(err));
  });
};

exports.update = (id, text, callback) => {
  // join the data dir with the id and text so that file name is 0001.txt
  let filepath = path.join(exports.dataDir, `${id}.txt`);
  //if that filepath doesnot exist
  if (!fs.existsSync(filepath)) {
    //throw error
    callback(new Error('Tried to update nonexistent message'));
  } else {

    fs.writeFile(filepath, text, err => {
      if (err) {
        callback(err);
      } else {
        // else do call back on the id and text - i.e, update id and text
        callback(null, { id: id, text: text });
      }
    });
  }
};

exports.delete = (id, callback) => {
  var filepath = path.join(exports.dataDir, `${counter.reformatId(id)}.txt`);
  fs.unlink(filepath, (err) => {
    callback(err);
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data'); // /user/nme/Desktop/hrsf99.../data

//__dirname returns the the directory name of the current module.
/*
Using path.join(__dirname, 'public') will create an absolute path, 
using the directory where app.js is located as the base.
 In the example above, it will resolve to /path/to/app/directory/public, 
 which will also be valid if you start your script from another working 
 directory.
*/

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
