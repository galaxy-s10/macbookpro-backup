const chokidar = require('chokidar');
const { execSync } = require('child_process');

function gitIsClean() {
  const res = execSync('git status -s').toString();
  return res.length > 0 ? false : true;
}

function main() {
  chokidar.watch(['./doc']).on('all', (eventname, path) => {
    console.log(eventname, path, gitIsClean());
    // git工作区是干净的，就不需要保存
    if (gitIsClean()) return;
    execSync(`git add .`);
    execSync(`git commit -m '${eventname}:${path}'`);
  });
}

if (!gitIsClean()) {
  console.log('注意：当前工作区不干净，已自动保存当前更改');
  execSync(`git add .`);
  execSync(`git commit -m '注意：当前工作区不干净，已自动保存当前更改'`);
  main();
} else {
  main();
}
