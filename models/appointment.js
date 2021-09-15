const mongoose =  require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctor: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
      },
      required: true
    })
  },
  patient: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
      },
      required: true
    }),
  }
}) 

const Appointment = mongoose.model('Appointment', appointmentSchema);

exports.Appointment = Appointment;