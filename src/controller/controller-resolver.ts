import * as Express from 'express';
import { Container } from '../container'
import { ControllerMethodMetadata } from './controller-method-metadata'
import { Constructor, HttpOk } from '@thomazmz/core-context';
import { FunctionUtils } from '@thomazmz/core-utils';

export class ControllerResolver {

  constructor(
    private readonly container: Container
  ) {}

  public resolveControllerHandler(controllerClass: Constructor): Express.RequestHandler {
    return this.resolveControllerRouter(controllerClass)
  }

  public resolveControllerRouter<C extends any>(controllerClass: Constructor<C>): Express.Router { 
    const controllerInstance = this.container.buildClass<C>(controllerClass)

    const propertyDescriptors = Object.getOwnPropertyDescriptors(controllerClass.prototype)

    const controllerRouterMetadata = Object.values(propertyDescriptors).reduce((acc, methodDescriptor) => {
      const routeMetadata = ControllerMethodMetadata.extract(methodDescriptor)
      return routeMetadata ? [...acc, routeMetadata] : acc
    }, [] as ControllerMethodMetadata[])

    return controllerRouterMetadata.reduce((router, routeMetadata) => {
      const { key, path, method } = routeMetadata;

      if (!path || !method || !key || typeof controllerInstance[key] !== 'function') {
        return router;
      }

      return router[method](path, this.createRequestHandler(controllerInstance[key]));
    }, Express.Router())
  }

  private createRequestHandler(controllerMethod: Function): Express.RequestHandler {
    const argumentMapper = this.createRequestHandlerArgumentMapper(controllerMethod)
    return function routeHandler(request: Express.Request, response: Express.Response, next:  Express.NextFunction) {
      const requestArguments = argumentMapper(request, response)
      Promise.resolve(controllerMethod(...requestArguments))
        .then(result => response.status(HttpOk.code).send(result))
        .catch(next)
    }
  }
  
  private createRequestHandlerArgumentMapper(requestMethod: Function): (request: Express.Request, response: Express.Response) => string[] {
    return (request: Express.Request, response: Express.Response) => {
      return FunctionUtils.extractArguments(requestMethod).map((argumentIdentifier: string) => {
        return {
          req: request,
          res: request,
          request: request,
          response: response,
          body: request.body,
          query: request.query,
          params: request.params,
        }[argumentIdentifier] ?? request.params[argumentIdentifier]
      })
    }
  }
}
