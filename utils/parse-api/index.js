const fs = require("fs");
const parseFile = require("./parse-file");

module.exports = async function () {
  const files = await fs.readdirSync("./docs");
  files.forEach(parseFile);
};
