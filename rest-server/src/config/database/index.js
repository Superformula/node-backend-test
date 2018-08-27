import mongoose from 'mongoose';
import { success, error } from '../../lib/log';
const database = process.env.DATABASE ? `mongodb://localhost/${process.env.DATABASE}` : 'mongodb://localhost/generic';

mongoose.connect(database, { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', error.bind(console, 'MongoDB connection error'));
db.once('open', () => success('MongoDB is connected'));

export default db;