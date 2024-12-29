/**************************************************************

メモのスキーマ

***************************************************************/

const mongoose = require("mongoose");

const memoSchema = new mongoose.Schema({
  user: {
    // type、refはセットとする
    // type ... refも指定。ここではUserスキーマを持ってくる
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // ユーザースキーマを参照

    required: true,
  },
  icon: {
    type: String,
    default: "📝",
  },
  title: {
    type: String,
    default: "無題",
  },
  description: {
    type: String,
    default: "メモを記入してください、",
  },
  position: {
    type: Number,
    default: false,
  },
  favoritePosition: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Memo", memoSchema);
