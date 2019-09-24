
const services = {
    teamcity: require('./teamcity'),
  }
  
  const detectService = () => {
    let config;
    for (let name in services) {
      if (services[name].detect()) {
        config = services[name].configuration();
        break;
      }
    }
    if (!config) {
      throw new Error(`Cannot figure out what CI is that, fail`)
    }
    return {
        ...config,
    };
  }
  
  module.exports = detectService;