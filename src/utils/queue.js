const CONCLIMIT = 1;

const queue = require('fastq').promise(worker, CONCLIMIT);

async function worker({ work, params }) {
  // console.log('queue called')
  try {
    return work(params);
  } catch (err) {
    // console.log('err in queue')
    throw new Error(err);
  }
}

module.exports = queue;
