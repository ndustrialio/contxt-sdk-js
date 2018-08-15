import omit from 'lodash.omit';
import formatEdgeNodeFromServer from './formatEdgeNodeFromServer';

describe('utils/coordinator/formatEdgeNodeFromServer', function() {
  let expected;
  let formatted;
  let edgeNode;

  beforeEach(function() {
    edgeNode = fixture.build('edgeNode', null, { fromServer: true });
    expected = omit(
      {
        ...edgeNode,
        clientId: edgeNode.client_id,
        createdAt: edgeNode.created_at,
        organizationId: edgeNode.organization_id,
        updatedAt: edgeNode.updated_at
      },
      ['client_id', 'created_at', 'organization_id', 'updated_at']
    );

    formatted = formatEdgeNodeFromServer(edgeNode);
  });

  it('converts the object keys to camelCase', function() {
    expect(formatted).to.deep.equal(expected);
  });
});
