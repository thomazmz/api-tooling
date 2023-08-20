import { DeepReplace, Value, ValueObject } from '@thomazmz/core-context'
import { Schema } from 'joi'

export type ConfigProfile<C extends ValueObject> = DeepReplace<C, [string, Schema, Value?]>
