import database from "infra/database";
import { ValidationError, NotFoundError } from "infra/errors";

async function create(payload) {
  await validateUniqueEmail(payload.email);
  await validateUsername(payload.username);

  const userCreated = await runInsertQuery(payload);
  return userCreated;

  async function validateUsername(username) {
    const data = await database.query({
      text: `
        SELECT username FROM users WHERE LOWER(username) = LOWER($1) LIMIT 1
      `,
      values: [username],
    });

    if (data.rowCount > 0) {
      throw new ValidationError({
        message: "O username informado já está sendo usado",
        action: "Informe outro username para continuar",
      });
    }
  }

  async function validateUniqueEmail(email) {
    const data = await database.query({
      text: `
        SELECT email FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1
      `,
      values: [email],
    });

    if (data.rowCount > 0) {
      throw new ValidationError({
        message: "O email informado já está sendo usado",
        action: "Informe outro email para continuar",
      });
    }
  }

  async function runInsertQuery(payload) {
    const data = await database.query({
      text: `
        INSERT INTO 
        users (username, email, password) 
        VALUES 
        ($1, $2, $3) 
        RETURNING *
      `,
      values: [payload.username, payload.email, payload.password],
    });

    return data.rows[0];
  }
}

async function findOneByUsername(username) {
  const user = await runSelectQuery(username);
  return user;

  async function runSelectQuery(username) {
    const data = await database.query({
      text: `
        SELECT * FROM users WHERE LOWER(username) = LOWER($1) LIMIT 1
      `,
      values: [username],
    });

    if (data.rowCount === 0) {
      throw new NotFoundError({
        message: "Usuário não encontrado",
        action: "Verifique o username informado e tente novamente",
      });
    }

    return data.rows[0];
  }
}

const user = {
  create,
  findOneByUsername,
}

export default user;
