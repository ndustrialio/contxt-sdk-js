import omit from 'lodash.omit';
import formatUserFromServer from './formatUserFromServer';

describe('utils/coordinator/formatUserFromServer', function() {
  let expectedUser;
  let formattedUser;
  let user;

  beforeEach(function() {
    user = fixture.build('contxtUser', null, { fromServer: true });
    expectedUser = omit(
      {
        ...user,
        createdAt: user.created_at,
        firstName: user.first_name,
        isActivated: user.is_activated,
        isSuperuser: user.is_superuser,
        lastName: user.last_name,
        phoneNumber: user.phone_number,
        updatedAt: user.updated_at
      },
      [
        'created_at',
        'first_name',
        'is_activated',
        'is_superuser',
        'last_name',
        'phone_number',
        'updated_at'
      ]
    );

    formattedUser = formatUserFromServer(user);
  });

  it('converts the object keys to camelCase', function() {
    expect(formattedUser).to.deep.equal(expectedUser);
  });
});
