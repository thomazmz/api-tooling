import { ConfigLoader, ValueObject } from "@thomazmz/core-context";
import { ConfigInitializerProfile } from "./config-initializer-profile";
import { ConfigInitializerDefaults } from "./config-initializer-defaults";

export async function initializeConfigValues<C extends ValueObject>(
  configloader: ConfigLoader,
  configProfile: ConfigInitializerProfile<C>,
  configDefaults?: ConfigInitializerDefaults<C>
): Promise<C> {
  return Object.keys(configProfile).reduce(async (configObjectPromise, configProfileKey) => {
    const configObject = await configObjectPromise;

    const nestedProfile = configProfile[configProfileKey];

    const defaultValue = configDefaults?.[configProfileKey];

    if (!Array.isArray(nestedProfile)) {
      return { ...configObject, [configProfileKey]: await initializeConfigValues(
        configloader,
        nestedProfile,
        configDefaults,
        ),
      };
    }

    const [key, schema] = nestedProfile;

    const unparsedValue = await configloader?.load(key);

    if (!defaultValue && !unparsedValue) {
      throw new Error(`Could not load the environment variable ${key}.`);
    }

    const { value, error } = schema.validate(unparsedValue);

    if (!defaultValue && error) {
      throw new Error(`Could not parse the environment variable ${key}.`);
    }

    return { ...configObject, [configProfileKey]: value ?? defaultValue };
  }, {} as Promise<C>);
}
