'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('outputField')
  .option('fromServer', false)
  .sequence('id')
  .attrs({
    _sourceDescriptor: () => faker.random.number(),
    _sourceType: () =>
      faker.random.arrayElement([
        'compressor',
        'condenser_fan',
        'condenser_pump',
        'defrost_pump',
        'engine',
        'freeze_tunnel',
        'liquid_injection_pump',
        'main_bus',
        'main_service',
        'mcc',
        'outdoor_sump_pump',
        'transfer_pump'
      ]),
    canAggregate: () => faker.random.boolean(),
    divisor: () => faker.random.number(),
    fieldName: () => faker.random.arrayElement(['power', 'temperature']),
    isDefault: () => faker.random.boolean(),
    isHidden: () => faker.random.boolean(),
    isTotalizer: () => faker.random.boolean(),
    isWindowed: () => faker.random.boolean(),
    outputId: () => faker.random.number(),
    scalar: () => faker.random.number(),
    status: () => faker.random.arrayElement(['Active', 'Out-of-Date']),
    valueType: () => faker.random.arrayElement(['boolean', 'numeric', 'string'])
  })
  .attr('_sourceMeasurement', ['fieldName'], (fieldName) => {
    const fieldNames = {
      power: ['demand', 'usage'],
      temperature: ['temperature']
    };

    return faker.random.arrayElement(fieldNames[fieldName]);
  })
  .attr('feedKey', ['_sourceDescriptor'], (descriptor) => `egauge${descriptor}`)
  .attr(
    'fieldDescriptor',
    ['_sourceDescriptor', '_sourceMeasurement', '_sourceType'],
    (descriptor, measurement, type) => {
      const baseFieldDescriptor = `${type}_${descriptor}`;

      return faker.random.boolean()
        ? baseFieldDescriptor
        : `${baseFieldDescriptor}.${measurement}`;
    }
  )
  .attr('fieldHumanName', ['fieldName'], (fieldName) => fieldName)
  .attr('label', ['_sourceMeasurement'], (measurement) => {
    const labels = {
      demand: ['Demand'],
      temperature: ['Temperature'],
      usage: ['Average Usage', 'Cumulative Usage']
    };

    return faker.random.arrayElement(labels[measurement]);
  })
  .attr('units', ['_sourceMeasurement'], (measurement) => {
    const units = {
      demand: ['kW', 'kWh'],
      temperature: ['DEGC', 'DEGF'],
      usage: ['kW', 'kWh']
    };

    return faker.random.arrayElement(units[measurement]);
  })
  .after((outputField, options) => {
    delete outputField._sourceDescriptor;
    delete outputField._sourceMeasurement;
    delete outputField._sourceType;

    // If building an output field object that comes from the server, transform
    // it to have camel case and capital letters in the right spots
    if (options.fromServer) {
      outputField.can_aggregate = outputField.canAggregate;
      delete outputField.canAggregate;

      outputField.feed_key = outputField.feedKey;
      delete outputField.feedKey;

      outputField.field_descriptor = outputField.fieldDescriptor;
      delete outputField.fieldDescriptor;

      outputField.field_human_name = outputField.fieldHumanName;
      delete outputField.fieldHumanName;

      outputField.field_name = outputField.fieldName;
      delete outputField.fieldName;

      outputField.is_default = outputField.isDefault;
      delete outputField.isDefault;

      outputField.is_hidden = outputField.isHidden;
      delete outputField.isHidden;

      outputField.is_totalizer = outputField.isTotalizer;
      delete outputField.isTotalizer;

      outputField.is_windowed = outputField.isWindowed;
      delete outputField.isWindowed;

      outputField.output_id = outputField.outputId;
      delete outputField.outputId;

      outputField.value_type = outputField.valueType;
      delete outputField.valueType;
    }
  });
