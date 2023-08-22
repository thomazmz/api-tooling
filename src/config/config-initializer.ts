import { ConfigLoader, ValueObject } from "@thomazmz/core-context";
import { ConfigInitializerProfile } from "./config-initializer-profile";
import { ConfigInitializerDefaults } from "./config-initializer-defaults";

export async function initializeConfigValues<C extends ValueObject>(
  configloader: ConfigLoader,
  configProfile: ConfigInitializerProfile<C>,
  configDefaults?: ConfigInitializerDefaults<C>
): Promise<C> {
  return Object.keys(configProfile).reduce(
    async (configObjectPromise, configProfileKey) => {
      const configObject = await configObjectPromise;

      const nestedProfile = configProfile[
        configProfileKey
      ] as ConfigInitializerProfile;

      // As the generic type C[key] does not have predefined
      // depth and ConfigInitializerDefaults is a recursive
      // type, parsing configDefaults to unkown and then cast
      // it back to ConfigInitializerDefaults is a way to get
      // around the recursive type instantiation limit defined
      // by TypeScript.
      const nestedDefaults = (configDefaults as unknown)?.[
        configProfileKey
      ] as ConfigInitializerDefaults;

      if (!Array.isArray(nestedProfile)) {
        return {
          ...configObject,
          [configProfileKey]: await initializeConfigValues(
            configloader,
            nestedProfile,
            nestedDefaults
          ),
        };
      }

      const [key, schema] = nestedProfile;

      const unparsedValue = await configloader?.load(key);

      if (!nestedDefaults && !unparsedValue) {
        throw new Error(`Could not load the environment variable ${key}.`);
      }

      const { value, error } = schema.validate(unparsedValue);

      if (!nestedDefaults && error) {
        throw new Error(`Could not parse the environment variable ${key}.`);
      }

      return { ...configObject, [configProfileKey]: value ?? nestedDefaults };
    },
    {} as Promise<C>
  );
}
