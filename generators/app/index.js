
'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
/*-------------------------------------------------
    GENERATOR ANGULAR-DFT
---------------------------------------------------*/
var $ = require('./build/util.js');
var variables = require('./build/variables.js');
var writeFiles = require('./build/writefiles.js');



/**
 * generetor have a three ways.
 *
 * installation - it works on first time (project generation)
 *
 *          second and more run on one dir (stored .yo-rc.json)
 *          generator looking at the configuration options can offer:
 *
 * repair - generator resored by params:
            "gulp tasks", .gitignore, .npmignore,
            and extended a bower.json, pacage.json
 *
 * extend - (futures) can offer add in your aplication angular parts:
        all the additional parts will be added to the core (.yo-rc.json) application module as a dependent on his elements
        dummy directive
        dummy filter
        dummy interceptor
        dummy service
        dummy model

 * clear - it clear all files into directory
 */
module.exports = yeoman.Base.extend({
    /*-------------------------------------------------
    PHASE INITIALIZING
    ---------------------------------------------------*/
    initializing: {
        // prepare util to work with this generator generator
        makeUtils: $.generator,
        // try to get a user data
        getUser: variables.getUser,
        // try find .yo-rc.json and choose restore/extend/rewrite
        generatorHello: variables.generatorHello,
    },
    /*-------------------------------------------------
    PHASE DEFINATION extend generator variables from user options
    ---------------------------------------------------*/
    prompting: {
        instalation: function () {
            var config = $.get();
            if ( config['instalation'] == 'progress' ) {
                return new Promise( function ( resolve, reject ) {
                    variables.main().then( function () {
                        variables.preprocessors().then(function () {
                            variables.angularName().then(resolve);
                        });
                    });
                });
            }
        },
        extend: function () {
            var config = $.get();
            if ( config['_privat']['extend'] ) {
                return new Promise( function ( resolve, reject ) {
                    function action () {
                        $.askСonfirm('Make a '+$.highlight('dummy')+' ?').then(function ( again ) {
                            again ? writeFiles.makeAngularDummy().then(action) : resolve();
                        });
                    }
                    // start a loop
                    action();
                });
            }
        }
    },
    /*-------------------------------------------------
        PHASE CONFIGURATION
    ---------------------------------------------------*/
    configuring: function () {
        var generator = this;
        var config = $.get();
        if ( config['instalation'] == 'progress' || config['_privat']['repair'] ) {
            var packageOptions = {
                author: config.user,
                name: config.appName,
                version: config.appVersion,
            };
            // merge project/template bower.json and options from variables
            writeFiles.writePackage('bower.json', packageOptions);
            // if first install add owner like a contributor
            if ( config['instalation'] == 'progress' ) {
                packageOptions.contributors = [
                    {name: config.user, email: generator.user.git.email()||(config.user+'@unknown.com')}
                ];
            }
            // merge project/template package.json and options from variables
            writeFiles.writePackage('package.json', packageOptions);
        }
    },
    /*-------------------------------------------------
        PHASE DEFAULT
    ---------------------------------------------------*/
    default: function () {
        var config = $.get();
        if ( config['instalation'] == 'progress' ) {
            // this.log('\ninstalation default\n');
        } else if ( config['_privat']['repair'] ) {
            // this.log('\nrepair default\n');
        } else if ( config['_privat']['extend'] ) {
            // this.log('\nextend default\n');
        }
    },
    /*-------------------------------------------------
        PHASE WRITING
    ---------------------------------------------------*/
    writing: function () {
        var generator = this;
        var config = $.get();
        if ( config['instalation'] == 'progress' || config['_privat']['repair'] ) {
            if ( config['instalation'] == 'progress' ) {
                // .gitignore isn't copying https://github.com/yeoman/generator/issues/812
                // make a hack
                generator.fs.copyTpl( $.sourceDir('template.gitignore'), $.destDir('.gitignore'), {});
                // write name of project in readmy
                generator.fs.copyTpl( $.sourceDir('readme.md'), $.destDir('readme.md'), config);
                // simple copy files
                $.copy([
                    '.bowerrc',
                    '.npmignore',
                    '.editorconfig',
                    'source/assets/images/favicon.ico',
                    'source/assets/images/favicon-16x16.png',
                    'source/assets/images/favicon-32x32.png',
                ]);
                // basic dummy for angular project
                writeFiles.angularApp();
            }
            // build gulp tasks with choosed preprocessors
            writeFiles.gulpTasks();
        }
    },
    /*-------------------------------------------------
        PHASE CONFLICTS (changing exist files)
    ---------------------------------------------------*/
    conflicts: function () {
        var config = $.get();
        if ( config['instalation'] == 'progress' ) {
            // console.log('instalation conflicts');
        } else if ( config['_privat']['repair'] ) {
            // console.log('repair conflicts');
        } else if ( config['_privat']['extend'] ) {
            // console.log('extend conflicts');
        }
    },
    /*-------------------------------------------------
        PHASE INSTALATION
    ---------------------------------------------------*/
    install: function () {
        var generator = this;
        var config = $.get();
        $('clearConfig', '_privat');
        if ( config['instalation'] == 'progress' ) {
            $.set('instalation', 'complete');
            return new Promise( function ( resolve, reject ) {
                variables.install().then( function ( answer ) {
                    resolve();
                    if ( answer.bower||answer.npm ) {
                        generator.installDependencies({ bower: answer.bower, npm: answer.npm, callback: resolve });
                    }
                });
            });
        }
    },
    /*-------------------------------------------------
        PHASE AFTER ALL
    ---------------------------------------------------*/
    end: function () {
        var config = $.get();
        // say bye
        this.log(yosay(
            chalk.white('\nThank you, it`s been a')+' '+
            chalk.red.bold('pleasure')+'\ndoing business with you '+
            chalk.cyan(config['user'])+'.'
        ));
    }
    /*-------------------------------------------------
        Something else you need ?
    ---------------------------------------------------*/
});
