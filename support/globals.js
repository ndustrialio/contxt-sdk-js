'use strict';

const chai = require('chai');
const faker = require('faker');
const sinon = require('sinon');
const fixtureFactories = require('./fixtures/factories');

global.expect = chai.expect;
global.fixture = fixtureFactories;
global.faker = faker;
global.sinon = sinon;
