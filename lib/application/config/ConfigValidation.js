import Joi from "joi"

const configSchemaObject = {
  mode: Joi.string()
    .optional()
    .valid("development", "production")
    .default("development"),
  root: Joi.string().optional().default(process.cwd()),
  serverPath: Joi.string().optional().default("src/backend"),
  clientPath: Joi.string().optional().default("src/frontend"),
  outDir: Joi.string().optional().default("statics/dist"),
  publicDir: Joi.string().optional().default("public"),
  port: Joi.number().optional().min(1).max(65535).default(3000),
  viteConfig: Joi.object().optional(),
  viteConfigFile: Joi.string().optional(),
}

export async function validateConfig(configInput) {
  const configJoiSchema = Joi.object(configSchemaObject)
  return configJoiValidation(configJoiSchema, configInput)
}
async function configJoiValidation(configJoiSchema, configInput) {
  try {
    const validation = await configJoiSchema.validateAsync(configInput)
    return { input: validation }
  } catch (error) {
    return { error }
  }
}
