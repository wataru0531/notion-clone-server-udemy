const express = require("express");
const mongoose = require("mongoose");      // mongoose ... mongoDBと接続を行うためのパッケージ
const cors = require("cors");  // クロスエラーを解消 https://www.npmjs.com/package/cors

const app = express();
const PORT = 5050;
const dotenv = require("dotenv").config(); // dotenvを呼び出す

// クロスエラーを解消
app.use(cors({
  origin: "http://localhost:3001", // このURLは許可する

}))

// 必須。jsonオブジェクトとして認識できるようになる
app.use(express.json());

// エンドポイントを用意 routesの中のurlを呼び出すためには、例えば"/api/v1"と付ける
// http://localhost:8080/api/v1/ ここからrequire("")のファイル
app.use("/api/v1", require("./src/v1/routes"));


// mongoDBへの接続
try {
  mongoose.connect(process.env.MONGODB_URL);
  console.log("DBと接続中");

} catch (error) {
  console.log(error);
}


app.listen(PORT, () => {
  console.log(`ローカルサーバー起動中...URL: http://localhost:${PORT}`);
});
