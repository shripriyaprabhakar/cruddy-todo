const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
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
    var data = _.map(files, (file) => {
      var id = path.basename(file, '.txt');
      var filepath = path.join(exports.dataDir, file);
      return readFilePromise(filepath).then(fileData => {
        return {
          id: id,
          text: fileData.toString()
        };
      });
    });
    Promise.all(data)
      .then(items => callback(null, items), err => callback(err));
  });
};

exports.update = (id, text, callback) => {
  let filepath = path.join(exports.dataDir, `${id}.txt`);
  if (!fs.existsSync(filepath)) {
    callback(new Error('Tried to update nonexistent message'));
  } else {
    fs.writeFile(filepath, text, err => {
      if (err) {
        callback(err);
      } else {
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
