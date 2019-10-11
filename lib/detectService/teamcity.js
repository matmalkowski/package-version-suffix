module.exports = {
    detect: () => {
      return !!process.env.TEAMCITY_VERSION
    },
  
    configuration: () => {
      console.log('Teamcity Detected')
      return {
        service: 'teamcity',
        buildCounter: process.env.TC_BUILD_COUNTER,
        branch: process.env.TC_BUILD_BRANCH,
        slug: process.env.TC_REPO_SLUG,
        setEnvVariable: (name, value) => {
            console.log(`##teamcity[setParameter name='env.${name}' value='${value}']`);
        },
        setBuildNumber: (number) => {
            console.log(`##teamcity[buildNumber '${number}']`);
        }
      }
    },
  }