// 통합적 관리 => ./routes/comments,posts.js들의 api들을 여기서 한꺼번에 모아서 app.js에 내보냄
import express from 'express';
import posts from './posts.js'
import comments from './comments.js'

const router = express.Router();

router.use('/posts',posts, comments);


export default router;