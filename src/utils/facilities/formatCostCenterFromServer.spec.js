import omit from 'lodash.omit';
import formatCostCenterFromServer from './formatCostCenterFromServer';
import * as facilitiesUtils from './index';

describe('utils/facilities/formatCostCenterFromServer', function() {
  let formatFacilityFromServer;
  let expectedCostCenter;
  let formattedCostCenter;
  let costCenter;

  beforeEach(function() {
    this.sandbox = sandbox.create();

    formatFacilityFromServer = this.sandbox
      .stub(facilitiesUtils, 'formatFacilityFromServer')
      .callsFake((facility) => facility);

    costCenter = fixture.build('costCenter', null, {
      fromServer: true
    });

    expectedCostCenter = omit(
      {
        ...costCenter,
        createdAt: costCenter.created_at,
        organizationId: costCenter.organization_id,
        updatedAt: costCenter.updated_at
      },
      ['created_at', 'organization_id', 'updated_at']
    );

    formattedCostCenter = formatCostCenterFromServer(costCenter);
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('formats the necessary children objects', function() {
    costCenter.facilities.forEach((facility) =>
      expect(formatFacilityFromServer).to.be.calledWith(facility)
    );
  });

  it('converts the object keys to camelCase', function() {
    expect(formattedCostCenter).to.deep.equal(expectedCostCenter);
  });
});
