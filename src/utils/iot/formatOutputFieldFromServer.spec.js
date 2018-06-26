import omit from 'lodash.omit';
import formatOutputFieldFromServer from './formatOutputFieldFromServer';

describe('utils/iot/formatOutputFieldFromServer', function() {
  let expectedOutputField;
  let formattedOutputField;
  let outputField;

  beforeEach(function() {
    outputField = fixture.build('outputField', null, { fromServer: true });
    expectedOutputField = omit(
      {
        ...outputField,
        canAggregate: outputField.can_aggregate,
        feedKey: outputField.feed_key,
        fieldDescriptor: outputField.field_descriptor,
        fieldHumanName: outputField.field_human_name,
        fieldName: outputField.field_name,
        isDefault: outputField.is_default,
        isHidden: outputField.is_hidden,
        isTotalizer: outputField.is_totalizer,
        isWindowed: outputField.is_windowed,
        outputId: outputField.output_id,
        valueType: outputField.value_type
      },
      [
        'can_aggregate',
        'feed_key',
        'field_descriptor',
        'field_human_name',
        'field_name',
        'is_default',
        'is_hidden',
        'is_totalizer',
        'is_windowed',
        'output_id',
        'value_type'
      ]
    );

    formattedOutputField = formatOutputFieldFromServer(outputField);
  });

  it('converts the object keys to camelCase', function() {
    expect(formattedOutputField).to.deep.equal(expectedOutputField);
  });
});
