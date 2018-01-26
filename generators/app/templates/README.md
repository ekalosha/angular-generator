# <%=appName%> #

#### We assume you have pre-installed node.js with npm, Gulp, Bower.

Build process of project depend on [```Node.js```](https://nodejs.org). Used package managers its [```Bower```](https://bower.io/) and [```npm```](https://www.npmjs.com/get-npm). Core of builder is [```Gulp```](https://gulpjs.com/).

```bash
npm install bower -g
npm install -g gulp gulp-cli
```

#### Connect to the project

Clone repo:

```bash
git clone https://{{<%=appName%> path}}
```

Install dependencies
```bash
npm install
bower install
```

#### Default run

To run project for developing :
> CONFIGURATION: environment/**development**.json

```bash
gulp serve-dev
```

To run build project for production :
> CONFIGURATION: environment/**production**.json

```bash
gulp build-prod
```

#### Custom configuration

To use node environment you may write custom configuration (environment/**fileName**.json) and specified node environment (SET NODE_ENV=**fileName**) then run:

**To run project for developing with custom configuration**
```bash
gulp serve
```

**To run run build project for production with custom configuration**
```bash
gulp build
```
