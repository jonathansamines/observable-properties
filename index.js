'use strict';

const dotenv = require('dotenv');
const lodash = require('lodash');

function getValue(propertyName) {
  dotenv.config();
  return process.env[propertyName];
}

function observeProperty(propertyName) {
  const normalizedPropertyName = propertyName.replace('.', '_').toUpperCase();
  const propertyOptions = {
    source: 'environment',
  };

  let propertyValue = getValue(normalizedPropertyName);

  // dynamic lookup
  setInterval(() => {
    propertyValue = getValue(normalizedPropertyName);

    // set to the original retrieved zookeeper value?
    // if this is the case, perhapse we could resolve this by using another protocol
    // :observer?
    lodash.set(propertyName, propertyValue);
  }, 10000);

  return Object.create(propertyOptions, {
    value: {
      enumerable: true,
      configurable: false,

      // dynamic value
      get() {
        return propertyValue || lodash.get(propertyName);
      },

      set() {
        throw new Error('Cannot override a value.');
      }
    }
  });
}

const observer = {
  observe: observeProperty,
};

const propertyName = 'hola.mundo';
const property = observer.observe(propertyName);

setInterval(() => {
  console.log('Current value for property (%s) is: %s retrieved', propertyName, property.value);
}, 1000);
