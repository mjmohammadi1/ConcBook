exports.up = function (knex) {
  return knex.schema.createTable('room', (table) => {
    table.increments('id');
    table.string('name').notNullable().unique();
    table.integer('availability').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('room');
};
