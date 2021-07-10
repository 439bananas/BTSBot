const fs = require('fs');
const path = require('path');

async function checkforconf() {
    if (fs.existsSync(path.join(__dirname, '..', 'configs', 'conf.json'))) {
        return true;
    }
    else {
        return false;
    }
}

module.exports = checkforconf;