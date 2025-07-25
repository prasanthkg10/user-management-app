import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

const userSchema = Joi.object({
  firstName: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().required(),
  lastName: Joi.string().min(1).max(100).required(),
  // Add other fields as needed
});

export function validateUser(req: Request, res: Response, next: NextFunction) {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}
