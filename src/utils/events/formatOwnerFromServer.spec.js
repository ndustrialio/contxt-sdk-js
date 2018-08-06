import omit from 'lodash.omit';
import formatOwnerFromServer from './formatOwnerFromServer';

describe('utils/events/formatOwnerFromServer', function() {
  let expectedOwner;
  let formattedOwner;
  let owner;

  beforeEach(function() {
    owner = fixture.build('owner', null, { fromServer: true });
    expectedOwner = omit(
      {
        ...owner,
        createdAt: owner.created_at,
        firstName: owner.first_name,
        isMachineUser: owner.is_machine_user,
        lastName: owner.last_name,
        updatedAt: owner.updated_at
      },
      ['created_at', 'first_name', 'is_machine_user', 'last_name', 'updated_at']
    );

    formattedOwner = formatOwnerFromServer(owner);
  });

  it('converts the object keys to camelCase', function() {
    expect(formattedOwner).to.deep.equal(expectedOwner);
  });
});
