module.exports = () => {

  const chokidar = require('chokidar');
  const fs = require('fs')
  const nodePath = require('path');
  
  // Initialize watcher.
  const watcher = chokidar.watch('.', {
      ignored: ['main.scss', '*.txt', '*/_index.scss',/(^|[\/\\])\../],
      cwd: './src/scss',
      persistent: true,
      atomic: true // or a custom 'atomicity delay', in milliseconds (default 100)
      
  });
  
  // Something to use when events are received.
  const log = console.log.bind(console);
  
  // One-liner for current directory
  
  watcher.on('ready', () => {
      log('Initial scan complete. Ready for changes')

      if (!fs.existsSync("./src/scss")) {

          log("Error : scss folder dose not exists!!\nSolution : Create 'scss' folder under './src' .")

        // Stop watching.
        // The method is async!
        watcher.close().then(() => console.log('closed'));
    }

  })
  
  // Watch for created new Foldes
  watcher.on("addDir", (path) => {
      if (path) {
  
          // check if _index.scss exists 
          var _indexFilePath = `./src/scss/${path}/_index.scss`;
  
          if (!fileExist(_indexFilePath)) {
  
              let fileContent = "";
  
              fs.writeFile(_indexFilePath, fileContent, (err) => {
                  if (err) {
                      log('An error Occured : ', err);
                  } else {
                      log(`${path}/_index.scss generated !!`);
                  }
              })
          };
  
          // logging path
          // log(path);
      }
  })
  
  //Method to check if file exists
  
  function fileExist(pathToFile) {
      return fs.existsSync(pathToFile);
  }
  
  
  // Watch for created new files
  watcher.on("add", (path) => {
  
      // var rem = /_(.*?).scss/;
      var rem = /.scss/;
      
      var scssFileName = nodePath.basename(path).split(rem).filter(Boolean).toString();
      
      let fileContent = `@forward "${scssFileName}";\n`;
      
      let _indexFilePath = `./src/scss/${nodePath.dirname(path)}/_index.scss`;
  
      if (!scssFileName.indexOf("_") == 0) {
          log(`file ${nodePath.basename(path)} were ignored !`)
      } else {
          fs.readFile(_indexFilePath, "utf8" ,function (err, data) {
              if (err) {
                  console.log(err.message);
              }else if (data.includes(fileContent)) {
                  console.log(`File ${scssFileName} @forward already exists !!`);
              } else {
                  fs.writeFile(_indexFilePath, fileContent, { flag: 'a' }, err => {
                      if (err) {
                          log(err);
                      } else {
                          log(`File ${scssFileName} @forward added !`)
                      }
                  })
              }
              
          })
      }
  
  })
  
  // Watch for Change in files
  
  watcher.on("change", (path) => {
  
      log(`file ${nodePath.basename(path)} updated`)
  
  })
  
  // Watch for Deleting files
  
  watcher.on("unlink", (path) => {
  
      var rem = /.scss/;
      
      var scssFileName = nodePath.basename(path).split(rem).filter(Boolean).toString();
  
      let fileContent = `@forward "${scssFileName}";\n`;
  
      let _indexFilePath = `./src/scss/${nodePath.dirname(path)}/_index.scss`;
  
      if (!scssFileName.indexOf("_") == 0) {
          log(`file ${nodePath.basename(path)} were ignored !`)
      } else {
          fs.readFile(_indexFilePath, "utf8" ,function (err, data) {
              if (err) {
                  console.log(err.message);
              } else {
                  var newVal =data.replace(fileContent, '')
                  fs.writeFileSync(_indexFilePath, newVal, 'utf-8');
                  console.log(`File ${scssFileName} @forward Removed !!`);
              }
              
          })
      }
  
      // log(path);
  })
  
  
  log("SASS Architecture Manager Watching Your Files...");
  
  }