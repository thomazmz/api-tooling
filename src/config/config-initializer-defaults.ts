import { DeepPartial, ValueObject } from "@thomazmz/core-context";

export type ConfigInitializerDefaults<Config extends ValueObject = any> = DeepPartial<Config>;