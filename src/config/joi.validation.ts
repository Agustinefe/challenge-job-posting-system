import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_HOST: Joi.string().hostname().required(),
  DB_PORT: Joi.number().port().required(),
  DB_USERNAME: Joi.string().required(),
  JOBBERWOCKY_EXTERNAL_SOURCE_URL: Joi.string().required(),
  CACHE_TTL: Joi.number().required(),
  PORT: Joi.number().required(),
});

export const EnvNames = {
  DB_PASSWORD: 'DB_PASSWORD',
  DB_NAME: 'DB_NAME',
  DB_HOST: 'DB_HOST',
  DB_PORT: 'DB_PORT',
  DB_USERNAME: 'DB_USERNAME',
  JOBBERWOCKY_EXTERNAL_SOURCE_URL: 'JOBBERWOCKY_EXTERNAL_SOURCE_URL',
  CACHE_TTL: 'CACHE_TTL',
  PORT: 'PORT',
};
