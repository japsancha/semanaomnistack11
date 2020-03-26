const connection = require('../database/connection')

module.exports = {
  async index(request, response) {
    const ongID = request.headers.authorization

    const incidents = await connection('incidents')
      .where('ongID', ongID)
      .select('*')

    return response.json(incidents)
  }
}