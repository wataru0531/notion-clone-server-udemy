/**************************************************************

メモに関する

***************************************************************/

const Memo = require("../models/memo.js");


exports.create = async (req, res) =>  {
  try{
    // メモの位置を考慮する関数 → メモの個数を取得
    const memoCount = await Memo.find().count();

    // メモの新規作成
    const memo = await Memo.create({
      user: req.user._id,  // mongoDBの_id
      position: memoCount > 0 ? memoCount : 0, // メモの位置
    });

    res.status(201).json(memo) // memoを返す。

  }catch(error){
    res.status(500).json(error);
  }
}


// メモを全て取得するAPI
exports.getAll = async (req, res) => {
  try{
    // 現在ログインしているユーザーのメモのみ取得
    // sort ... 作成した順番にソートされる
    const memos = await Memo.find({ user: req.user._id }).sort("-position");

    res.status(200).json(memos);

  }catch(error){
    res.status(500).json(error);
  }
}

// メモを1つ取得するAPI
exports.getOne = async (req, res) => {
  // メモIDを取得
  const { memoId } = req.params;

  try{
    // ログインしてるユーザーを指定
    const memo = await Memo.findOne({ user: req.user._id, _id: memoId })

    if(!memo) return res.status(404).json("メモが存在しません");

    res.status(200).json(memo);

  }catch(error){
    res.status(500).json(error)
  }
}


// メモの内容を更新
exports.update = async (req, res) =>{
  const { memoId } = req.params;

  // bodyからタイトルなどを取得
  const  { title, description }  = req.body;

  try{
    // もし空の場合
    if(title === "") req.body.title       = "無題";
    if(description === "") req.body.description = "自由に記入してください";

    const memo = await Memo.findOne({ user: req.user._id, _id: memoId })

    if(!memo) return res.status(404).json("メモが存在しません");

    const updateMemo = await Memo.findByIdAndUpdate(memoId, {
      // $set ... タイトル、 デスクリプションなどを含める。mongooseのライブラリ
      $set: req.body,
    })

    res.status(200).json(updateMemo);

  }catch(error){
    res.status(500).json(error);
  }
}

// メモを1つ削除
exports.delete = async (req, res) =>{
  const { memoId } = req.params;

  try{
    const memo = await Memo.deleteOne({ user: req.user._id, _id: memoId });

    if(!memo) return res.status(404).json("メモが存在しません");

    // 削除は何も返す必要がないのでただ削除するだけ
    res.status(200).json("メモを削除しました");
  }catch(error){
    res.status(500).json(error);
  }
}