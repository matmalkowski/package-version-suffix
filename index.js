const program = require('commander');

const path = require("path");
const selfPkg = require(path.resolve(__dirname, './package.json'));

const detectService = require('./lib/detectService')
const { addSuffix } = require('./lib/packageJsonManager')

const run = async () => {
    program
        .version(selfPkg.version)
        .option('--canary <suffix>', 'Tags packages as canary release with provided suffix')
        .option('--buildNumber <number>', 'Adds build number to suffix when canary release')

    program.parse(process.argv);

    console.log(`Welcome to package-version-suffix ver. ${selfPkg.version}`)

    const { service, setBuildNumber } = detectService();

    console.log(`Detected ${service} service`)
    
    if (program.canary) {
        if (!program.buildNumber) {
            console.error('Failed to parse build number when canary param was present')
            process.exit(1)
        } else {
            console.log(`Selected canary build. Adding defined suffixes to packages.`)
            setBuildNumber(`${program.canary}.${program.buildNumber}`)
            await addSuffix(`-${program.canary}.${program.buildNumber}`);
        }
    } else {
        console.log(`No params passed. Skipping suffix modification, tagging build`)
        setBuildNumber(`release.${program.buildNumber}`)
    }
}


module.exports = run;