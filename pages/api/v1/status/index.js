import database from '../../../../infra/database';

async function status(request, response) {
  const result = await database.query('SELECT 1 + 1 as SUM');

  return response.status(200).json({ status: 'ok' });
}

export default status;
