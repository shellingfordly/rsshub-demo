const fs = require("fs");
const { join } = require("path");

const RegMap = {
  Type: new RegExp(/\s#\s(.+)\s/g),
  Content: new RegExp(
    /\s##.+\s+###.+\s+(<Route.+>)|(<\/Route>\s+###.+\s+<Route.+>)/g
  ),
  Title: new RegExp(/\s##\s(.+)\s/g),
  ChildTitle: new RegExp(/\s###(.+)/g),
  Route: new RegExp(/(\<Route.+\>)/g),
  Example: new RegExp(/example="(\S+)"/g),
  Path: new RegExp(/path="(\S+)"/g),
  ParamsDesc: new RegExp(/paramsDesc="(.+)"/g),
};

function getParent(list, index) {
  if (index === 0) return null;
  while (!list[index] && index > 0) index--;
  return list[index];
}

module.exports = async function (file) {
  let type;
  const data = await fs
    .readFileSync(join(__dirname, `../../docs/${file}`))
    .toString();
  data.replace(RegMap.Type, (_, val) => (type = val));
  const list = data.match(RegMap.Content);
  if (!list) return;
  const result = [];
  for (let index = 0; index < list.length; index++) {
    const content = list[index];
    let title, childTitle, route, example, path, paramsDesc;
    content.replace(RegMap.Title, (_, val) => (title = val));
    content.replace(RegMap.ChildTitle, (_, val) => (childTitle = val));
    content.replace(RegMap.Route, (_, val) => (route = val));
    if (route) {
      route.replace(RegMap.Example, (_, val) => (example = val));
      route.replace(RegMap.Path, (_, val) => (path = val));
      route.replace(RegMap.ParamsDesc, (_, val) => (paramsDesc = val));
    }
    if (title) {
      result.push({
        title,
        children: [
          {
            title: childTitle,
            example,
            path,
            paramsDesc,
          },
        ],
      });
    } else {
      const parent = getParent(result, index);
      if (parent) {
        parent.children.push({
          title: childTitle,
          example,
          path,
          paramsDesc,
        });
      }
    }
  }
  fs.writeFileSync(`./api/${file}.json`, JSON.stringify({ type, result }));
};
