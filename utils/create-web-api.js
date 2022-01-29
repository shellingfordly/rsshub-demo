const createRoute = require("./create-route");
const routeList = [];
const fs = require("fs");

function getApiName(str) {
  return str
    .split("/")
    .filter((v) => v)
    .map((v, i) => {
      if (i === 0) {
        return v;
      } else {
        return v[0].toUpperCase() + v.slice(1);
      }
    })
    .join("");
}

module.exports = async function () {
  await createRoute(routeList);
  let apiStr = `export const API = {\n`;
  routeList
    .map((v) => v.result)
    .flat()
    .map((v) => v.children)
    .flat()
    .forEach((route) => {
      if (route.example) {
        apiStr += `\t// ${route.title}\n\t// ${
          route.paramsDesc
        }\n\tasync "${getApiName(
          route.example
        )}"() {\n\t\treturn await axios.get("/api${route.example}");\n\t},\n`;
      }
    });
  fs.writeFileSync("./static/api.js", apiStr + "}");
};
