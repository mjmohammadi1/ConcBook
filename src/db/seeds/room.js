exports.seed = function (knex) {
  return knex('room')
    .del()
    .then(function () {
      return knex('room').insert([
        { name: 'C01', availability: 8 },
        { name: 'C02', availability: 8 },
        { name: 'C03', availability: 8 },
        { name: 'C04', availability: 8 },
        { name: 'C05', availability: 8 },
        { name: 'C06', availability: 8 },
        { name: 'C07', availability: 8 },
        { name: 'C08', availability: 8 },
        { name: 'C09', availability: 8 },
        { name: 'C10', availability: 8 },
        { name: 'P01', availability: 8 },
        { name: 'P02', availability: 8 },
        { name: 'P03', availability: 8 },
        { name: 'P04', availability: 8 },
        { name: 'P05', availability: 8 },
        { name: 'P06', availability: 8 },
        { name: 'P07', availability: 8 },
        { name: 'P08', availability: 8 },
        { name: 'P09', availability: 8 },
        { name: 'P10', availability: 8 },
      ]);
    });
};
