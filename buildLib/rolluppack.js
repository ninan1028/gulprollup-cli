'use strict';

var fs = require('fs'),
    through = require('through2'),
    gutil = require('gulp-util'),
    PLUGIN_NAME;

var rollup = require('rollup');
var resolve = require('rollup-plugin-node-resolve');
var babel = require('rollup-plugin-babel');
var commonjs = require('rollup-plugin-commonjs');
//var vue=require('rollup-plugin-vue');
var PluginError = gutil.PluginError;
var config = {}


PLUGIN_NAME = 'gulp-rollup-pack';

module.exports = function (opt) {
    function rollWrapper(filename) {
        return rollup.rollup({
            entry: filename,
            plugins: [
                resolve(),
                //vue({css:true}),
                commonjs({ include: 'node_modules/**' }),
                babel(),
            ]
        })
    }
    function pack(filename, cb, streamCb) {
        rollWrapper(filename).then(function (bundle) {
            var moduleName = filename.match(/(\w+)\./i)[1];
            var result = bundle.generate({
                format: 'iife',
                moduleName,
                sourceMap: opt.sourceMap
            })
            cb(result.code, result.map);
        }).catch(function (e) {
            streamCb(new PluginError('rollup Error', e))
        })
    }

    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            // 返回空文件
            cb();
        }
        if (file.isStream()) {
            return cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
        }
        var path = file.path;
        var that = this;
        pack(path, function (code, map) {
            file.contents = new Buffer(code);
            if(opt.sourceMap){
                file.sourceMap = map
            }
            this.push(file);
            cb(null, file);
        }.bind(this), cb)
    })
}