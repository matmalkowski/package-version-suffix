const path = require("path");
const selfPkg = require(path.resolve(__dirname, './package.json'));

const detectService = require('./lib/detectService')
const getGithubInfo = require('./lib/getGithubInfo')
const { getMasterConfig, getPullConfig } = require('./lib/getSuffix')
const { addSuffix } = require('./lib/packageJsonManager')

const run = async () => {
    console.log(`Welcome to package-version-suffix ver. ${selfPkg.version}`)
    const { buildCounter, branch, slug, service, setEnvVariable } = detectService();
    const [owner, repo] = slug.split('/')

    console.log(`Detected ${service} service with following config:`)
    console.log(`Working branch: ${branch}, build.counter: ${buildCounter}, github repo: ${slug}`)
    const [branchTCName, branchTCNumber] = branch.split('/');
    
    const suffixAndTag = await retrieveSuffixConvention(branchTCName, branchTCNumber, buildCounter, owner, repo)
    if (suffixAndTag.suffix !== '') {
        await addSuffix(suffixAndTag.suffix);
    }
    setEnvVariable('npmTag', suffixAndTag.tag)
}

const retrieveSuffixConvention = async (branchTCName, branchTCNumber, buildNumber, owner, repo) => {
    if (branchTCName === 'master') {
        console.log(`Looks like build is running on master branch, setting tag to latest`)
        return getMasterConfig();
    } else if (branchTCName === 'pull'){
        console.log(`Looks like build is running on pull request branch, going to fetch info from github about the pull request (#${branchTCNumber})`)
        const { pullBranch } = await getGithubInfo(owner, repo, branchTCNumber);
        return getPullConfig(pullBranch, branchTCNumber, buildNumber)
    } else {
        console.log(`Looks like its running on some custom branch, failing!`);
        process.exit(1)
    }
}


module.exports = run;