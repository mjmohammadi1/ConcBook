const { database } = require('../../db');
const { dateHelper, constants } = require('../../utils');
const {
  getUserReservations,
  getRoomInfo,
  getRoomReservations,
  isWithinBusinessHours,
  isWithinReservationHoursLimit,
  isRoomBooked,
  getAllRooms,
  getAllRoomsReservations,
  getRoomsHourlyAvailabilities,
  deleteReservation,
} = require('./helper');
const { ApiError } = require('../../utils/index');

const { RESERVATION_LIMIT, ROOM_AVAILABILITY_HOURS, BEGIN_OF_BUSINESS_DAY, CLOSE_OF_BUSINESS_DAY } = constants;
const create = async ({ name, availability } = {}) => {
  const result = await database('room').insert({ name, availability }).returning('*');
  return result;
};

const book = async ({ roomName, companyName, event_start, event_end } = {}) => {
  const { userReservationCount, userId } = await getUserReservations(companyName);

  if (userReservationCount >= RESERVATION_LIMIT) {
    throw ApiError.badRequest('You Reached The Maximum Reservation Limit');
  }

  const [room] = await getRoomInfo(roomName);

  if (typeof room === 'undefined') {
    throw ApiError.badRequest('Room Not Found');
  }
  const { availability: roomAvaHrs, id: roomId } = room;

  const roomReservations = await getRoomReservations(roomId);
  const existingReservationHours = roomReservations.reduce((accumulator, currentValue) => {
    let startHour = dateHelper.getHour(currentValue.event_start);
    let endHour = dateHelper.getHour(currentValue.event_end);

    return accumulator + (endHour - startHour);
  }, 0);

  const event_startTS = dateHelper.convertUnixTS(event_start);
  const event_endTS = dateHelper.convertUnixTS(event_end);

  const event_endHour = dateHelper.getHour(event_endTS);
  const event_startHour = dateHelper.getHour(event_startTS);

  if (event_startHour > event_endHour) {
    throw ApiError.badRequest('Invalid Booking Hours');
  }

  if (isWithinBusinessHours(event_startHour, event_endHour, BEGIN_OF_BUSINESS_DAY, CLOSE_OF_BUSINESS_DAY) === false) {
    throw ApiError.badRequest('Invalid Business Hours');
  }

  if (
    isWithinReservationHoursLimit(event_startHour, event_endHour, existingReservationHours, ROOM_AVAILABILITY_HOURS) ===
    false
  ) {
    throw ApiError.badRequest('You Can Only Book 8 Hours Per Day');
  }

  const roomBooked = isRoomBooked(roomReservations, event_startHour, event_endHour);
  if (roomBooked) {
    throw ApiError.badRequest('This Period is already booked');
  }
  const reservationResult = await database('reservation').insert({
    user: userId,
    room: roomId,
    event_start: new Date(event_startTS),
    event_end: new Date(event_endTS),
  });

  return { message: 'reservation created' };
};
const cancle = async ({ roomName, event_start, event_end }) => {
  const [{ id: roomId }] = await getRoomInfo(roomName);
  const event_startTS = dateHelper.convertUnixTS(event_start);
  const event_endTS = dateHelper.convertUnixTS(event_end);

  const result = await deleteReservation(roomId, event_startTS, event_endTS);

  if (result > 0) return { message: 'successfully deleted' };
  else throw ApiError.badRequest('reservation not found');
};

const getAvailable = async () => {
  const rooms = await getAllRooms();

  const roomsReservations = await getAllRoomsReservations(rooms);

  const roomsHourlyAvailabilities = getRoomsHourlyAvailabilities(roomsReservations);

  const roomsWithAvailabilities = roomsHourlyAvailabilities.filter(
    (room) => room.reservedHours !== ROOM_AVAILABILITY_HOURS
  );

  const roomsWithCalculatedAvailabilities = roomsWithAvailabilities.map((room) => {
    const { roomName } = room;

    if (room.reservedHours == 0) room.availabilities.push([`${BEGIN_OF_BUSINESS_DAY}-${CLOSE_OF_BUSINESS_DAY}`]);

    let bookedHours = room.reservations.map((res) => {
      let startHour = dateHelper.getHour(res.event_start);
      let endHour = dateHelper.getHour(res.event_end);
      return [startHour, endHour];
    });

    bookedHours.sort(([a, b], [c, d]) => b - d);

    bookedHours.flatMap((current, index, array) => {
      if (index == 0 && array[index][0] > BEGIN_OF_BUSINESS_DAY)
        room.availabilities.push([`${BEGIN_OF_BUSINESS_DAY}-${current[0]}`]);

      if (!(array[index + 1] === undefined) && array[index + 1][0] - current[1] >= 1)
        room.availabilities.push([`${current[1]}-${array[index + 1][0]}`]);

      if (array[index + 1] === undefined && array[index][1] < CLOSE_OF_BUSINESS_DAY)
        room.availabilities.push([`${current[1]}-${CLOSE_OF_BUSINESS_DAY}`]);
    });

    const { availabilities } = room;
    return { roomName, availabilities };
  });
  return roomsWithCalculatedAvailabilities;
};

module.exports = {
  create,
  book,
  cancle,
  getAvailable,
};
