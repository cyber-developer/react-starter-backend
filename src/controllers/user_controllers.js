import User from '../models/users';
import bcrypt from 'bcrypt';
import bcryptSaltRounds from '../../config';
import jwt from 'jsonwebtoken';

const create = async(req, res, next) => {
  try {
    const { SALT_ROUNDS } = bcryptSaltRounds.bcrypt;
    req.body.password = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if(!user) {
      const data = await User.create(req.body);

      if(!data) return res.send({ status: false, msg: 'User not created, something went wrong' });
      else return res.send({ status: true, msg: 'User created successfully!', data });

    } else {
      return res.send({ status: false, msg: 'User already registered!', data: user });
    }

  } catch(err) {
    return res.send({ status: false, msg: err.message });
  }
};

const login = async(req, res, next) => {
  try {
    const request = req.body;
    const { email, name } = request;
    const user = await User.findOne({ email });
    if(user) {
      const { password } = user;
      const isVerified = await bcrypt.compare(request.password, password);
      if(isVerified) {
        const token = await jwt.sign({
          data: email
        }, 'secret');
        if( token) {
          const updatedUser = await User.findOneAndUpdate({ email }, { token, lastLogin: new Date() });
          if(updatedUser) {
            const { lastLogin } = updatedUser;
            return res.send({ status: true, data: { email, lastLogin, token }, msg: 'Loggedin successfully' });
          }
        }
      } else {
        return res.send({ status: false, msg: 'Please enter correct email password!' });  
      }
    } else {
      return res.send({ status: false, msg: 'Please enter correct email password!' });
    }

  } catch(err) {
    return res.send({ status: false, msg: err.message });
  }
};

const getAll = async(req, res, next) => {
  try {
    const data = await User.find({});

    if(!data) return res.send({ status: false, msg: 'Users not fetched!', data });
    else return res.send({ status: true, msg: 'Users fetched!', data });
    
  } catch(err) {
    return res.send({ status: false, msg: err.message });
  }
};

const resetPassword = async(req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if(user) {
      const { password } = user;
      const isVerified = await bcrypt.compare(req.body.password, password);
      if(isVerified) {
        const { SALT_ROUNDS } = bcryptSaltRounds.bcrypt;
        req.body.newPassword = await bcrypt.hash(req.body.newPassword, SALT_ROUNDS);
        const updatedUser = await User.findOneAndUpdate({ email }, { password: req.body.newPassword });
        if(updatedUser)
          return res.send({ status: true, msg: 'Password reset sucessfully!' });
        else 
          return res.send({ status: false, msg: 'Password not updated!' });
      } else {
        return res.send({ status: false, msg: 'Email or old password incorrect!' });
      }
    } else {
      return res.send({ status: false, msg: 'Please enter correct email!' });
    }
  } catch(err) {
    return res.send({ status: false, msg: err.message });
  }
};


export default { create, login, getAll, resetPassword };
