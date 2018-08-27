import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true }
}, { timestamps: {} });

const User = mongoose.model('User', userSchema);

export { User };