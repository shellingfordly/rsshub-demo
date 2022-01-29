const axios = require("axios");
const fs = require("fs");

axios(
  "http://www.uimaker.com/uimakerhtml/uidesign/icontubiao/2019/1217/135414.html"
).then((res) => {
  const imgLish = [];
  res.data.replace(/\<img\ssrc="   (\S+)"/g, (_, val) => {
    imgLish.push(val);
  });
  console.log(imgLish);
  imgLish.forEach((url, index) => {
    axios
      .request({
        url,
        method: "GET",
        responseType: "arraybuffer",
      })
      .then((res) => {
        console.log(res.data);
        fs.writeFileSync(`./icons/icon${index}.png`, res.data);
      });
  });
});
