import mongoose from 'mongoose';
import { success, error } from '../../lib/log';
const database = process.env.DOCKER === 'TRUE' ? `mongodb://mongo/${process.env.LOCAL_DATABASE}` : `mongodb://localhost/${process.env.LOCAL_DATABASE}`;

mongoose.connect(database, { useNewUrlParser: true });

const db = mongoose.connection;

const retryConnect = () => {
  error('Retrying...');
  return mongoose.connect(database, { useNewUrlParser: true });
}

db.on('error', err => {
  error.bind(console, 'MongoDB connection error');
  setTimeout(retryConnect, 5000);
});
db.once('open', () => success('MongoDB is connected'));

export default db;