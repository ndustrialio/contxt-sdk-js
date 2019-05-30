'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('applicationModule')
  .attrs({
    applicationGroupingId: () => factory.build('applicationGrouping').id,
    externalLink: () => faker.internet.url(),
    iconUrl: () => faker.internet.url(),
    id: () => faker.random.uuid(),
    index: () => faker.random.number(),
    label: () => faker.commerce.productName(),
    slug: () => `nsight-${faker.internet.domainWord()}`
  })
  .after((module, options) => {
    // If building an application module object that comes from the server,
    // transform it to have snake case and underscores in the right spots
    if (options.fromServer) {
      module.application_grouping_id = module.applicationGroupingId;
      delete module.applicationGroupingId;

      module.external_link = module.externalLink;
      delete module.externalLink;

      module.icon_url = module.iconUrl;
      delete module.iconUrl;
    }
  });
