'use strict';

const chai = require('chai');
const { faker } = require('@faker-js/faker');

// createTransaction was removed from faker; this polyfill restores it for tests
faker.helpers.createTransaction = () => ({});
const sinon = require('sinon');
const fixtureFactories = require('./fixtures/factories');

global.expect = chai.expect;
global.fixture = fixtureFactories;
global.faker = faker;
global.sinon = sinon;
