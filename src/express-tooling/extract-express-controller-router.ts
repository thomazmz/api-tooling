import cors from "cors";
import { json } from "body-parser";
import { Router } from "express";
import { Constructor } from "@thomazmz/core-context";
import {
  ControllerMethodMetadata,
  extractControllerMetadata,
} from "controller";
import { createBodyValidationHandler } from "./create-express-validation-handler";
import { createRequestHandler } from "./create-express-request-handler";

export function extractControllerRouter<C>(
  classConstructor: Constructor<C>,
  classEntity?: C
): Router {
  if (!classEntity) {
    return extractControllerRouter(classConstructor, new classConstructor());
  }

  const controllerRouterMetadata = extractControllerMetadata(classConstructor);

  return controllerRouterMetadata.reduce(
    (router: Router, routeMetadata: ControllerMethodMetadata) => {
      const { key, path, method, bodyValidator } = routeMetadata;

      if (!path || !method || !key) {
        return router;
      }

      const requestHandler = createRequestHandler(classEntity, key as keyof C);

      const requestValidators = [
        ...(bodyValidator ? [createBodyValidationHandler(bodyValidator)] : []),
      ];

      const defaultHandlers = [cors(), json()];

      return router[method](
        path,
        defaultHandlers,
        requestValidators,
        requestHandler
      );
    },
    Router()
  );
}
