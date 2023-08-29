import express from 'express';
import Comment from '../schemas/comment.js'

const router = express.Router();

/** 1. 댓글 생성  **/
router.post('/:_postId/comments', async (req,res) => {
  try {
    const { _postId } = req.params;
    const { user, password, content } = req.body;

    // 400에러: body or params가 입력x인 경우
    if (!_postId || !user || !password) 
      return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다' });

    // 400에러2: content가 비어있는 경우
    if (!content)
      return res.status(400).json({ message: '댓글 내용을 입력해주세요' });

    await Comment.create({ _postId, user, password, content });
    return res.status(200).json({ message: '댓글을 생성하였습니다' });
  }
  catch (err) { console.error(err) };
});


/** 2. 댓글 목록 조회 - 상세조회는x **/
router.get('/:_postId/comments', async (req,res) => {
  try {
    const comments = await Comment.find({}).sort({ createdAt: -1 }).exec();
    const newComments = comments.map((comment) => {
      return {
        commentId: comment['_id'],
        user: comment['user'],
        content: comment['content'],
        createdAt: comment['createdAt'],
      };
    });
    
    if (!req.params || !newComments.length)
      return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다' });
    
    res.status(200).json({ data: newComments });
  }
  catch (err) { console.error(err) };
});


/** 3. 댓글 수정 **/
router.put('/:_postId/comments/:_commentId', async (req,res) => {
  try {
    const { _commentId } = req.params;
    const { password, content } = req.body;
    const comment = await Comment.find({ _id: _commentId }).exec();

    if (!_commentId || !password) {
      return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다' });
    }

    if (!content) {
      return res.status(400).json({ message: '댓글 내용을 입력해주세요' });
    }
    
    if (!comment) {
      return res.status(404).json({ message: '댓글 조회에 실패하였습니다.' });
    }

    await Comment.updateOne({ _id: _commentId }, { $set: { password, content }});
    return res.status(204).json({ message: '댓글을 수정하였습니다' });
  } 
  catch (err) { console.error(err) };
});


/** 4. 댓글 삭제 **/
router.delete('/:_postId/comments/:_commentId', async (req,res) => {
  try {
    const { _commentId } = req.params;
    const { password } = req.body;
    const comment = await Comment.findOne({ _id: _commentId }).exec();
    const commentPassword = comment.password;

    if (!_commentId || !password) {
      return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다' });
    }

    if (!comment) {
      return res.status(404).json({ message: '댓글 조회에 실패했습니다' });
    }

    if (commentPassword === password) {
      await Comment.deleteOne({ _id: _commentId });
      return res.status(200).json({ message: '댓글을 삭제하였습니다' });
    } else return res.status(200).json({ message: '비번이 틀렸습니다' });
  }
  catch (err) { console.error(err) };
});


export default router;