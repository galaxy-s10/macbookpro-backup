const chokidar = require('chokidar');
const { execSync, exec } = require('child_process');

function gitIsClean() {
  const res = execSync('git status -s').toString();
  return res.length > 0 ? false : true;
}

function gitPush(commitMsg) {
  exec('git push', (error, stdout, stderr) => {
    if (error || stderr) {
      console.log(error, stderr);
      console.log(
        `${new Date().toLocaleString()}，提交信息：${commitMsg}，上传到github失败！`
      );
      return;
    }
    console.log(
      `${new Date().toLocaleString()}，提交信息：${commitMsg}，上传到github成功！`
    );
  });
}

function main() {
  chokidar.watch(['./doc']).on('all', (eventname, path) => {
    if (gitIsClean()) {
      console.log('git工作区是干净的，就不需要保存', eventname, path);
      return;
    }
    const commitMsg = eventname + ':' + path;
    execSync(`git add .`);
    execSync(`git commit -m '${commitMsg}'`);
    gitPush(commitMsg);
  });
}

if (!gitIsClean()) {
  const commitMsg = '注意：当前工作区不干净，已自动保存当前更改';
  console.log(commitMsg);
  execSync(`git add .`);
  execSync(`git commit -m ${commitMsg}`);
  gitPush(commitMsg);
  main();
} else {
  main();
}
