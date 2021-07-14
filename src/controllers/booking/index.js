const { bookingService } = require('../../services');
const { getAllAvailable, book, cancle } = bookingService();

const bookRoom = async (req, res, next) => {
  try {
    const result = await book(req.body);
    res.status(201).json(result);
    return;
  } catch (err) {
    next(err);
  }
};

const cancleRoom = async (req, res, next) => {
  try {
    const result = await cancle(req.body);
    res.status(201).json(result);
    return;
  } catch (err) {
    next(err);
  }
};

const getUnbookedRooms = async (req, res, next) => {
  try {
    const result = await getAllAvailable();
    res.status(200).json(result);
    return;
  } catch (err) {
    next(err);
  }
};

module.exports = { getUnbookedRooms, bookRoom, cancleRoom };
