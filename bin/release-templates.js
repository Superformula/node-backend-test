const {exec} = require('child_process');
require('dotenv').config();

const cmd = exec(`aws s3 cp templates/ s3://${process.env.TEMPLATES_RELEASE_BUCKET}/ --recursive --exclude "*" --include "*.template"`);
cmd.stderr.on('data', data => console.log(`> ${data}`));
