// This repo is the source of the shared config — re-export it directly
// instead of copying, so there's no drift between the template and what's
// actually enforced here.
module.exports = require("./templates/commitlint/commitlint.config.js");
