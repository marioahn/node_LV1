import express from 'express';
import Post from '../schemas/post.js'

const router = express.Router();


/** 3. post등록 API -> 등록부터 작성하기 - 조회api부터 만들면 api테스트를 못 함... **/
router.post('/', async (req,res) => {
  try {
    const { user, password, title, content } = req.body;
    if (!user || !password || !title || !content) {
      return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다' });
    }

    await Post.create({ user, password, title, content });
    return res.status(201).json({ message: `${user}의 게시글을 생성하였습니다` });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ errorMessage: '서버에러입니다' });
  };
});


/** 1. post전체 조회 API **/
router.get('/', async (_,res) => {
  try { // try-catch
    const posts = await Post.find().sort({ createdAt: -1 }).exec(); // 작성 날짜 기준으로 내림차순
    const newPosts = posts.map((post) => { // 모든 게시글 다 조회
      return { // map -> return필수
        postId: post['_id'],
        user: post['user'],
        title: post['title'],
        createdAt: post['createdAt']
      };
    });
    return res.status(200).json({ data: newPosts })
  }
  catch (err) { 
    console.error(err);
    return res.status(500).json({ errorMessage: '서버에러입니다' });
  };
});


/** 2. post상세 조회 API **/
router.get('/:_postId', async (req,res) => {
  try {
    const { _postId } = req.params;
    if (!_postId) { return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다' }) }

    // *첨에 find쓰고, 전체조회처럼 map으로 하려했는데, findOne쓰면 할 필요없을듯? -> 근데 how?
      // 객체 구조분해 할당등의 방법은 전부 실패 (노션에 적어뒀음)
    const postOne = await Post.findOne({ _id: _postId }).exec(); // id맞는 것을 딱 1개 찾기
    // const newPost = [postOne].map((post) => { // postOne은 객체이므로 map x -> [postOne]
    //   return { 
        // postId: post['_id'],
        // user: post['user'],
        // title: post['title'],
        // content: post['content'],
        // createdAt: post['createdAt']
    //   };
    // });
    const newPost = { // 한 개면 맵 안쓰고 이렇게 해도 되긴 함..
      postId: postOne['_id'],
      user: postOne['user'],
      title: postOne['title'],
      content: postOne['content'],
      createdAt: postOne['createdAt']
    }

    return res.status(200).json({ data: newPost })
  }
  catch (err) { 
    console.error(err);
    return res.status(500).json({ errorMessage: '서버에러입니다' });
  };
});


/** 4. post수정 API **/
router.put('/:_postId', async (req,res) => {
  try {
    const { _postId } = req.params;
    const { password, title, content } = req.body;
    const post = await Post.findOne({ _id: _postId}).exec();
    const postPassword = post.password;

    // *(1)400에러 -params,body가 제대로 x인경우 -> params가 제대로 처리 안됨
    if (!_postId || !password || !title || !content) {
      return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다((1.postId제대로 + 2.[비번,제목,제목] 필수)' });
    };

    if (post && postPassword === password) {
      await Post.updateOne({ _id: _postId}, { $set: { password, title, content }}); //  1인자: 수정할 대상, 2인자: 수정할 내용
      return res.status(204).json({ message: '게시글 수정 성공!' });
    };
    
    // *아래꺼 제대로 작동x
    if (!post) return res.status(404).json({ message: '게시글 조회에 실패하였습니다' });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ errorMessage: '서버에러입니다' });
  };
});


/** 5. post삭제 API **/
router.delete('/:_postId', async (req,res) => {
  try {
    const { _postId } = req.params;
    const { password } = req.body;
    const post = await Post.findOne({ _id: _postId }).exec(); // findById도 ok
    const postPassword = post.password;

    // *여기도 params 400에러 안될것 같은데.. -> 안된다..
    if (!_postId || !password) {
      return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    };

    // 게시글이 존재하고, 비번이 맞다면 삭제
    if (post && postPassword === password) await Post.deleteOne({ _id: _postId });
    
    // 게시글이 존재치 않다면 -> 404
    if (!post) return res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });

    return res.status(204).json({ message: '게시글을 삭제하였습니다' });
  } 
  catch (err) {
    console.error(err);
    return res.status(500).json({ errorMessage: '서버에러입니다' });
  };
});


export default router;