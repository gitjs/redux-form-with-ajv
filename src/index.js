import Ajv from 'ajv';
import AjvErrors from 'ajv-errors';
import objectPath from 'object-path';

const ajv = new AjvErrors(new Ajv({
  allErrors: true,
  verbose: true,              // to have information about the error.parentSchema
  useDefaults: true,          // e.g.to may have default empty array
  jsonPointers: true          // e.g. /members/0
}), {keepErrors: false});

export default (schema, values) => {
  return (values) => {
    let errors = {};
    const validate = ajv.compile(schema);
    const valid = validate(values);

    if (!valid) {
      validate.errors.forEach((_error) => {
        const error = _error.params.errors ? _error.params.errors[0] : _error;

        let rootPath = error.dataPath;
        let property = error.params.missingProperty ? '/' + error.params.missingProperty : '';
        let fullPath = (rootPath + property).replace(/\//g, '.').substring(1);

        if (error.parentSchema && error.parentSchema.type === 'array') {
          fullPath += '._error';
        }

        let message = _error.message;

        objectPath.set(errors, fullPath, message);
      });
    }

    return errors;
  }
}
