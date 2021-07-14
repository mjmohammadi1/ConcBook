const CONCLIMIT = 1;

const queue = require('fastq').promise(worker, CONCLIMIT);

async function worker({ work, params }) {
  try {
    return work(params);
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = queue;
