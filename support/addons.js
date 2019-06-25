'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiUuid = require('chai-uuid');
const sinonChai = require('sinon-chai');

chai.use(chaiAsPromised);
chai.use(chaiUuid);
chai.use(sinonChai);
