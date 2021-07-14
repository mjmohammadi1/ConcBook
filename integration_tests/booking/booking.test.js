const { expect } = require('chai');
const { database } = require('../../src/db');

const { bookingService } = require('../../src/services');
const { getAllAvailable, book, cancle } = bookingService();

describe('booking service', () => {
  beforeEach(async () => {
    await database.migrate.latest();
    await database.seed.run();
  });
  afterEach(async () => {
    await database.migrate.rollback();
  });
  after(async () => {
    await database.destroy();
  });
  describe('getAllAvailable()', () => {
    it('should return all the available rooms', async () => {
      const rooms = await getAllAvailable();

      let allavilabilities = rooms.reduce((acc, element) => acc + element.availabilities.length, 0);
      expect(rooms.length).to.be.equal(20);
      expect(allavilabilities).to.be.equal(20);
    }),
      it('should return less number of avaiable rooms after some of them get fully reserved', async () => {
        const body = {
          roomName: 'C01',
          companyName: 'COKE',
          event_start: '09:00',
          event_end: '17:00',
        };
        const result = await book(body);
        const rooms = await getAllAvailable();

        let allavilabilities = rooms.reduce((acc, element) => acc + element.availabilities.length, 0);

        expect(rooms.length).to.be.equal(19);
        expect(allavilabilities).to.be.equal(19);
      });
  });
  describe('book()', () => {
    it('should successfully book a room', async () => {
      const body = {
        roomName: 'C02',
        companyName: 'COKE',
        event_start: '09:00',
        event_end: '17:00',
      };
      try {
        const result = await book(body);
        expect(result.message).to.be.equal('reservation created');
      } catch (err) {
        console.error(err.message);
      }
    });
    it('should not book a non-existing room', async () => {
      const body = {
        roomName: 'C12',
        companyName: 'COKE',
        event_start: '09:00',
        event_end: '17:00',
      };
      try {
        const result = await book(body);
      } catch (err) {
        expect(err.message).to.be.equal('Room Not Found');
        expect(err.code).to.be.equal(400);
      }
    }),
      it('should not book more than 10 reservations for a user', async () => {
        const body = {
          roomName: 'P01',
          companyName: 'PEPSI',
          event_start: '09:00',
          event_end: '17:00',
        };
        try {
          const reservation1 = await book(body);
          body.roomName = 'P02';
          const reservation2 = await book(body);
          body.roomName = 'P03';
          const reservation3 = await book(body);
          body.roomName = 'P04';
          const reservation4 = await book(body);
          body.roomName = 'P05';
          const reservation5 = await book(body);
          body.roomName = 'P06';
          const reservation6 = await book(body);
          body.roomName = 'P07';
          const reservation7 = await book(body);
          body.roomName = 'P08';
          const reservation8 = await book(body);
          body.roomName = 'P09';
          const reservation9 = await book(body);
          body.roomName = 'P10';
          const reservation10 = await book(body);
          body.roomName = 'C10';
          const reservation11 = await book(body);
        } catch (err) {
          expect(err.message).to.be.equal('You Reached The Maximum Reservation Limit');
          expect(err.code).to.be.equal(400);
        }
      }),
      it('should not book out of the business hours', async () => {
        const body = {
          roomName: 'C02',
          companyName: 'COKE',
          event_start: '09:00',
          event_end: '18:00',
        };
        try {
          const result = await book(body);
        } catch (err) {
          expect(err.message).to.be.equal('Invalid Business Hours');
          expect(err.code).to.be.equal(400);
        }
      }),
      it('should not book outside business hours', async () => {
        const body = {
          roomName: 'C01',
          companyName: 'COKE',
          event_start: '09:00',
          event_end: '18:00',
        };
        try {
          const [bookResult] = await book(body);
        } catch (err) {
          expect(err.message).to.be.equal('Invalid Business Hours');
          expect(err.code).to.be.equal(400);
        }
      }),
      it('should not book when room is already booked', async () => {
        const body = {
          roomName: 'C01',
          companyName: 'COKE',
          event_start: '09:00',
          event_end: '11:00',
        };
        try {
          const bookResult1 = await book(body);
          body.companyName = 'PEPSI';
          const bookResult2 = await book(body);
        } catch (err) {
          expect(err.message).to.be.equal('This Period is already booked');
          expect(err.code).to.be.equal(400);
        }
      }),
      it('should not book when there is an overlap in reservation period', async () => {
        const body = {
          roomName: 'C01',
          companyName: 'COKE',
          event_start: '09:00',
          event_end: '11:00',
        };
        try {
          const bookResult1 = await book(body);

          body.companyName = 'PEPSI';
          body.event_start = '13:00';
          body.event_end = '14:00';
          const bookResult2 = await book(body);

          body.companyName = 'PEPSI';
          body.event_start = '12:00';
          body.event_end = '15:00';

          const bookResult3 = await book(body);
        } catch (err) {
          expect(err.message).to.be.equal('This Period is already booked');
          expect(err.code).to.be.equal(400);
        }
      });
  });
  describe('cancle()', () => {
    it('should successfully cancle a booking', async () => {
      const body = {
        roomName: 'C02',
        companyName: 'COKE',
        event_start: '09:00',
        event_end: '17:00',
      };
      try {
        const bookResult = await book(body);
        const cancleResult = await cancle(body);

        expect(cancleResult.message).to.be.equal('successfully deleted');
      } catch (err) {
        console.error(err.message);
      }
    }),
      it('should not cancle a non-existing booking', async () => {
        const body = {
          roomName: 'C02',
          companyName: 'COKE',
          event_start: '09:00',
          event_end: '17:00',
        };
        try {
          const cancleResult = await cancle(body);
        } catch (err) {
          expect(err.message).to.be.equal('reservation not found');
          expect(err.code).to.be.equal(400);
        }
      });
  });
});
