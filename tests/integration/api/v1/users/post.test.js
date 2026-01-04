import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator";
import user from "infra/model/user";
import password from "infra/model/password";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe('POST /api/v1/users', () => {
  describe('Anonymous user', () => {
    test("Creating a new user", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "testuser",
          email: "testuser@mail.com",
          password: "securepassword",
        })
      });
      const responseBody = await response.json();

      expect(response.status).toBe(201);
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "testuser",
        email: "testuser@mail.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const userInDatabase = await user.findOneByUsername("testuser");
      const correctPasswordMatch = await password.compare("securepassword", userInDatabase.password);
      const incorrectPasswordMatch = await password.compare("securepasswordd", userInDatabase.password);
      expect(correctPasswordMatch).toBe(true);
      expect(incorrectPasswordMatch).toBe(false);
    });

    test("With duplicated 'email'", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "duplicado",
          email: "duplicado@mail.com",
          password: "securepassword",
        })
      });
      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "duplicado2",
          email: "Duplicado@mail.com",
          password: "securepassword",
        })
      });
      const responseBody1 = await response1.json();
      const responseBody2 = await response2.json();

      expect(response1.status).toBe(201);
      expect(responseBody1).toEqual({
        id: responseBody1.id,
        username: "duplicado",
        email: "duplicado@mail.com",
        password: responseBody1.password,
        created_at: responseBody1.created_at,
        updated_at: responseBody1.updated_at,
      });
      expect(uuidVersion(responseBody1.id)).toBe(4);
      expect(Date.parse(responseBody1.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody1.updated_at)).not.toBeNaN();

      expect(response2.status).toBe(400);
      expect(responseBody2).toEqual({
        name: "ValidationError",
        message: "O email informado já está sendo usado",
        action: "Informe outro email para continuar",
        status_code: 400,
      });
    });

    test("With duplicated 'username'", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "validacao_duplicado",
          email: "username_duplicado@mail.com",
          password: "securepassword",
        })
      });
      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "Validacao_duplicado",
          email: "username_duplicado2@mail.com",
          password: "securepassword",
        })
      });
      const responseBody1 = await response1.json();
      const responseBody2 = await response2.json();

      expect(response1.status).toBe(201);
      expect(responseBody1).toEqual({
        id: responseBody1.id,
        username: "validacao_duplicado",
        email: "username_duplicado@mail.com",
        password: responseBody1.password,
        created_at: responseBody1.created_at,
        updated_at: responseBody1.updated_at,
      });
      expect(uuidVersion(responseBody1.id)).toBe(4);
      expect(Date.parse(responseBody1.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody1.updated_at)).not.toBeNaN();

      expect(response2.status).toBe(400);
      expect(responseBody2).toEqual({
        name: "ValidationError",
        message: "O username informado já está sendo usado",
        action: "Informe outro username para continuar",
        status_code: 400,
      });
    });
  });
});
