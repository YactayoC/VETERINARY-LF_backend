const bcrypt = require('bcryptjs');

const Client = require('../models/Client');
const { generateJWT } = require('../helpers/jwt');
const { emailRegister } = require('../helpers/emailRegister');

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    /* Mongo ignore --v */
    let client = await Client.findOne({ email });

    if (client) {
      return res.status(400).json({
        msg: 'User already exists',
      });
    }

    client = new Client(req.body);
    const salt = bcrypt.genSaltSync();
    client.password = bcrypt.hashSync(password, salt);
    const clientSaved = await client.save();

    emailRegister({
      email: clientSaved.email,
      fullname: clientSaved.fullname,
      token: clientSaved.token,
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
    const client = await Client.findOne({ token });

    if (!client) {
      return res.status(400).json({
        msg: 'Invalid token',
      });
    }

    client.confirmed = true;
    client.token = null;
    await client.save();
    res.status(202).json({
      msg: 'User confirmed successfully',
    });
  } catch (error) {
    res.status(400).json({
      msg: 'Error in the server',
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const client = await Client.findOne({ email }).select('-__v');

    if (!client) {
      return res.status(400).json({
        msg: 'User does not exist',
      });
    }

    const validPassword = bcrypt.compareSync(password, client.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Invalid password',
      });
    }

    if (!client.confirmed) {
      return res.status(400).json({
        msg: 'User not confirmed',
      });
    }

    const token = generateJWT(client.id, client.fullname);
    res.status(200).json({
      client,
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
  const client = await Client.findById(uid).select('-__v');

  const token = generateJWT(uid, client.fullname);

  res.status(200).json({
    client,
    token,
  });
};

const getProfile = async (req, res) => {
  const { uid } = req;

  try {
    const client = await Client.findById(uid);
    if (!client) {
      return res.status(400).json({
        msg: 'User does not exist',
      });
    }

    res.status(200).json({
      client,
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
    const client = await Client.findById(uid).select('-__v');

    if (!client) {
      return res.status(400).json({
        msg: 'User does not exist',
      });
    }

    client.fullname = fullname;
    client.phone = phone;
    client.address = address;
    const token = generateJWT(client.id, client.fullname);
    const clientSaved = await client.save();
    res.status(202).json({
      client: clientSaved,
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
