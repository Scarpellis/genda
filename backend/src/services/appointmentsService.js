const fs = require('fs').promises;
const path = require('path');

const APPOINTMENTS_FILE = path.join(__dirname, '..', 'data', 'appointments.json');

let appointments = [];

async function loadAppointments() {
  try {
    const data = await fs.readFile(APPOINTMENTS_FILE, 'utf-8');
    appointments = JSON.parse(data);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Failed to load appointments:', error);
    }
  }
}

async function saveAppointments() {
  try {
    await fs.writeFile(APPOINTMENTS_FILE, JSON.stringify(appointments, null, 2));
  } catch (error) {
    console.error('Failed to save appointments:', error);
    throw error;
  }
}

function getAppointments() {
  return appointments;
}

async function createAppointment({ date, time, service, client, phone, email, status, notes }) {
  const appointment = {
    id: Date.now().toString(),
    date,
    time,
    service,
    client,
    phone,
    email,
    status,
    notes,
  };
  appointments.push(appointment);
  await saveAppointments();
  return appointment;
}

function findAppointmentById(id) {
  return appointments.find((a) => a.id === id);
}

async function updateAppointment(id, fields) {
  const appointment = findAppointmentById(id);
  if (!appointment) {
    return null;
  }
  Object.assign(appointment, fields);
  await saveAppointments();
  return appointment;
}

async function deleteAppointment(id) {
  const index = appointments.findIndex((a) => a.id === id);
  if (index === -1) {
    return false;
  }
  appointments.splice(index, 1);
  await saveAppointments();
  return true;
}

module.exports = {
  loadAppointments,
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  findAppointmentById,
};
