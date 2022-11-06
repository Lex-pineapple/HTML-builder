const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

async function copyDir(src, dest) {
  await fsPromises.rm(dest, {recursive: true, force: true});
  await fsPromises.mkdir(dest, {recursive:true});
  try {
    const files = await fsPromises.readdir(src, {withFileTypes: true});
    for (const file of files) {
      const srcPath = path.join(src, file.name);
      const destPath = path.join(dest, file.name);
      try {
        if (file.isDirectory()) {
          await copyDir(srcPath, destPath);
        } else {
          await fsPromises.copyFile(srcPath, destPath);
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
copyDir(path.join(__dirname, "files"), path.join(__dirname, "files-copy"));