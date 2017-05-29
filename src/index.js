import Ajv from 'ajv';
import AjvErrors from 'ajv-errors';
import objectPath from 'object-path';

const ajv = AjvErrors(new Ajv({
  allErrors: true,
  extendRefs: true,
  verbose: true,
  useDefaults: true,
  jsonPointers: true
}), {keepErrors: false});

export default (schema, values) => {
  const errors = {};
  const validate = ajv.compile(schema);
  const valid = validate(values);

  console.log('ajv', validate.errors);

  if (!valid) {
    const errorMap = new Map(validate.errors.map((error) => {
      let path = error.dataPath;
      let message = error.message;

      // replace "/" with dot (.) so object-path can set path correctly
      path = path.replace(/\//g, '.').substring(1);

      if (error.params.missingProperty) {
        path += '.' + error.params.missingProperty;
      }

      if (error.parentSchema && error.parentSchema.type === 'array') {
        path += '._error';
      }

      return [ path, message ];
    }));

    const sortedErrorMap = new Map([ ...errorMap.entries() ]
      .sort((a, b) => a[0].length - b[0].length))
      .forEach((message, path) => {
        /*!path
         ? Object.assign(errors, message)
         : objectPath.set(errors, path, message);*/
      });

    console.log('sorted map', sortedErrorMap);

    // TODO test, add manual everything with objectPath maybe something wrong there ...
  }

  console.log('errors', errors);

  return errors;
}
