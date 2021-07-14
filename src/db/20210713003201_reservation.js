exports.up = function (knex) {
  return knex.schema.createTable('reservation', (table) => {
    table.increments('id');
    table.integer('user').notNullable().references('user.id');
    table.integer('room').notNullable().references('room.id');
    table.timestamp('event_start').notNullable();
    table.timestamp('event_end').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('reservation');
};
