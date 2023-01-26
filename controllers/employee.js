const bcrypt = require('bcryptjs');

const Employee = require('../models/Employee');
const { generateJWT } = require('../helpers/jwt');

const getEmployees = async (req, res) => {
  const employees = await Employee.find();

  res.status(200).json({
    ok: true,
    employees,
  });
};

const addEmployee = async (req, res) => {
  const employee = new Employee(req.body);

  try {
    employee.password = await bcrypt.hash(employee.password, 10);
    const employeeSave = await employee.save();
    res.status(201).json({
      ok: true,
      employee: employeeSave,
      msg: 'Employee saved successfully',
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'Error in addEmployee',
    });
  }
};

const updateEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(400).json({
        ok: false,
        msg: 'Employee not found',
      });
    }

    const newEmployee = {
      ...req.body,
    };

    const employeeUpdated = await Employee.findByIdAndUpdate(id, newEmployee, { new: true });
    res.status(202).json({
      ok: true,
      employee: employeeUpdated,
      msg: 'Employee updated successfully',
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'Error in updateEmployee',
    });
  }
};

const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        ok: false,
        msg: 'Employee not found',
      });
    }

    await Employee.findByIdAndDelete(id);
    res.status(202).json({
      ok: true,
      msg: 'Employee deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'Error in deleteEmployee',
    });
  }
};

const loginEmployee = async (req, res) => {
  const { email, password } = req.body;

  try {
    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(400).json({
        ok: false,
        msg: 'User does not exist',
      });
    }

    const validPassword = bcrypt.compareSync(password, employee.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Invalid password',
      });
    }

    const token = generateJWT(employee.id, employee.fullname);
    res.status(200).json({
      ok: true,
      uid: employee.id,
      fullname: employee.fullname,
      type: employee.type,
      token,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'Error in the server',
    });
  }
};

const revalidateTokenEmployee = async (req, res) => {
  const { uid } = req;
  const employee = await Employee.findById(uid);

  const token = await generateJWT(uid, employee.fullname);

  res.status(200).json({
    ok: true,
    uid,
    fullname: employee.fullname,
    type: employee.type,
    token,
  });
};

const employeeGetProfile = async (req, res) => {
  const { uid } = req;

  try {
    const employee = await Employee.findById(uid);
    if (!employee) {
      return res.status(404).json({
        ok: false,
        msg: 'User does not exist',
      });
    }

    res.status(200).json({
      ok: true,
      employee,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'Error in the server',
    });
  }
};

const employeeUpdateProfile = async (req, res) => {
  const { uid } = req;
  const { fullname, phone, address } = req.body;

  try {
    const employee = await Employee.findById(uid);

    if (!employee) {
      return res.status(404).json({
        ok: false,
        msg: 'User does not exist',
      });
    }

    employee.fullname = fullname;
    employee.phone = phone;
    employee.address = address;
    await employee.save();
    res.json({
      ok: true,
      msg: 'User updated successfully',
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'Error in the server',
    });
  }
};

module.exports = {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  loginEmployee,
  revalidateTokenEmployee,
  employeeGetProfile,
  employeeUpdateProfile,
};
