import { Request, Response, NextFunction, Handler } from "express";
import { createHandlerArgumentMapper } from "./create-handler-argument-mapper";

export function createRequestHandler<C extends Record<string, Function>>(
  entity: C,
  key: keyof C
): Handler {
  const argumentMapper = createHandlerArgumentMapper(entity[key]);
  return function routeHandler(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const argumentMap = argumentMapper(request, response);
    Promise.resolve(entity[key](...argumentMap))
      .then((result) => {
        response.status(200).send(result);
      })
      .catch(next);
  };
}
