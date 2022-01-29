const fs = require("fs");
const { join } = require("path");

module.exports = async function (routeList) {
  const apiPath = join(__dirname, "../api");
  const files = await fs.readdirSync(apiPath);
  files.forEach(async (file) => {
    const data = await fs.readFileSync(join(apiPath, file)).toString();
    routeList.push(JSON.parse(data));
  });
};
