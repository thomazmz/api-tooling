import { Request, Handler, NextFunction } from "express";
import { Validator } from "@thomazmz/core-context";

export function createRequestValidationHandler(
  validator: Validator,
  requestKey: string
): Handler {
  return (request: Request, _, next: NextFunction) => {
    if (validator.assert(request[requestKey])) {
      next();
    }
  };
}

export function createBodyValidationHandler(validator: Validator): Handler {
  return createRequestValidationHandler(validator, "body");
}
