const strip = require('strip-comments');
const fs = require('fs');

console.log("Stripping comments...")

fs.readFile('../src/server/pages/resources/twemoji-amazing.css', 'utf8', function(err, data) {
    if (err) throw err;
    fs.writeFile('../src/server/pages/resources/twemoji-amazing.css', strip(data), function (err) {
        if (err) return console.log(err);
    });
});

