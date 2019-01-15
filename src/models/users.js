import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  nickname: String,
  phoneNo: String,
  website: String,
  agrement: Boolean,
  token: String
});

export default mongoose.model("User", userSchema);
