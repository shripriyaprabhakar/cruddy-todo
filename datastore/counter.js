const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
      //const readCounter = function (function (err, filedataNum) {
      //   var counter = fileDataNum;
      // counter++;
      // })
 
    //fs.readFile(exports.counterFile, function (err,filedata) {
    //    if (err) {
    //   callback(null, 0);
    // } else {
    //   callback(null, Number(fileData));
    // }
   // }
    fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }

  });
};

const writeCounter = (count, callback) => {
  /*const writeCounter = function (count, function(err, counterNumstring) {
      callback (null, counterNumstring)
    }) {
      var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  })
   
   }
   */
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

//exports.getNextUniqueId = () => {
  exports.getNextUniqueId = (callback) => {
    //exports.getNextUniqueId = function (callback) {
   
      //readCounter(function (err, filedataNum) {
      //   var counter = fileDataNum;
      // counter++;
      // })
       readCounter((err, fileDataNum) => {
      var counter = fileDataNum;
      counter++;
    writeCounter(counter, function(err, counterNumstring) {
      callback (null, counterNumstring)
    });
    });

  };


// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
