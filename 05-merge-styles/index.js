const fs = require('fs');
const path = require('path');

async function addStyles(pathToStyles, destArr) {
  try {
    const fileConts = await fs.promises.readFile(pathToStyles, {encoding: 'utf8'});
    destArr.push(fileConts + '\n');
  } catch (err) {
    console.log(err);
  }
}

async function createBundle(finalPath, fileArr) {
  for (const bundlePart of fileArr) {
    try {
      await fs.promises.appendFile(finalPath, bundlePart, {encoding: 'utf8'});
    } catch (err) {
      console.log(err);
    }
  }
}

let bundleArr = [];
      
async function readStyles(pathToStyles, pathToOutput) {
  try {
    const files = await fs.promises.readdir(pathToStyles, {withFileTypes: true});
    for (const file of files) {
      const stats = await fs.promises.stat(path.join(pathToStyles, file.name));
      if (stats.isFile() && path.extname(file.name) == '.css') {
        await addStyles(path.join(pathToStyles, file.name), bundleArr);
      }
    }
    try {
      await fs.promises.unlink(pathToOutput);
    } catch (err) {
      if (err && err.code == 'ENOENT') {}
      else if (err) console.log(err);
    }
    await createBundle(pathToOutput, bundleArr);
    
  } catch (err) {
    console.log(err);
  }
}

readStyles(path.join(__dirname, 'styles'), path.join(__dirname, 'project-dist', 'bundle.css'));