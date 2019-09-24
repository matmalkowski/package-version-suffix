const { graphql } = require("@octokit/graphql");

const githubApiHost = process.env.GITHUB_API_HOST || 'https://api.github.com'
const githubApiToken = process.env.GITHUB_API_TOKEN;

const getGithubInfo = async (owner, repo, pull) => {
    console.log(`Github: getting ${owner}/${repo}/pulls/${pull} info`)
    try {
        const { repository: { pullRequest: { headRefName }}}  = await graphql(`query pullHeadName($owner: String!, $repo: String!, $pullNumber: Int!) {
            repository(owner:$owner, name:$repo) {
                pullRequest(number:$pullNumber) {
                    headRefName
                }
            }
          }`, {
            owner: owner,
            repo: repo,
            pullNumber: parseInt(pull),
            headers: {
              authorization: `token ${githubApiToken}`
            },
            baseUrl: githubApiHost
          }
        )

        return {
            pullBranch: headRefName
        }

    } catch(err) {
        console.log(err)
        throw(err)
    }
    
}

module.exports = getGithubInfo