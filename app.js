const parseApi = require("./utils/parse-api");
const colors = require("colors");
const appServer = require("./app-server");
const createWebApi = require("./utils/create-web-api");

parseApi().then(async () => {
  console.log("全部文件解析完成！".green);
  await createWebApi();
  await appServer();
});
