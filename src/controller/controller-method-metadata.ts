import { HttpMethod, Validator } from "@thomazmz/core-context";

export const METADATA_KEY = "metadata_key";

export type ControllerMethodMetadata = {
  key?: string;
  path?: string;
  method?: HttpMethod;
  bodyValidator?: Validator;
  name?: string;
  description?: string;
};
