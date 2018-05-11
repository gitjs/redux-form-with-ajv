import Ajv from 'ajv';
import set from 'lodash.set';
import objectAssign from 'object-assign';

const options = {
  allErrors: true,
  verbose: true // to have information about the error.parentSchema
};

const ajv = new Ajv(options);
const errorMessage = error => error.message;
const localize = errors => errors;

export default (schema, options = {}) => {
  options = objectAssign({ ajv, errorMessage, localize }, options);

  return values => {
    const errors = {};
    const validate = options.ajv.compile(schema);
    const valid = validate(values.toJS ? values.toJS() : values);

    if (!valid) {
      options.localize(validate.errors);

      validate.errors.forEach(_error => {
        const error = _error.params.errors ? _error.params.errors[0] : _error;

        const rootPath = error.dataPath;
        const property = error.params.missingProperty ? `/${error.params.missingProperty}` : '';
        let fullPath = `${rootPath}${property}`.replace(/\//g, '.').substring(1);

        if (error.parentSchema && error.parentSchema.type === 'array') {
          fullPath += '._error';
        }

        const message = options.errorMessage(_error);

        set(errors, fullPath, message);
      });
    }
    return errors;
  };
};
