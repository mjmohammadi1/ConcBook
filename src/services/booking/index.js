const { bookingDAO } = require('../../dao');
const { queue } = require('../../utils');

module.exports = ({ _queue = queue, _bookingDAO = bookingDAO } = {}) => {
  return {
    async getAllAvailable() {
      const task = {
        work: _bookingDAO.getAvailable,
        params: {},
      };
      return _queue.push(task);
    },
    async book({ roomName, companyName, event_start, event_end } = {}) {
      const task = {
        work: _bookingDAO.book,
        params: { roomName, companyName, event_start, event_end },
      };
      return _queue.push(task);
    },
    async cancle({ roomName, event_start, event_end } = {}) {
      const task = {
        work: _bookingDAO.cancle,
        params: { roomName, event_start, event_end },
      };
      return _queue.push(task);
    },
  };
};
