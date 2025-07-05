// const jsonfile=require('jsonfile');
// const moment=require('moment');
// const simpleGit=require('simple-git');
// const randomInt = require('random-int');
// const FILE_PATH='./data.json';


// const makeCommit=n=>{
//     if(n===0) return simpleGit().push();
//     const x = randomInt(0, 54);
// const y = randomInt(0, 6);
// const DATE=moment().subtract(1,'y').add(1,'d')
// .add(x,'w').add(y,'d').format();

// const data={
//     date:DATE
// }
// console.log(DATE);

// jsonfile.writeFile(FILE_PATH,data,()=>{
// simpleGit().add([FILE_PATH]).commit(DATE,{'--date': DATE}),
// makeCommit.bind(this,--n);
// });
// }

// makeCommit(100);










const path = require('path');
const jsonfile = require('jsonfile');
const moment = require('moment');
const simpleGit = require('simple-git');

const FILE_PATH = path.resolve(__dirname, 'data.json');
const git = simpleGit();

// random integer between min and max (inclusive)
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function makeCommit(times) {
  for (let i = 0; i < times; i++) {
    const x = rand(0, 54); // weeks offset
    const y = rand(0, 6);  // day-of-week offset

    const DATE = moment()
      .subtract(1, 'y')
      .add(1, 'd')
      .add(x, 'w')
      .add(y, 'd')
      .toISOString();

    // write something so the commit isn't empty
    await jsonfile.writeFile(FILE_PATH, { i: i + 1, date: DATE }, { spaces: 2 });

    // stage and commit with both dates set (affects GitHub contribution graph)
    await git.add(FILE_PATH);
    await git.env({
      GIT_AUTHOR_DATE: DATE,
      GIT_COMMITTER_DATE: DATE
    }).commit(DATE);

    console.log(`Committed ${i + 1}/${times}: ${DATE}`);
  }

  await git.push();
  console.log('All commits pushed ✅');
}

// run it
makeCommit(100).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
