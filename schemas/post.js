import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  title: {
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

// postSchema를 바탕으로 Post'모델'을 생성하여, 외부로 내보낸다 = 모듈화
export default mongoose.model('Post', postSchema);