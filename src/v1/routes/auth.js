/**************************************************************


新規登録、ログインに関するもの、AWTの処理


***************************************************************/
const { body, validationResult } = require("express-validator"); // バリデーションチェック

// router ... index.js でのルーターでこのauthファイルを呼び出す
const router = require("express").Router();

const dotenv = require("dotenv").config();

const User = require("../models/user");  // mongoDBに保存のためにmodel呼び出し

const validation = require("../handlers/validation");     // リクエストについてのエラー処理
const userController = require("../controllers/user");    // パスワードなどの暗号化などの処理
const tokenHandler = require("../handlers/tokenHandler"); // JWTを認証する

/**************************************************************

ユーザー新規登録用のAPI

***************************************************************/
router.post("/register",

  // バリデーションチェック(express-validator を利用)
  body("username").isLength({ min: 8 }).withMessage("ユーザー名は8文字以上である必要があります"),
  body("password").isLength({ min: 8 }).withMessage("パスワードは8文字以上である必要があります"),
  body("confirmPassword").isLength({ min: 8 }).withMessage("確認用パスワードは8文字以上である必要があります"),

  // カスタムバリデーション(これもexpress-validator を利用)
  body("username").custom((value) => {
    // findOne()...mongoDBのusernameとvalueと等しい時、thenのuserに格納
    return User.findOne({ username: value }).then((user) => {
      // 登録済みだった場合
      if(user){
        return Promise.reject("このユーザーは既に使われています");
      }
    })
  }),

  validation.validate,     // リクエストについてのエラー処理

  userController.register, // パスワード暗号化、トークンの発行
);

/*****************************************************************

ログイン用のAPI  → リクエストに関するもの　+  新規登録とパスワードに関するもの

******************************************************************/

router.post("/login",
  // 
  body("username").isLength({ min: 8 }).withMessage("ユーザー名は8文字以上である必要があります"),
  body("password").isLength({ min: 8 }).withMessage("パスワードは8文字以上である必要があります"),

  validation.validate,     // リクエストについてのエラー処理

  userController.login, // パスワード暗号化、トークンの発行
)


/****************************************************************************

JWT認証 
JWT ... 例えば、一度ログインした場合24時間以内ならログインページにリダイレクトされるなど

******************************************************************************/

// JWTのミドルウェアをかまして、通ればユーザー情報を返す
router.post(
  "/verify-token", 

  tokenHandler.verifyToken,  // JWTでの認証をかませる

  // ユーザー情報を返す。このユーザー情報をもとにReact側でリダイレクト処理などを行う
  (req, res) => {
    return res.status(200).json({ user: req.user });
  },
)

module.exports = router;

