const {exec} = require('child_process');
require('dotenv').config();

const cmd = exec(`aws s3 cp dist/docs/ s3://${process.env.DOCS_RELEASE_BUCKET}/docs/ --recursive`);
cmd.stderr.on('data', data => console.log(`> ${data}`));
