import { InternalServerError, MethodNotAllowedError, ValidationError, NotFoundError } from "infra/errors";

export function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  console.error(publicErrorObject);

  return response.status(405).json(publicErrorObject);
}

export function onErrorHandler(error, request, response) {
  if (error instanceof ValidationError || error instanceof NotFoundError) {
    return response.status(error.statusCode).json(error);
  }

  const publicErrorObject = new InternalServerError({
    cause: error,
    statusCode: error.statusCode,
  });
  console.error(publicErrorObject);

  return response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

const controller = {
  errorsHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  }
}

export default controller;
