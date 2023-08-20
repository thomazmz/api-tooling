import { HttpMethod } from '@thomazmz/core-context';
import { RequestHandler } from 'express';
import { ControllerMethodDescriptor } from './controller-method-descriptor';

export class ControllerMethodMetadata {

  public static readonly METADATA_KEY = 'controllerMetadata'

  private constructor() {}

  public readonly key?: string;

  public readonly path?: string;

  public readonly method?: HttpMethod;

  public readonly name?: string;

  public readonly description?: string;

  public readonly validationHandler?: RequestHandler;

  public static attach(
    descriptor: ControllerMethodDescriptor,
    metadata: ControllerMethodMetadata,
  ): ControllerMethodDescriptor {
    if (descriptor.value) {
      const currentMetatada: ControllerMethodMetadata = descriptor.value?.[ControllerMethodMetadata.METADATA_KEY] ?? {};
  
      descriptor.value[ControllerMethodMetadata.METADATA_KEY] = {
        key: metadata.key ?? currentMetatada.key,
        name: metadata.name ?? currentMetatada.name,
        path: metadata.path ?? currentMetatada.path,
        method: metadata.method ?? currentMetatada.method,
        description: metadata.description ?? currentMetatada.description,
        validationHandler: metadata.validationHandler ?? currentMetatada.validationHandler,
      };
    }

    return descriptor
  }

  public static extract(
    descriptor: ControllerMethodDescriptor
  ): ControllerMethodMetadata {
    if (descriptor.value && descriptor.value[ControllerMethodMetadata.METADATA_KEY]) {
      return {
        key: descriptor.value[ControllerMethodMetadata.METADATA_KEY]?.key,
        name: descriptor.value[ControllerMethodMetadata.METADATA_KEY]?.name,
        path: descriptor.value[ControllerMethodMetadata.METADATA_KEY]?.path,
        method: descriptor.value[ControllerMethodMetadata.METADATA_KEY]?.method,
        description: descriptor.value[ControllerMethodMetadata.METADATA_KEY]?.description,
        validationHandler: descriptor.value[ControllerMethodMetadata.METADATA_KEY]?.validationHandler
      };
    }

    return {}
  }
}
