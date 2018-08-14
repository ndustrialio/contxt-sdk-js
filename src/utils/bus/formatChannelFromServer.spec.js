import omit from 'lodash.omit';
import formatChannelFromServer from './formatChannelFromServer';

describe('utils/bus/formatChannelFromServer', function() {
  let channel;
  let expectedChannel;
  let formattedChannel;

  beforeEach(function() {
    channel = fixture.build('channel', null, {
      fromServer: true
    });

    expectedChannel = omit(
      {
        ...channel,
        organizationId: channel.organization_id,
        serviceId: channel.service_id
      },
      ['organization_id', 'service_id']
    );

    formattedChannel = formatChannelFromServer(channel);
  });

  it('converts the object keys to the camelCase', function() {
    expect(formattedChannel).to.deep.equal(expectedChannel);
  });
});
