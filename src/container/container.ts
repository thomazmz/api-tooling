import { AwilixContainer, InjectionModeType, asClass, asFunction, asValue, createContainer } from 'awilix';
import { Constructor } from '@thomazmz/core-context';

export class Container {

  private readonly initializationMetadata: {
    readonly initializer: () => Promise<Record<string, any>>
    readonly initializerKey: string
  }[] = []

  private readonly container: AwilixContainer

  constructor(injectionMode: InjectionModeType = 'CLASSIC') {
    this.container = createContainer({ injectionMode })
  }
  public buildClass<T>(classConstructor: Constructor): T {
    return this.container.build<T>(asClass(classConstructor))
  }

  public registerValue(registrationKey: string, registration: any) {
    this.container.register(registrationKey, asValue(registration))
  }

  public registerClass(registrationKey: string, registration: Constructor) {
    this.container.register(registrationKey, asClass(registration).transient())
  }

  public registerScopedClass(registrationKey: string, registration: Constructor) {
    this.container.register(registrationKey, asClass(registration).scoped())
  }

  public registerInitializer(initializerKey: string, initializer: () => Promise<Record<string, any>>) {
    this.initializationMetadata.push({ initializerKey, initializer })
  }

  public async initialize(): Promise<void> {
    for await (const { initializerKey, initializer } of this.initializationMetadata) {
      const initializedRecord = await this.container.build(asFunction(initializer))

      this.registerValue(initializerKey, initializedRecord)

      for (const recordKey of Object.keys(initializedRecord)) {
        this.registerValue(recordKey, initializedRecord[recordKey])
      }
    }
  }

  public registerContainer(sourceContainer: Container) {
    const initializationMetadata = sourceContainer.getInitializationMetadata()
    const registrationHash = sourceContainer.getRegistrations()

    for (const metadata of initializationMetadata) {
      this.initializationMetadata.push(metadata)
    }

    for (const [registrationKey, registrationResolver] of Object.entries(registrationHash)) {
      this.container.register(registrationKey, registrationResolver)
    }
  }

  public getInitializationMetadata() {
    return structuredClone(this.initializationMetadata)
  }

  public getRegistrations() {
    return this.container.registrations
  }
}
