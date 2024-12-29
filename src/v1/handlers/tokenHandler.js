/**************************************************************

JWTを認証するためのミドルウェア。

***************************************************************/
const JWT = require("jsonwebtoken");
const User = require("../models/user");

// クライアント側から渡されたJWTが正常化どうかを検証する関数。デコード(解読)のこと.
const tokenDecode = (req) => {

  // クライアントのリクエストヘッダーを検出
  // "authorization": bearer ここにトークンが入っている
  const bearerHeader = req.headers["authorization"];

  // bearerHeaderのトークン部分を取得していく
  if(bearerHeader){
    // "authorization": bearer トークン
    // ["bearer", "トークン"]となる。 空白部分を取り除いて取得
    const bearer = bearerHeader.split(" ")[1];
      
    try{
      // 認証していく
      const decodeToken = JWT.verify(
        bearer,                         // クライアントが持つ秘密鍵
        process.env.TOKEN_SECRET_KEY,   // 秘密鍵
      );

      return decodeToken;
      
    }catch(error){
      return false; // 何も存在しない場合
    }
  }else{
    return false;
  }
};

// デコード(解読)した変数を返す
exports.verifyToken = async (req, res, next) => {
  const tokenDecoded = tokenDecode(req)

  // デコードしたトークンと一致するユーザーを返す
  if(tokenDecoded){
    // tokenDecodedの中にはユーザーのidが含まれるのでそこから探す
    const user = await User.findById(tokenDecoded.id);

    // ユーザーが存在しない場合
    if(!user){
      return res.status(401).json("権限がありません");
    }

    // 正常にユーザーがそんざいした場合
    req.user = user; // ユーザーの更新

    next(); // 次に行く
  } else {
    return res.status(401).json("権限がありません");
  }
};
