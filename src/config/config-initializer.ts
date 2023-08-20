import { ConfigLoader, ValueObject } from '@thomazmz/core-context'
import { ConfigProfile } from './config-profile'

export async function initializeConfigValues<C extends ValueObject>(
  configProfile: ConfigProfile<C>,
  configloader: ConfigLoader,
  configDefautls?: ValueObject,
): Promise<C> {

  return Object.keys(configProfile).reduce(async (accPromise, profileKey) => {
    const acc = await accPromise

    const nestedProfile = configProfile[profileKey]

    const defaultValue = configDefautls?.[profileKey]

    if (!Array.isArray(nestedProfile)) {
      return { ...acc, [profileKey]: await initializeConfigValues(nestedProfile, configloader, configDefautls) }
    }

    const [key, schema] = nestedProfile

    const unparsedValue = await configloader?.load(key)

    if (!defaultValue && !unparsedValue) {
      throw new Error(`Could not load the environment variable ${key}.`)
    }

    const { value, error } = schema.validate(unparsedValue)

    if (!defaultValue && error) {
      throw new Error(`Could not parse the environment variable ${key}.`)
    }

    return { ...acc, [profileKey]: value ?? defaultValue }

  }, {} as Promise<C>)
}
