const convertUnixTS = (eventTime) => {
  let dateObj = new Date();

  let date = ('0' + dateObj.getDate()).slice(-2);
  let month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
  let year = dateObj.getFullYear();

  const timeStamped = Date.parse(year + '-' + month + '-' + date + 'T' + eventTime + ':00');
  return timeStamped;
};

const getHour = (unixTimeStamp) => {
  const date = new Date(unixTimeStamp);
  const hour = date.getHours();
  return hour;
};

module.exports = { convertUnixTS, getHour };
