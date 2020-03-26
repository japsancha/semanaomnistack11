
exports.up = function(knex) {
  return knex.schema.createTable('incidents', function (table) {
    table.increments('id')

    table.string('title').notNullable()
    table.string('description').notNullable()
    table.decimal('value').notNullable()

    table.string('ongID').notNullable()
    
    table.foreign('ongID').references('id').inTable('ongs')
})
};

exports.down = function(knex) {
  return knex.schema.dropTable('incidents')
};
