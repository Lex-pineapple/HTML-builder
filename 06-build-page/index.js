const fs = require('fs');
const path = require('path');


// create style bundle
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


// create html file
async function createProjectDict(dirName) {
  try {
    await fs.promises.mkdir(dirName, {recursive: true});
  } catch (err) {
    console.log(err);
  }
}

async function makeIndexFile(destName) {
  await fs.promises.copyFile(path.join(__dirname, 'template.html'), destName);
  const fileContents = await fs.promises.readFile(destName, {encoding: 'utf8'});
  const files = await fs.promises.readdir(path.join(__dirname, 'components'), {withFileTypes: true});

  let replacement = fileContents;
  for (const file of files) {
    const compFileContents = await fs.promises.readFile(path.join(__dirname, 'components', file.name), {encoding: 'utf8'});
    replacement = replacement.replace(`{{${path.basename(file.name, path.extname(file.name))}}}`, compFileContents);
  }
  await fs.promises.writeFile(destName, replacement);
}

// copy assets directory
async function copyDir(src, dest) {
  await fs.promises.rm(dest, {recursive: true, force: true});
  await fs.promises.mkdir(dest, {recursive:true});
  try {
    const files = await fs.promises.readdir(src, {withFileTypes: true});
    for (const file of files) {
      const srcPath = path.join(src, file.name);
      const destPath = path.join(dest, file.name);
      try {
        if (file.isDirectory()) {
          await copyDir(srcPath, destPath);
        } else {
          await fs.promises.copyFile(srcPath, destPath);
          console.log(file.name, "copied");
        }
      } catch {
        console.log("file could not be copied");
      }
    }
  } catch (err) {
    console.log(err);
  }
}

createProjectDict(path.join(__dirname, 'project-dist'));
makeIndexFile(path.join(__dirname, 'project-dist', 'index.html'));
readStyles(path.join(__dirname, 'styles'), path.join(__dirname, 'project-dist', 'style.css'));
copyDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));