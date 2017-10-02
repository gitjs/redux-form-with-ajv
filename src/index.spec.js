import validate from './index';
import chai from 'chai';
import spies from 'chai-spies';

chai.use(spies);

const expect = chai.expect;

describe('redux-form-with-ajv', () => {
  it('should allow to pass custom ajv instance', () => {
    const schema = {
      type: 'object',
      properties: {
        name1: {
          type: 'string'
        }
      }
    };
    const values = {
      name1: 'some name'
    };

    const validateSpy = chai.spy(() => true);
    const ajvSpy = {
      compile: chai.spy(() => validateSpy)
    };

    validate(schema, { ajv: ajvSpy })(values);

    expect(ajvSpy.compile).to.have.been.called.with(schema);
    expect(validateSpy).to.have.been.called.with(values);
  });

  it('should allow to customize error messages via option function', () => {
    const schema = {
      type: 'object',
      properties: {
        name1: {
          type: 'string'
        },
        name2: {
          type: 'string'
        }
      },
      required: ['name1', 'name2']
    };

    const errorMessage = (_error) => {
      if (_error.keyword === 'required' && _error.params.missingProperty === 'name2') {
        return 'is required'
      }

      return _error.message;
    }

    const errors = validate(schema, { errorMessage })({});

    const expectedError = {
      name1: "should have required property 'name1'",
      name2: "is required"
    };

    expect(expectedError).to.deep.equal(errors);
  });

  describe('when schema is valid', () => {
    const schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        }
      },
      required: ['name']
    };

    it('should return empty object', () => {
      const errors = validate(schema)({
        name: 'Yepp, i am a name.'
      });

      const expectedError = {};

      expect(expectedError).to.deep.equal(errors);
    });
  });

  describe('when dataPath is empty', () => {
    const schema = {
      type: 'object',
      properties: {
        name1: {
          type: 'string'
        },
        name2: {
          type: 'string'
        }
      },
      required: ['name1', 'name2']
    };

    it('should apply the missing property', () => {
      const errors = validate(schema)({});

      const expectedError = {
        name1: "should have required property 'name1'",
        name2: "should have required property 'name2'"
      };

      expect(expectedError).to.deep.equal(errors);
    });
  });

  describe('when property is an array', () => {
    const schema = {
      type: 'object',
      properties: {
        someProperty: {
          type: 'array',
          default: [],
          items: {
            type: 'string'
          },
          minItems: 1,
          errorMessage: {
            minItems: '_error should be applied.'
          }
        }
      }
    };

    it('should add an _error key', () => {
      const errors = validate(schema)({
        someProperty: []
      });

      const expectedError = {
        someProperty: {
          _error: '_error should be applied.'
        }
      };

      expect(expectedError).to.deep.equal(errors);
    });
  });

  describe('when values are immutable map', () => {
    const schema = {
      type: 'object',
      properties: {
        name1: {
          type: 'string'
        },
        name2: {
          type: 'string'
        }
      },
      required: ['name1', 'name2']
    };

    it('should validate correctly', () => {
      const values = {
        toJS: () => ({
          name1: 'some value'
        })
      };
      const errors = validate(schema)(values);

      const expectedError = {
        name2: "should have required property 'name2'"
      };

      expect(expectedError).to.deep.equal(errors);
    });
  });
});
