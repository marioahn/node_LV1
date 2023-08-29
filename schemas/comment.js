import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  _postId: { 
    type: String,
    required: true, // 댓글은 특정post에서만 존재 가능하므로
  },
  user: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date, // required는 x
    default: Date.now,
  }
}, { versionKey: false } // _v필드 생성x
);

// Comment로 모듈화 -> routes파일들에서 import
export default mongoose.model('Comment', commentSchema);