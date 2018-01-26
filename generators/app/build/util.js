
'use strict'

var mkdirp = require('mkdirp');
var chalk = require('chalk');
var path = require('path');
var del = require('del');
/**
 * delegator of utils
 *
 * @factory
 */
function factory ( name ) {
    // if ( !generator ) throw new Error('First you need to be sure to set the generator.');
    if ( typeof factory[name] == 'function' ) {
            var ar = arguments;
            return factory[name].call(generator, ar[1], ar[2], ar[3], ar[4]);
    }
};

/**
 * make a link to yeoman generator context =)
 */
var generator = null;
factory.generator = function () {
    if ( !generator ) {
        return generator = this;
    } else return generator;
}


// ... is array
var toString = ({}).toString;
function isArray ( some ) { return toString.call( some ) == '[object Array]'; }
factory.isArray = isArray;

/**
 * merging firstefull for packages
 * owner save extend
 *
 * @param: { Object } - owner of data
 * @param: { Object } - source to extend a owner
 * @returns: { Object }
 */
factory.merge = extend;
function extend ( dist, source ) {
    for ( var key in source ) {
        if ( key == 'length' ) continue;
        if ( !dist[ key ] ) {
            dist[ key ] = source[ key ];
        } else if ( typeof source[ key ] == 'object' ) {
            if ( isArray( source[ key ] ) && !dist[ key ] ) {
                dist[ key ] = source[ key ].slice();
            } else {
                dist[ key ] = extend( dist[ key ]||{}, source[ key ] );
            }
        }
    }
    return dist;
}

/**
 * merging firstefull for packages
 * owner save extend with any count sources
 *
 * @param: { Object }
 * @param: { Object } -- any count of sources pryority from 1(max) to next lower and lower
 * @returns: { Object }
 */
factory.pryorityMerge = function ( dist ) {
    var sources = Array.prototype.slice.call(arguments, 1);
    for ( var key = 0; key < sources.length; key ++ ) {
        if ( typeof sources[key] == 'object' ) {
            dist = extend(dist, sources[key]);
        }
    }
    return dist;
}

// define highlighting colors
factory.highlight = function ( text ) { return chalk.blue( text ); }

/**
 * get a ABBR from source string or returns toLowerCase
 *
 * @param: { String }
 * @returns: { String }
 */
factory.abbr = function ( name, sufix ) {
    var res = '';
    var upper = name.match(/[A-Z]/g);
    var except = name.split(/[\d\W\\\-\._]/g);
    if ( upper&&upper.length >= 2 ) {
        res = upper.join('')+(sufix||'');
    } else if ( except&&except.length >= 2 ) {
        for ( var part of except )
            part&&(res+=part);
        res += (sufix||'');
    } else {
        res = name[0] + (sufix||'');
    }
    return res.substring(0,8).toLowerCase();
}

/**
 * Make text fine to human
 *
 * @param: { String }
 * @returns: { String }
 */
factory.humanize = function ( string ) {
    return String( string )
        // from camel case
        .replace( /([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g, '$1$4 $2$3$5' )
        // .replace(/([a-z]){1,1}([A-Z])/g, function ( sib, f, s ) { return f+" "+s; })
        // spec
        .replace(/[_-]+/g, ' ')
        // normalize
        .replace(/\s+/g, ' ')
        // trim
        .replace(/^\s*|\s*$/g, '')
        // capitalize
        .toLowerCase()
        .replace(/^.{1,1}/, function ( sib ) { return sib.toUpperCase(); });
};
/**
 * Make name fine to angular injections
 *
 * @param: { String }
 * @returns: { String }
 */
factory.angularize = function ( string, firstCapital ) {

    return string
        // spec
        .replace(/[\W_]+/g, ' ')
        // normalize
        .replace(/\s+/g, ' ')
        // trim
        .replace(/^\s*|\s*$/g, '')
        // first capital only if cpecified
        .replace(/^.{1,1}/, function ( match ) {
            return firstCapital ? match.toUpperCase() : match.toLowerCase();
        })
        // lazy format camelcase
        .replace(/(\s\w)/g, function ( match ) {
            return match[1].toUpperCase();
        });
},

/*-------------------------------------------------
    GENERATOR ANGULAR-DFT deep origin generator to create custom methods
---------------------------------------------------*/

/**
 * source directory path control
 *
 * @param: { String }
 * @returns: { String }
 */
factory.sourceDir = function ( filePath ) {
    if ( typeof filePath == 'undefined' ) {
        return generator.sourceRoot();
    } else {
        return generator.templatePath(filePath);
    }
}

/**
 * source directory path control
 *
 * @param: { String } - 'dir_name' - special else make a global path to root directori
 * @returns: { String }
 */
factory.destDir = function ( filePath ) {
    if ( filePath.toLowerCase() == 'dir_name' ) {
        return path.normalize(process.cwd()).split(path.sep).pop();
    } else if ( typeof filePath == 'undefined' ) {
        return generator.destinationRoot();
    } else {
        return generator.destinationPath(filePath);
    }
}

/**
 * wrapper for del module
 * https://www.npmjs.com/package/del
 *
 * @param: { Object }
 * @returns: { Object }
 */
factory.removeFiles = function ( list ) {
    // console.log('factory.removeFiles', list );
    return del.sync(list, {force: true});
}

/**
 * wrapper for del module
 * https://www.npmjs.com/package/del
 *
 * @param: { Object }
 * @returns: { Object }
 */
factory.createDirs = function ( dirs ) {
    if ( isArray(dirs) ) {
        for ( var dir of dirs ) {
            // console.log('factory.createDir', dir, '\n'+path.join(generator.destinationRoot(), dir) );
            mkdirp.sync(path.join(generator.destinationRoot(), dir));
        }
    } else if (typeof dirs == 'string') {
        return factory.createDirs([dirs]);
    }
}

/**
 * to prevent instal using "throw new Error"
 */
factory.preventInstalation = function () {
    generator.env.error(
        chalk.red.bold('Too bad.')+
        '\n'+chalk.blue.bold('I hope')+
        ' that we can find common ground'+
        chalk.blue(' in the next time')+'.\x1B[0m'
    );
}

/**
 *
 *
 * @param: { Array }
 * @param: { Object }
 * @returns: { Object }
 */
factory.copy = function ( fileList, variables ) {
    if ( isArray(fileList) ) {
        if ( typeof variables == 'object' ) {
            // copy file with reading and overwriting by variables
            for ( var file of fileList ) {
                generator.fs.copyTpl( factory.sourceDir(file) , factory.destDir(file), variables );
            }
        } else {
            // copy buffering file without reading and overwriting
            for ( var file of fileList ) {
                generator.fs.copy( factory.sourceDir(file) , factory.destDir(file) );
            }
        }
    } else if ( typeof fileList == 'string' ) {
        factory.copy( [fileList], variables );
    }
}

/**
 * set variables to ".yo-rc.json"
 *
 * @param: { Object || String } properits or field name
 * @param: { Object } || value to saving
 * @returns: { Object } actual variables
 */
factory.set = function ( field, val ) {
    if ( typeof field == 'string' ) {
        field = { [ field ]: val };
    }
    if ( typeof field == 'object' ) {
        generator.config.set( field );
    }
}

/**
 * set variables from ".yo-rc.json"
 * without arguments its return all
 * @param: { String || undefined } field name
 * @returns: { Object || value } actual variable
 */
factory.get = function ( field ) {
    if ( typeof field == 'string' )
        return generator.config.get( field );
    else return generator.config.getAll();
}
/**
 * set variables from ".yo-rc.json"
 * without arguments its return all
 * @param: { String || undefined } field name
 * @returns: { Object || value } actual variable
 */
factory.clearConfig = function ( field ) {
    if ( !field || String(field) !== field ) { // clear all
        var config = generator.config.getAll();
        for (var key in config) {
            generator.config.delete(key);
        }
        // clear root field
    } else generator.config.delete(field);
}

/**
 * confirm from user
 *
 * @param: { String } - text of message
 * @param: { Object } - options
 * @returns: { Promise }
 */
factory.askСonfirm = function ( text, options ) {
    options = options&&(typeof options == 'object') ? options : {};
    return new Promise( function ( resolve, reject ) {
        // get answers from user
        generator
            .prompt({
                type: 'confirm',
                name: 'dummy',
                message: text,
                default: !!options.default,
            })
            .then(
                function ( answer ) {
                    if ( typeof options.store == 'string' ) {
                        factory.set( options.store, answer.dummy );
                    }
                    resolve( answer.dummy );
                },
                function ( error ) { reject( error ); }
            );
    });
};


/**
 * get a string from user
 *
 * @param: { String } - text of message
 * @param: { Object } - options
 * @returns: { Promise }
 */
factory.askString = function ( text, options ) {
    options = options&&(typeof options == 'object') ? options : {};
    return new Promise( function ( resolve, reject ) {
        // get answers from user
        generator
            .prompt({
                type: 'input',
                name: 'dummy',
                message: text,
                default: options.default||'',
            })
            .then(
                function ( answer ) {
                    if ( typeof options.store == 'string' ) {
                        factory.set( options.store, answer.dummy );
                    }
                    resolve( answer.dummy );
                },
                function ( error ) { reject( error ); }
            );
    });
};


/**
 * get a choose from user
 *
 * @param: { String } - text of message
 * @param: { Object } - options
 * @returns: { Promise }
 */
factory.askChoose = function ( text, options ) {
    options = options&&(typeof options == 'object') ? options : {};
    // choices must be specified
    options.choices = isArray( options.choices ) ? options.choices : [{name: 'empty', value: null }];
    return new Promise( function ( resolve, reject ) {
        // get answers from user
        generator
            .prompt({
                type: 'list',
                name: 'dummy',
                message: text,
                choices: options.choices,
                default: options.default||0,
            })
            .then(
                function ( answer ) {
                    if ( typeof options.store == 'string' ) {
                        factory.set( options.store, answer.dummy );
                    }
                    resolve( answer.dummy );
                },
                function ( error ) { reject( error ); }
            );
    });
};

/**
 * get a choose list from user
 *
 * @param: { String } - text of message
 * @param: { Object } - options
 * @returns: { Promise }
 */
factory.askChooseFew = function ( text, options ) {
    options = options&&(typeof options == 'object') ? options : {};
    // choices must be specified
    options.choices = isArray( options.choices ) ? options.choices : [{name: 'empty', value: null, checked: true }];
    return new Promise( function ( resolve, reject ) {
        // get answers from user
        generator
            .prompt({
                type: 'checkbox',
                name: 'dummy',
                message: text,
                choices: options.choices,
            })
            .then(
                function ( answer ) {
                    if ( typeof options.store == 'string' ) {
                        factory.set( options.store, answer.dummy );
                    }
                    resolve( answer.dummy );
                },
                function ( error ) { reject( error ); }
            );
    });
};

/**
 * util factory specific prepare needed
 *
 * @pablick
 */
module.exports = factory;
