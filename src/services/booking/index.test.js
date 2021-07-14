const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

const roomService = require('./index');
const resource = [
  {
    roomName: 'C01',
    availabilities: [['9-17']],
  },
  {
    roomName: 'C02',
    availabilities: [['9-17']],
  },
  {
    roomName: 'C03',
    availabilities: [['9-17']],
  },
  {
    roomName: 'C04',
    availabilities: [['9-17']],
  },
  {
    roomName: 'C05',
    availabilities: [['9-17']],
  },
  {
    roomName: 'C06',
    availabilities: [['9-17']],
  },
  {
    roomName: 'C07',
    availabilities: [['9-17']],
  },
  {
    roomName: 'C08',
    availabilities: [['9-17']],
  },
  {
    roomName: 'C09',
    availabilities: [['9-17']],
  },
  {
    roomName: 'C10',
    availabilities: [['9-17']],
  },
  {
    roomName: 'P01',
    availabilities: [['9-17']],
  },
  {
    roomName: 'P02',
    availabilities: [['9-17']],
  },
  {
    roomName: 'P03',
    availabilities: [['9-17']],
  },
  {
    roomName: 'P04',
    availabilities: [['9-17']],
  },
  {
    roomName: 'P05',
    availabilities: [['9-17']],
  },
  {
    roomName: 'P06',
    availabilities: [['9-17']],
  },
  {
    roomName: 'P07',
    availabilities: [['9-17']],
  },
  {
    roomName: 'P08',
    availabilities: [['9-17']],
  },
  {
    roomName: 'P09',
    availabilities: [['9-17']],
  },
  {
    roomName: 'P10',
    availabilities: [['9-17']],
  },
];

describe('booking service', () => {
  it('should return get all the available rooms', async () => {
    let _bookingDAO = {
      async getAvailable() {},
    };
    let _queue = {
      async push() {},
    };
    sinon.stub(_bookingDAO, 'getAvailable').resolves(resource);
    sinon.stub(_queue, 'push').resolves(_bookingDAO.getAvailable());
    const res = await roomService({ _queue, _bookingDAO }).getAllAvailable();
    expect(res).equal(resource);
    expect(_queue.push).to.have.been.called;
    expect(_bookingDAO.getAvailable).to.have.been.called;
  }),
    it('should successfully book a room', async () => {
      let _bookingDAO = {
        async book({ roomName, companyName }) {},
      };
      let _queue = {
        async push() {},
      };
      const result = { message: 'reservation created' };
      const params = {
        roomName: 'C01',
        companyName: 'PEPSI',
      };
      sinon.stub(_bookingDAO, 'book').resolves(result);
      sinon.stub(_queue, 'push').resolves(_bookingDAO.book(params));
      const res = await roomService({ _queue, _bookingDAO }).book(params);
      expect(res.message).equal(result.message);
      expect(_queue.push).to.have.been.called;
      expect(_bookingDAO.book).to.have.been.called;
    }),
    it('should successfully cancle booking', async () => {
      let _bookingDAO = {
        async cancle({ roomName, companyName, event_start, event_end }) {},
      };
      let _queue = {
        async push() {},
      };
      const params = {
        roomName: 'C01',
        companyName: 'PEPSI',
        event_start: '09:00',
        event_end: '12:00',
      };
      sinon.stub(_bookingDAO, 'cancle').resolves({ message: 'successfully deleted' });
      sinon.stub(_queue, 'push').resolves(_bookingDAO.cancle(params));
      const result = await roomService({ _queue, _bookingDAO }).cancle(params);
      expect(_queue.push).to.have.been.called;
      expect(_bookingDAO.cancle).to.have.been.called;
      expect(result.message).to.equal('successfully deleted');
    });
});
