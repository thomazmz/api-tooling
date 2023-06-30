import { HttpMethod, Function, Validator } from '@thomazmz/core-context';
import { attachControllerMethodMetadata } from './controller-metadata-utils';
import { ControllerMethodDescriptor } from './controller-method-descriptor';

// ISSUE#34: Implement ControllerName decorator
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ControllerName(name: string) {
  return (target: Function): Function => {
    return target;
  };
}

// ISSUE#35: Implement ControllerDescription decorator
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ControllerDescription(description: string) {
  return (target: Function): Function => {
    return target;
  };
}

export function BodyValidator(bodyValidator: Validator) {
  return (_: any, key: string, descriptor: ControllerMethodDescriptor) => {
    return attachControllerMethodMetadata(descriptor, { key, bodyValidator });
  };
}

export function Route(method: HttpMethod, path?: string) {
  return (_: any, key: string, descriptor: ControllerMethodDescriptor) => {
    return attachControllerMethodMetadata(descriptor, { method, path, key });
  };
}

export function RouteName(name: string) {
  return (_: any, key: string, descriptor: ControllerMethodDescriptor) => {
    return attachControllerMethodMetadata(descriptor, { name });
  };
}

export function RouteDescription(description: string) {
  return (_: any, key: string, descriptor: ControllerMethodDescriptor) => {
    return attachControllerMethodMetadata(descriptor, { description });
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
