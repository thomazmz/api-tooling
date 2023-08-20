
import { Schema } from 'joi';
import { HttpMethod } from '@thomazmz/core-context';
import { createBodySchemaRequestHandler } from './controller-request-handlers';
import { ControllerMethodDescriptor } from './controller-method-descriptor';
import { ControllerMethodMetadata } from './controller-method-metadata'

export function BodySchema(bodySchema: Schema) {
  return (_: any, key: string, descriptor: ControllerMethodDescriptor) => {
    return ControllerMethodMetadata.attach(descriptor, { 
      validationHandler: createBodySchemaRequestHandler(bodySchema)
    });
  };
}

export function Route(method: HttpMethod, path?: string) {
  return (_: any, key: string, descriptor: ControllerMethodDescriptor) => {
    return ControllerMethodMetadata.attach(descriptor, { method, path, key });
  };
}

export function RouteName(name: string) {
  return (_: any, key: string, descriptor: ControllerMethodDescriptor) => {
    return ControllerMethodMetadata.attach(descriptor, { name });
  };
}

export function RouteDescription(description: string) {
  return (_: any, key: string, descriptor: ControllerMethodDescriptor) => {
    return ControllerMethodMetadata.attach(descriptor, { description });
  };
}

export function GetRoute(path?: string) {
  return Route('get', path);
}

export function DeleteRoute(path?: string) {
  return Route('delete', path);
}

export function PatchRoute(path?: string) {
  return Route('patch', path);
}

export function PutRoute(path?: string) {
  return Route('patch', path);
}

export function PostRoute(path?: string) {
  return Route('post', path);
}
