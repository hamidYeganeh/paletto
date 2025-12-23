import * as Joi from "joi";

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  PORT: Joi.number().default(5000),
  APP_NAME: Joi.string().default("Nest Application"),
  MONGO_URI: Joi.string().uri().required(),
    JWT_SECRET: Joi.string().min(32).required(),
    JWT_EXPIRES: Joi.string().default("7d"),
  //   JWT_ISSUER: Joi.string().default("nest-app"),
  //   JWT_AUDIENCE: Joi.string().optional(),
});
