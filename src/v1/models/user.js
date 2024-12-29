/**************************************************************

ユーザーのスキーマ

***************************************************************/

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,  // 必須
    unique: true,    // 重複は不可
  },
  password: {
    type: String,
    required: true,
  },
});

// どのファイルでも使えるようにする
module.exports = mongoose.model("User", userSchema);
