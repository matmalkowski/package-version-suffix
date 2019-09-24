const glob = require('glob');
const path = require('path')
const fs = require('fs')

const getAllPackageJsonFiles = () => {
    return new Promise((resolve, reject) => {
        glob('./**/package.json', {
            ignore: './**/node_modules/**/*'
        }, (err, matches) => {
            if (err) reject(err)
            else resolve(matches)
        })
    })
}

const addSuffix = async (suffix) => {
    const files = await getAllPackageJsonFiles();
    const pkgToUpdateVersion = files.reduce((acc, f) => {
        const pkg = readJson(f);
        const updatedPkg = editPackage(pkg, suffix);
        if (updatedPkg) return [...acc, { path: f, content: updatedPkg }];
        return acc;
    }, [])

    for (let p of pkgToUpdateVersion) {
        saveJson(p.path, p.content)
    }

    const filesForDeps = await getAllPackageJsonFiles();
    const pkgToUpdateDeps = filesForDeps.reduce((acc, f) => {
        const pkg = readJson(f);
        console.log(`Updating dependencies for ${pkg.name}`)
        for (let p of pkgToUpdateVersion) {
            if (pkg.peerDependencies || pkg.devDependencies || pkg.dependencies) {
                console.log(`  Since ${p.content.name} was updated to ${p.content.version}, going to check dependencies:`)
            }
            if (pkg.peerDependencies) {
                console.log(`  - peerDependencies:`)
                pkg.peerDependencies = editDependency(pkg.peerDependencies, p.content.name, p.content.version)
            }
            if (pkg.devDependencies) {
                console.log(`  - devDependencies:`)
                pkg.devDependencies = editDependency(pkg.devDependencies, p.content.name, p.content.version)
            }
            if (pkg.dependencies) {
                console.log(`  - dependencies`)
                pkg.dependencies = editDependency(pkg.dependencies, p.content.name, p.content.version)
            }
        }
        return [...acc, { path: f, content: pkg }];
    }, [])

    for (let p of pkgToUpdateDeps) {
        saveJson(p.path, p.content)
    }

    return
}

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath))
const saveJson = (filePath, content) => fs.writeFileSync(filePath, JSON.stringify(content, null, 4));

const editPackage = (pkg, suffix) => {
    const packageName = pkg.name;
    console.log(`Updating version on ${packageName}`)

    if (pkg.private) {
        console.log(`  Package ${packageName} is private, skipping...`);
        return;
    }
    console.log(`  Adding suffix to the version field in package [${packageName}]: version:${pkg.version + suffix}`)
    pkg.version = pkg.version + suffix;
    return pkg;
}

const editDependency = (deps, name, nextVersion) => {
    return Object.keys(deps).reduce((acc, depName) => {
        let depVersion = deps[depName];
        if (depName === name) {
            console.log(`      ${depName}: ${depVersion} => ${nextVersion}`)
            depVersion = nextVersion;
        }
        return { ...acc, [depName]: depVersion }
    }, {})
}


module.exports = {
    addSuffix
}