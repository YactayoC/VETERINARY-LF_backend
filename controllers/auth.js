const bcrypt = require('bcryptjs');
const Client = require('../models/Client');
const { generateJWT } = require('../helpers/jwt');
const { emailRegister } = require('../helpers/emailRegister');

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    let client = await Client.findOne({ email });

    if (client) {
      return res.status(400).json({
        ok: false,
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
      ok: true,
      uid: client.id,
      fullname: client.fullname,
      msg: 'User created successfully',
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
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
        ok: false,
        msg: 'Invalid token',
      });
    }

    client.confirmed = true;
    client.token = null;
    await client.save();
    res.status(201).json({
      ok: true,
      msg: 'User confirmed successfully',
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error in the server',
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const client = await Client.findOne({ email });

    if (!client) {
      return res.status(400).json({
        ok: false,
        msg: 'User does not exist',
      });
    }

    const validPassword = bcrypt.compareSync(password, client.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Invalid password',
      });
    }

    const token = generateJWT(client.id, client.fullname);
    res.status(201).json({
      ok: true,
      uid: client.id,
      fullname: client.fullname,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error in the server',
    });
  }
};

const revalidateToken = async (req, res) => {
  const { uid, fullname } = req;
  const token = await generateJWT(uid, fullname);

  res.json({
    ok: true,
    uid,
    fullname,
    token,
  });
};

const getProfile = async (req, res) => {
  const { uid } = req;

  try {
    const client = await Client.findById(uid);
    if (!client) {
      return res.status(400).json({
        ok: false,
        msg: 'User does not exist',
      });
    }

    res.status(201).json({
      ok: true,
      uid: client.id,
      fullname: client.fullname,
      email: client.email,
      phone: client.phone,
      address: client.address,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error in the server',
    });
  }
};

const updateProfile = async (req, res) => {
  const { uid } = req;
  const { fullname, phone, address } = req.body;

  try {
    const client = await Client.findById(uid);

    if (!client) {
      return res.status(400).json({
        ok: false,
        msg: 'User does not exist',
      });
    }

    client.fullname = fullname;
    client.phone = phone;
    client.address = address;
    await client.save();
    res.json({
      ok: true,
      msg: 'User updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error in the server',
    });
  }
};

module.exports = { register, confirmToken, login, revalidateToken, getProfile, updateProfile };
