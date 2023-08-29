import express from 'express';
import connect from './schemas/index.js';
import indexRouter from './routes/index.js'

const app = express();
const PORT = 3000;

connect() // mongoose 연결함수 실행

// Express에서 req.body에 접근하여 body 데이터를 사용할 수 있도록 설정 - 아래 두 줄은 세트
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, _, next) => { // 로그확인용 미들웨어 -> insomnia에서 api요청보내면 로그가 뜸
  console.log('Request URL:', req.originalUrl, ' - ', new Date());
  next();
});


const router = express.Router(); 
router.get('/', (_, res) => { 
  return res.json({ message: 'Hi!' }); 
});

app.use('/', indexRouter);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});

// *미들웨어 순서 괜찮나..? api는 당연히 다 작동