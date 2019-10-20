const {exec} = require('child_process');
require('dotenv').config();

const cmd = exec(`aws s3 cp dist/ s3://${process.env.LAMBDAS_RELEASE_BUCKET}/ --recursive --exclude "*" --include "*.zip"`);
cmd.stderr.on('data', data => console.log(`> ${data}`));
