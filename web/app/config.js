let localConfig = {};
try {
  localConfig = require('localConfig');
} catch(e) {}
const config = {
  host: '/'
};
Object.assign(config, localConfig);
console.log(config);
module.exports = config;