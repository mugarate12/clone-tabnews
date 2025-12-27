import { InternalServerError, MethodNotAllowedError } from "infra/errors";

export function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  console.error(publicErrorObject);

  return response.status(405).json(publicErrorObject);
}

export function onErrorHandler(error, request, response) {
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
