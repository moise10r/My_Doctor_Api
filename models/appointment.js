const mongoose =  require('mongoose');
const Joi =  require('@hapi/joi');

const appointmentSchema = new mongoose.Schema({
  doctor: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
      },
    }),
    required: true
  },
  patient: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
      },
    }),
    required: true
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  isTaken: {
    type: Boolean,
    default: false,
  },
  takenAt: {
    type:String,
    required: true,
  }
}) 

const Appointment = mongoose.model('appointment', appointmentSchema);

function validateAppointement(appointement) {
  const schema = Joi.object().keys({
    time: Joi.string().required(),
    date: Joi.string().required(),
  })
  return schema.validate(appointement);
}

exports.validateAppointement = validateAppointement;
exports.Appointment = Appointment;