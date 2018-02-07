import Ajv from 'ajv';
import AjvErrors from 'ajv-errors';
import set from 'lodash.set'
import objectAssign from 'object-assign';

const ajvOptions = {
  allErrors: true,
  verbose: true, // to have information about the error.parentSchema
  useDefaults: true, // e.g.to may have default empty array
  jsonPointers: true // -> /members/0
};

const ajvErrorsOptions = { keepErrors: false };

const ajvWithErrors = new AjvErrors(new Ajv(ajvOptions), ajvErrorsOptions);
const errorMessage = error => error.message;

export default (schema, options = {}) => {
  options = objectAssign({ ajv: ajvWithErrors, errorMessage }, options);

  return values => {
    const errors = {};
    const validate = options.ajv.compile(schema);
    const valid = validate(values.toJS ? values.toJS() : values);

    if (!valid) {
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
