const yup = require('yup');

const bookingSchema = yup.object().shape({
  roomName: yup.string().required(),
  companyName: yup.string().required(),
  event_start: yup.string().min(5).max(5).required(),
  event_end: yup.string().min(5).max(5).required(),
});

module.exports = { bookingSchema };
