# <%=appName%> #

#### We assume you have pre-installed node.js with npm, Gulp, Bower.

Build process of project depend on [`Node.js`](https://nodejs.org). Used package managers its [`Bower`](https://bower.io/) and [`npm`](https://www.npmjs.com/get-npm). Core of builder is [`Gulp`](https://gulpjs.com/).

```bash
npm install bower -g
npm install -g gulp gulp-cli
```

## Connect to the project

Clone repo:

```bash
git clone {{ git link to <%=appName%> }}
```

**Install dependencies**
```bash
npm install
bower install
```
> bower - project library
> npm - build process dependencies

## Run locally

**To run project for developing**
```bash
npm run serve-dev
```
> CONFIGURATION: environment/**development**.json


**To run build project for production**

```bash
npm run build-prod
```
> CONFIGURATION: environment/**production**.json

#### After building you may find minified source of project within project folder in directory `dist`

## Custom configuration

To customize configuration you may write file **[envFileName].json** and put it in directory **environment** within project folder. Then you may specified node environment (SET NODE_ENV=**[envFileName]**) and run project.

**Run project localy with custom configuration**
```bash
SET NODE_ENV=[envFileName]&& npm run serve
```

**Run build project with custom configuration**
```bash
SET NODE_ENV=[envFileName]&& npm run build
```
