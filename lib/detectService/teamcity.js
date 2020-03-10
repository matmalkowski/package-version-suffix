module.exports = {
    detect: () => {
      return !!process.env.TEAMCITY_VERSION
    },
  
    configuration: () => {
      console.log('Teamcity Detected')
      return {
        service: 'teamcity',
        setBuildNumber: (number) => {
            console.log(`##teamcity[buildNumber '${number}']`);
        }
      }
    },
  }