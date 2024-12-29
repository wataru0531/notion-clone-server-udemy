/**************************************************************



***************************************************************/


const router = require("express").Router();

// 同じ階層のauth.jsの router.post("/register")...を叩くには前にauthをつけなくてはならない。
// 認証
router.use("/auth", require("./auth"));

// メモ
router.use("/memo", require("./memo"));


module.exports = router;
