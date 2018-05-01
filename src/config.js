const convict = require('convict');

const config = convict({
  env: {
    doc: 'The application environment',
    format: ['production', 'development'],
    default: 'development',
    env: 'NODE_ENV',
  },
  httpProvider: {
    doc: 'The geth client which is used to send rpc calls over http',
    format: 'url',
    default: 'http://localhost:8545',
    env: 'HTTP_PROVIDER',
  },
  httpProviderUser: {
    doc: 'The username for the provider',
    format: String,
    default: '',
    env: 'HTTP_PROVIDER_USER',
  },
  httpProviderPassword: {
    doc: 'The password for the provider',
    format: String,
    default: '',
    env: 'HTTP_PROVIDER_PASSWORD',
  },
});

config.loadFile('./local.json');
config.validate({ allowed: 'strict' });

module.exports = config;
