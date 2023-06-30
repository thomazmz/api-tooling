import { Request, Response } from "express";
import { functionUtils } from "@thomazmz/core-context";

export function createHandlerArgumentMapper(
  requestMethod: Function
): (request: Request, response: Response) => string[] {
  const functionArguments = functionUtils.extractArguments(requestMethod);
  return (request: Request, response: Response) => {
    return functionArguments.map((argumentIdentifier) => {
      return (
        {
          req: request,
          res: request,
          request: request,
          response: response,
          body: request.body,
          query: request.query,
          params: request.params,
        }[argumentIdentifier] ?? request.params[argumentIdentifier]
      );
    });
  };
}
