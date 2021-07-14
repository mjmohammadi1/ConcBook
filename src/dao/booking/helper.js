const { database } = require('../../db');
const { dateHelper } = require('../../utils');

const getUserReservations = async (companyName) => {
  const [{ userId }] = await database('user').select('id as userId').where('name', '=', companyName);
  const [{ RESCOUNT: userReservationCount }] = await database('reservation')
    .count('id as RESCOUNT')
    .where('user', '=', userId);
  return { userReservationCount, userId };
};

const getRoomInfo = async (roomName) => {
  return await database('room').select('availability', 'id').where('name', '=', roomName);
};

const getRoomReservations = async (roomId) => {
  return await database('reservation').select('event_start', 'event_end').where('room', '=', roomId);
};

const isWithinBusinessHours = (event_startHour, event_endHour, BEGIN_OF_BUSINESS_DAY, CLOSE_OF_BUSINESS_DAY) => {
  const validStartHour = BEGIN_OF_BUSINESS_DAY <= event_startHour && event_startHour <= CLOSE_OF_BUSINESS_DAY;
  const validEndHour = BEGIN_OF_BUSINESS_DAY <= event_endHour && event_endHour <= CLOSE_OF_BUSINESS_DAY;
  return validStartHour && validEndHour;
};

const isWithinReservationHoursLimit = (
  event_startHour,
  event_endHour,
  existingReservationHours,
  ROOM_AVAILABILITY_HOURS
) => {
  const requestedReservationHours = event_endHour - event_startHour;
  const totalReservationHours = existingReservationHours + requestedReservationHours;

  return totalReservationHours <= ROOM_AVAILABILITY_HOURS;
};

const isRoomBooked = (roomReservations, eventStartHour, eventEndHour) => {
  let overlap = false;
  if (roomReservations.length == 0) return overlap;

  roomReservations.forEach((reservation) => {
    let resStartHour = dateHelper.getHour(reservation.event_start);
    let resEndHour = dateHelper.getHour(reservation.event_end);

    if (
      (eventStartHour > resStartHour && eventStartHour >= resEndHour) ||
      (eventStartHour < resStartHour && eventEndHour <= resStartHour)
    ) {
      return;
    } else {
      overlap = true;
    }
  });
  return overlap;
};

const getAllRooms = async () => {
  return await database('room').select('id', 'name', 'availability');
};

const getAllRoomsReservations = async (rooms) => {
  return Promise.all(
    rooms.map(async (room) => {
      const { id: roomId, name: roomName } = room;
      let reservations = await getRoomReservations(roomId);
      return { roomName, roomId, reservations };
    })
  );
};
const getRoomsHourlyAvailabilities = (allRoomsReservations) => {
  return allRoomsReservations.map((room) => {
    const { roomId, roomName, reservations } = room;

    let reservedHours = room.reservations.reduce((accumulator, currentValue) => {
      let startHour = dateHelper.getHour(currentValue.event_start);
      let endHour = dateHelper.getHour(currentValue.event_end);

      return accumulator + (endHour - startHour);
    }, 0);
    return { roomId, roomName, reservedHours, reservations, availabilities: [] };
  });
};
const deleteReservation = async (roomId, event_startTS, event_endTS) => {
  return await database('reservation')
    .del()
    .where({ event_start: new Date(event_startTS), event_end: new Date(event_endTS), room: roomId });
};
module.exports = {
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
};
