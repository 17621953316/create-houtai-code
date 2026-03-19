import Ajv from 'ajv'

const ajv = new Ajv({ allErrors: true })

/**
 * 校验页面配置是否符合 schema
 */
export function validateConfig(config, schema) {
  try {
    const validate = ajv.compile(schema)
    const valid = validate(config)
    if (!valid) {
      const errors = validate.errors.map((e) => `${e.instancePath || '/'} ${e.message}`)
      return { valid: false, errors }
    }
    return { valid: true }
  } catch (err) {
    return { valid: false, errors: [err.message] }
  }
}
