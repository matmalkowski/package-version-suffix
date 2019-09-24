const getMasterConfig = () => ({
    suffix: '',
    tag: 'latest'
})

const getPullConfig = (pullBranch, pullNumber, buildNumber) => {
    if (pullBranch.startsWith('version/')) return {
        suffix: `-beta.${buildNumber}`,
        tag: 'beta'
    }
    return {
        suffix: `-pull-request.${buildNumber}`,
        tag: `pr-${pullNumber}`
    }
}

module.exports = {
    getMasterConfig, 
    getPullConfig
}