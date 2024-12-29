
/**************************************************************

リクエストについてのエラー処理

***************************************************************/
const { validationResult } = require("express-validator");


exports.validate = ( req, res, next ) => {
  // リクエストにエラーがあるかどうか
  const errors = validationResult(req);
  
  // エラーがあった場合
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }

  // next()...上記のエラー処理が終わったら次の処理に行ってくださいねという処理となる
  // ミドルウェアを入れる場合はnextはよく使う
  next();
}

