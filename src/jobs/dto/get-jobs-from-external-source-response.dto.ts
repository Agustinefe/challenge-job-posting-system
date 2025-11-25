import Joi from 'joi';

export type GetJobsFromExternalSourceResponse = {
  [k: string]: [string, number, string][];
};

export const GetJobsFromExternalSourceResponseSchema = Joi.object().pattern(
  Joi.string(),
  Joi.array().items(
    Joi.array()
      .length(3)
      .ordered(
        Joi.string().required(),
        Joi.number().required(),
        Joi.string().required(),
      ),
  ),
);
