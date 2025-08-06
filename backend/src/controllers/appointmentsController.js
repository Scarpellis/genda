const appointmentsService = require('../services/appointmentsService');

async function createAppointment(req, res) {
  try {
    const appointment = await appointmentsService.createAppointment(req.body);
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Could not create appointment' });
  }
}

function getAppointments(req, res) {
  const appointments = appointmentsService.getAppointments();
  res.json(appointments);
}

async function updateAppointment(req, res) {
  const { id } = req.params;
  try {
    const updated = await appointmentsService.updateAppointment(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Could not update appointment' });
  }
}

async function deleteAppointment(req, res) {
  const { id } = req.params;
  try {
    const deleted = await appointmentsService.deleteAppointment(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete appointment' });
  }
}

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
};
