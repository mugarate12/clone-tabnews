export class InternalServerError extends Error {
  constructor({ message = "Um erro interno não esperado aconteceu", cause = null, statusCode = 500 } = {}) {
    super(message);

    this.name = "InternalServerError";
    this.cause = cause;
    this.action = "Entre em contato com o suporte ou tente novamente mais tarde.";
    this.statusCode = statusCode;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    }
  }
}

export class MethodNotAllowedError extends Error {
  constructor() {
    super("Método não permitido para este endpoint");

    this.name = "MethodNotAllowedError";
    this.action = "Verifique se o método HTTP enviado é válido para este endpoint";
    this.statusCode = 405;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    }
  }
}

export class ServiceError extends Error {
  constructor({ message = "Serviço indisponível no momento", cause = null } = {}) {
    super(message);

    this.name = "ServiceError";
    this.cause = cause;
    this.action = "Verifique se o serviço está disponível ou tente novamente mais tarde.";
    this.statusCode = 503;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    }
  }
}
