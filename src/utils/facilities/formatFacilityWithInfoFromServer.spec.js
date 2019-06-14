import formatFacilityWithInfoFromServer from './formatFacilityWithInfoFromServer';
import * as objectUtils from '../objects';

describe('utils/facilities/formatFacilityWithInfoFromServer', function() {
  afterEach(function() {
    sinon.restore();
  });

  context('when there is facility info attached', function() {
    let facilityAfterFormat;
    let facilityBeforeFormat;
    let facility;
    let toCamelCase;

    beforeEach(function() {
      facilityAfterFormat = fixture.build('facility');
      facilityBeforeFormat = fixture.build('facility', facilityAfterFormat, {
        fromServer: true
      });

      toCamelCase = sinon
        .stub(objectUtils, 'toCamelCase')
        .returns(facilityAfterFormat);

      facility = formatFacilityWithInfoFromServer(facilityBeforeFormat);
    });

    it('converts the object keys to camelCase', function() {
      expect(toCamelCase).to.be.calledWith(facilityBeforeFormat);
    });

    it('returns the facility', function() {
      expect(facility).to.equal(facilityAfterFormat);
    });

    it('returns the facility with an `info` object', function() {
      expect(facility.info).to.be.an('object');
      expect(facility.info).to.equal(facilityBeforeFormat.Info);
    });
  });

  context('when there is no facility info attached', function() {
    let facilityAfterFormat;
    let facilityBeforeFormat;
    let facility;
    let toCamelCase;

    beforeEach(function() {
      facilityAfterFormat = fixture.build('facility', { info: undefined });
      facilityBeforeFormat = fixture.build('facility', facilityAfterFormat, {
        fromServer: true
      });

      toCamelCase = sinon
        .stub(objectUtils, 'toCamelCase')
        .returns(facilityAfterFormat);

      facility = formatFacilityWithInfoFromServer(facilityBeforeFormat);
    });

    it('converts the object keys to camelCase', function() {
      expect(toCamelCase).to.be.calledWith(facilityBeforeFormat);
    });

    it('returns the facility', function() {
      expect(facility).to.equal(facilityAfterFormat);
    });

    it('returns a facility with no `info`', function() {
      expect(facility.info).to.be.undefined;
    });
  });
});
