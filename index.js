const express = require('express');

const router = require('./src/routes/index');

const { apiErrorHandler } = require('./src/utils');

const { bookingRouter } = router;
const app = express();
app.use(express.json());
app.use(bookingRouter);
app.use(apiErrorHandler);

const { SERVER_PORT } = process.env;

app.listen(SERVER_PORT, () => {
  console.log(`App listening at http://localhost:${SERVER_PORT}`);
});
