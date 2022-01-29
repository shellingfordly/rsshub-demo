const express = require("express");
const RSSHub = require("rsshub");
const app = express();
const createRoute = require("./utils/create-route");
const colors = require("colors");

function GetData(url) {
  return new Promise((res, rej) => {
    RSSHub.init({});
    RSSHub.request(`https://rsshub.app${url}`).then(res).catch(rej);
  });
}

module.exports = async function () {
  app.use(express.static("./static"));

  const list = [];
  await createRoute(list);

  const routeList = list
    .map((v) => v.result)
    .flat()
    .map((v) => v.children)
    .flat();

  routeList.forEach((route) => {
    app.get(`/api${route.example}`, async function (req, res) {
      const data = await GetData(route.example);
      res.send(data.item);
    });
  });

  app.get("/api/alldata", (req, res) => {
    res.send(list);
  });

  app.listen(8088, () => {
    console.log("http://localhost:8088 端口启动".green);
  });
};
