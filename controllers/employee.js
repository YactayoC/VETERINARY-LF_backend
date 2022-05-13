const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');

const getEmployees = async (req, res) => {
  const employees = await Employee.find();

  res.json({
    ok: true,
    employees,
  });
};

const addEmployee = async (req, res) => {
  const employee = new Employee(req.body);

  try {
    employee.password = await bcrypt.hash(employee.password, 10);
    const employeeSave = await employee.save();
    res.json({
      ok: true,
      employee: employeeSave,
      msg: 'Employee saved successfully',
    });
  } catch (error) {
    res.status(500).json({
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
      return res.status(404).json({
        ok: false,
        msg: 'Employee not found',
      });
    }

    const newEmployee = {
      ...req.body,
    };

    const employeeUpdated = await Employee.findByIdAndUpdate(id, newEmployee, { new: true });
    res.json({
      ok: true,
      employee: employeeUpdated,
      msg: 'Employee updated successfully',
    });
  } catch (error) {
    res.status(500).json({
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
    res.json({
      ok: true,
      msg: 'Employee deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error in deleteEmployee',
    });
  }
};

module.exports = {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};
