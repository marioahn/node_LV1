// mongoose 연결
import mongoose from 'mongoose';

const connect = () => {
  mongoose
    .connect( // atlas로 연결
      'mongodb+srv://sparta-user:aaaa4321@express-mongo.uy7ttg7.mongodb.net/?retryWrites=true&w=majority',
      { dbName: 'node_lv1' }) // db명
    .then(() => console.log('MongoDB 연결에 성공하였습니다.'))
    .catch((err) => console.log(`MongoDB 연결에 실패하였습니다. ${err}`));
};

mongoose.connection.on('error', (err) => {
  console.error('MongoDB 연결 에러', err);
});

export default connect;