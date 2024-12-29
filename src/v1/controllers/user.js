/**************************************************************


新規登録、ログインに関するもの

crypt.js https://www.npmjs.com/package/crypto-js

***************************************************************/

const CryptoJS = require("crypto-js");  // 暗号化
const JWT = require("jsonwebtoken");    // トークンの発行(公開鍵暗号方式)

const User = require("../models/user"); // スキーマ

/**************************************************************

新規登録に関する処理

***************************************************************/
exports.register = async (req, res) => {
  // パスワードの受け取り
  const password = req.body.password;

    try{
      // パスワードの暗号化(ここではハッシュ化)
      // 第１引数...暗号化したい文字列
      // 第２引数...シークレットキー。公開鍵暗号方式。第三者から見られるとまずいので保護
      req.body.password = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY);

      // ユーザーの新規作成 mongoDBにユーザーを保存していく create()使用
      const user = await User.create(req.body);

      // JWT(トークン)の発行 ... トークンの発行(暗号化された文字列。クライアントに渡すことで次のログインですぐにログインできる)
      const token = JWT.sign(
        { id: user._id },             // mongoDBのid
        process.env.TOKEN_SECRET_KEY,  // シークレットキー
        { expiresIn: "24h" }           // 保存期間
      );

      // クライアントにuser、token情報を返す...この情報をいろいろ使う 
      return res.status(200).json({ user, token });

    }catch(err){
      res.status(500).json(err);
    }
}

/**************************************************************

ログインに関する処理

***************************************************************/

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try{
    // findOne()...mongoDBのusernameとリクエストのusernameと等しいかどうかを確かめる
    const user = await User.findOne({ username: username })
    if(!user){
      return res.status(401).json({ // 認証する資格がないので401で
        errors: [{
          param: "username",
          msg: "ユーザー名が無効です",
        }],
      })
    }

    // ①パスワードが合っているか照合する処理
    // mongoDBの中に二登録しているパスワードを複合化
    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,               // 複合化する対象
      process.env.SECRET_KEY,      // シークレットキー

    ).toString(CryptoJS.enc.Utf8); // 文字列として認識する

    // ②パスワードが間違っている場合
    if(decryptedPassword !== password){
      return res.status(401).json({
        errors: [{
          param: "password",
          msg: "パスワードが無効です",
        }]
        
      })
    }

    // トークンの発行 ... ①、②に引っ掛からなかった場合
    const token = JWT.sign(
      { id: user._id },             // mongoDBのid
      process.env.TOKEN_SECRET_KEY,  // シークレットキー
      { expiresIn: "24h" }           // 保存期間
    );

    // リクエストが成功 
    return res.status(201).json({ user, token });

  }catch(error){
    res.status(500).json(error);
  }
}
