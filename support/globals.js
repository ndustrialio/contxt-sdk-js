const chai = require('chai');
const faker = require('faker');
const sinon = require('sinon');

global.expect = chai.expect;
global.faker = faker;
global.sandbox = sinon.sandbox;
