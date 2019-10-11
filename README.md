# package-version-suffix

Small CLI utility to append version suffix to your monorepo packages, while also keeping the internal references up to date.

## How it works

```sh
npx package-version-suffix
```

Running this command in root of your repository will do the following:

> Right now only Teamcity supported, using following variables: `TC_BUILD_COUNTER`, `TC_BUILD_BRANCH`, `TC_REPO_SLUG`

1. Pick up the env variables used to determine versioning strategy
2. If running on `master` branch - do nothing, this is stable release, no need to sufix anything
3. If running on `pull` branch:
  - if PR branch is `version/xxx` this is our beta release branch
  - if PR branch is different, this is just a PR build
  
For beta release:
  append `-beta.{buildCounter}` to versions
  emit `npmTag` env variable with `beta`

For regular pull request:
  append `-pull-request.{buildCounter}` to versions
  emit `npmTag` env variable with `pull-XXX` where `XXX` is pull request number
  

