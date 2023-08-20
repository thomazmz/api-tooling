import { JoiValidator } from '@thomazmz/joi-validator'
import { NextFunction, Request, Response } from 'express'
import { Schema } from 'joi'

export function createBodySchemaRequestHandler(schema: Schema) {
  const validator = new JoiValidator(schema)

  return (req: Request, _: Response, next: NextFunction) => {
    if(validator.assert(req.body)) {
      return next()
    }
  }
}