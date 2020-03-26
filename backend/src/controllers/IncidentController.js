const connection = require('../database/connection')

module.exports = {
  async index(request, response) {
    const { page = 1 } = request.query

    const [count] = await connection('incidents').count()   // retorna um array como resultado

    console.log(count)

    const incidents = await connection('incidents')
      .join('ongs', 'ongs.id', '=', 'incidents.ongID')
      .limit(5)                   // numero de registos a serem retornados
      .offset((page - 1) * 5)     // numero de registo a percorrer antes de retornar os registos
      .select([
        'incidents.*',
        'ongs.name',
        'ongs.email',
        'ongs.whatsapp',
        'ongs.city',
        'ongs.uf',
      ])

    response.header('X-Total-Count', count['count(*)'])

    return response.json(incidents)
  },

  async create(request, response) {
    const { title, description, value } = request.body
    const ongID = request.headers.authorization

    const [id] = await connection('incidents').insert({
      title,
      description,
      value,
      ongID,
    })
    return response.json({ id })
  },

  async delete(request, response) {
    const { id } = request.params
    const ongID = request.headers.authorization

    const incident = await connection('incidents')
      .where('id', id)
      .select('ongID')
      .first()

      if (incident.ongID !== ongID) {
        return response.status(401).json({ error: 'Operation not permitted.' })
      }

      await connection('incidents').where('id', id).delete()

      return response.status(204).send()
  }
}