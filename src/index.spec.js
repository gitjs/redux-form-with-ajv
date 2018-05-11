import validate from './index';
import chai from 'chai';
import spies from 'chai-spies-next';
import Ajv from 'ajv';
import localize from 'ajv-i18n';
import AjvKeywords from 'ajv-keywords';
import AjvErrors from 'ajv-errors';

chai.use(spies);

const expect = chai.expect;

describe('redux-form-with-ajv', () => {

    describe('ajv extensions', () => {

        describe('support ajv-errors', () => {

            it('should apply custom error message', () => {

                const schema = {
                    type: 'object',
                    properties: {
                        clubName: {
                            type: 'string'
                        }
                    },
                    errorMessage: {
                        required: {
                            clubName: 'Required (custom error message)'
                        }
                    },
                    required: ['clubName']
                };

                const ajvOptions = {
                    allErrors: true,
                    verbose: true,
                    useDefaults: true,
                    jsonPointers: true,
                };

                const ajv = new AjvErrors(new Ajv(ajvOptions));

                const errors = validate(schema, {ajv})({});

                const expectedError = {
                    clubName: 'Required (custom error message)'
                };

                expect(expectedError).to.deep.equal(errors);
            });
        });

        describe('support ajv-i18n', () => {
            const schema = {
                type: 'object',
                properties: {
                    name: {
                        type: 'string'
                    }
                },
                required: ['name']
            };

            it('should translate error message for string to "borde vara string"', () => {
                const errors = validate(schema, {localize: localize.sv})({
                    name: 123
                });

                const expectedError = {
                    name: 'borde vara string'
                };

                expect(expectedError).to.deep.equal(errors);
            });

            it('should translate error message for string to "должно быть string"', () => {
                const errors = validate(schema, {localize: localize.ru})({
                    name: 123
                });

                const expectedError = {
                    name: 'должно быть string'
                };

                expect(expectedError).to.deep.equal(errors);
            });
        });

        describe('support ajv-keywords (simple)', () => {

            const schema = {
                type: 'array',
                items: {
                    type: 'integer',
                    'switch': [
                        {if: {not: {minimum: 1}}, then: false},
                        {if: {maximum: 10}, then: true},
                        {if: {maximum: 100}, then: {multipleOf: 10}},
                        {if: {maximum: 1000}, then: {multipleOf: 100}},
                        {then: false}
                    ]
                }
            };

            const ajvOptions = {
                allErrors: true
            };

            const ajv = new AjvKeywords(new Ajv(ajvOptions), 'switch');

            it('should have no errors', () => {
                const errors = validate(schema, {ajv})([
                    1, 5, 10, 20, 50, 100, 200, 500, 1000 // all valid
                ]);

                expect(Object.keys(errors).length).to.be.equal(0);
            });

            it('should throw errors', () => {
                const errors = validate(schema, {ajv})([
                    'foo', 11, // error cases
                    10, 1000, 100 // valid
                ]);

                expect(Object.keys(errors).length).to.be.equal(2);
            });
        });

        describe('support ajv-keywords (mixed)', () => {

            const schema = {
                type: 'object',
                properties: {
                    clubName: {
                        type: 'string'
                    },
                    attendees: {
                        type: 'array',
                        items: {
                            type: 'integer',
                            'switch': [
                                {if: {not: {minimum: 1}}, then: false},
                                {if: {maximum: 10}, then: true},
                                {if: {maximum: 100}, then: {multipleOf: 10}},
                                {if: {maximum: 1000}, then: {multipleOf: 100}},
                                {then: false}
                            ]
                        }
                    }
                },
                required: ['clubName']
            };

            const ajvOptions = {
                allErrors: true
            };

            const ajv = new AjvKeywords(new Ajv(ajvOptions), 'switch');

            it('should have no errors', () => {
                const errors = validate(schema, {ajv})({
                    clubName: 'AwesomeClub',
                    attendees: [1, 5, 10, 20, 50, 100, 200, 500, 1000] // all valid
                });

                expect(Object.keys(errors).length).to.be.equal(0);
            });

            it('should throw errors', () => {

                const errors = validate(schema, {ajv})({
                    clubName: 'AwesomeClub',
                    attendees: [
                        'foo', 11, // error cases
                        10, 1000, 100 // valid
                    ]
                });

                expect(Object.keys(errors.attendees).length).to.be.equal(2);
            });
        });
    });

    describe('in general', () => {

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

            validate(schema, {ajv: ajvSpy})(values);

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

            const errorMessage = _error => {
                if (_error.keyword === 'required' && _error.params.missingProperty === 'name2') {
                    return 'is required';
                }

                return _error.message;
            };

            const errors = validate(schema, {errorMessage})({});

            const expectedError = {
                name1: "should have required property 'name1'",
                name2: 'is required'
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
                        minItems: 1
                    }
                }
            };

            it('should add an _error key', () => {
                const errors = validate(schema)({
                    someProperty: []
                });

                const expectedError = {
                    someProperty: {
                        _error: 'should NOT have less than 1 items'
                    }
                };

                expect(expectedError).to.deep.equal(errors);
            });
        });

        describe('when dataPath is an empty string', () => {
            const schema = {
                type: 'object',
                properties: {
                    someProperty1: {
                        type: 'string'
                    },
                    someProperty2: {
                        type: 'string'
                    }
                }
            };

            it('should apply the missing property', () => {
                const errors = validate(schema)('not an object');

                const expectedError = {
                    '': 'should be object'
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
});
