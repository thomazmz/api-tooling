import { Constructor } from "@thomazmz/core-context";
import { ControllerMethodDescriptor } from "./controller-method-descriptor";
import { ControllerMethodMetadata } from "./controller-method-metadata";

export function attachControllerMethodMetadata(
  methodDescriptor: ControllerMethodDescriptor,
  descriptorMetadata?: ControllerMethodMetadata
): ControllerMethodDescriptor {
  if (methodDescriptor.value) {
    const currentDesciptor =
      methodDescriptor.value?.["controller_metadata"] ?? {};
    const newDescriptor = descriptorMetadata ?? {};

    methodDescriptor.value["controller_metadata"] = {
      key: newDescriptor.key ?? currentDesciptor.key,
      path: newDescriptor.path ?? currentDesciptor.path,
      method: newDescriptor.method ?? currentDesciptor.method,
      bodyValidator:
        newDescriptor.bodyValidator ?? currentDesciptor.bodyValidator,
      name: newDescriptor.name ?? currentDesciptor.name,
      description: newDescriptor.description ?? currentDesciptor.description,
    };
  }

  return methodDescriptor;
}

export function extractControllerMethodMetadata(
  methodDescriptor: ControllerMethodDescriptor
): ControllerMethodMetadata | void {
  if (methodDescriptor.value && methodDescriptor.value["controller_metadata"]) {
    return {
      key: methodDescriptor.value["controller_metadata"].key,
      path: methodDescriptor.value["controller_metadata"].path,
      method: methodDescriptor.value["controller_metadata"].method,
      bodyValidator:
        methodDescriptor.value["controller_metadata"].bodyValidator,
    };
  }
}

export function extractControllerMetadata(
  controllerClass: Constructor
): ControllerMethodMetadata[] {
  const controllerDescriptors = Object.values(
    Object.getOwnPropertyDescriptors(controllerClass.prototype)
  );
  return controllerDescriptors.reduce((acc, methodDescriptor) => {
    const routeMetadata = extractControllerMethodMetadata(methodDescriptor);
    return routeMetadata ? [...acc, routeMetadata] : acc;
  }, []);
}
