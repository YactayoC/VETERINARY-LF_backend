const bcrypt = require('bcryptjs');

const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');
const { emailRegister } = require('../helpers/emailRegister');

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        msg: 'User already exists',
      });
    }

    user = new User(req.body);
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);
    const userSaved = await user.save();

    emailRegister({
      email: userSaved.email,
      fullname: userSaved.fullname,
      token: userSaved.token,
    });

    res.status(201).json({
      msg: 'User successfully created, please verify your email address',
    });
  } catch (error) {
    res.status(400).json({
      msg: 'Error in the server',
    });
  }
};

const confirmToken = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ key: token });

    if (!user) {
      return res.status(400).json({
        confirm: false,
        msg: 'Invalid token',
      });
    }

    user.confirmed = true;
    user.key = null;
    await user.save();
    res.status(202).json({
      confirm: true,
      msg: 'User confirmed successfully',
    });
  } catch (error) {
    res.status(400).json({
      confirm: false,
      msg: 'Error in the server',
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('-__v');

    if (!user) {
      return res.status(400).json({
        msg: 'User does not exist',
      });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Invalid password',
      });
    }

    if (!user.confirmed) {
      return res.status(400).json({
        msg: 'User not confirmed',
      });
    }

    const token = generateJWT(user.id, user.fullname);
    res.status(200).json({
      user,
      token,
    });
  } catch (error) {
    res.status(400).json({
      msg: 'Error in the server',
    });
  }
};

const revalidateToken = async (req, res) => {
  const { uid } = req;
  const user = await User.findById(uid).select('-__v');

  const token = generateJWT(uid, user.fullname);

  res.status(200).json({
    user,
    token,
  });
};

const getProfile = async (req, res) => {
  const { uid } = req;

  try {
    const user = await User.findById(uid);
    if (!user) {
      return res.status(400).json({
        msg: 'User does not exist',
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(400).json({
      msg: 'Error in the server',
    });
  }
};

const updateProfile = async (req, res) => {
  const { uid } = req;
  const { fullname, phone, address } = req.body;

  try {
    const user = await User.findById(uid).select('-__v');

    if (!user) {
      return res.status(400).json({
        msg: 'User does not exist',
      });
    }

    user.fullname = fullname;
    user.phone = phone;
    user.address = address;
    const token = generateJWT(user.id, user.fullname);
    const userSaved = await user.save();
    res.status(202).json({
      user: userSaved,
      token,
      msg: 'User updated successfully',
    });
  } catch (error) {
    res.status(400).json({
      msg: 'Error in the server',
    });
  }
};

module.exports = { register, confirmToken, login, revalidateToken, getProfile, updateProfile };
