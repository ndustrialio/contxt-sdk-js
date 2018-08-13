import omit from 'lodash.omit';
import formatChannelToServer from './formatChannelToServer';

describe('utils/bus/formatChannelToServer', function() {
  let expectedChannel;
  let channel;
  let formattedChannel;

  beforeEach(function() {
    channel = fixture.build('channel');
    expectedChannel = omit(
      {
        ...channel,
        organization_id: channel.organizationId,
        service_id: channel.serviceId
      },
      ['organizationId', 'serviceId']
    );

    formattedChannel = formatChannelToServer(channel);
  });

  it('converts the object keys to snake case', function() {
    expect(formattedChannel).to.deep.equal(expectedChannel);
  });
});
