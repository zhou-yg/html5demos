/*
 * grunt-zyg-link
 * https://github.com/zyg/grunt-zyg-link
 *
 * Copyright (c) 2015 zhou-yg
 * Licensed under the MIT license.
 */

'use strict';

var util = require('util');

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks
    var defaultStartTag = '<!-- links start -->',
        defaultEndTag = '<!-- links end -->',
        defaultFileTmpLink = '<a href="%s">%t</a>';
    var i = 0;

    var excessSlashRegExp = /[\/]+/g;

    grunt.registerMultiTask('zyg_link', 'The best Grunt plugin ever.', function () {

        //console.log(i++);

        var options = this.options();

        var startTag = options.startTag || defaultStartTag,
            endTag = options.endTag || defaultEndTag,
            fileTmpLink = options.fileTmpLink || defaultFileTmpLink;

        var insertRegExp = new RegExp(startTag+'[\\w\\W]*'+endTag,'g');

        //console.log(util.inspect(options, {showHidden: true, depth: null, colors: true}));
        //console.log(util.inspect(this.files, {showHidden: true, depth: null, colors: true}));

        this.files.forEach(function (f) {

            var dest = f.dest.replace(excessSlashRegExp, '/'),
                destPaths = dest.split('/');

            var fileObjArr = f.src.filter(function (filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function (filePath) {
                //清除多余的/符号
                filePath = filePath.replace(excessSlashRegExp, '/');
                //层级
                var pathSplit = filePath.split('/');

                var title = grunt.file.read(filePath).match(/<title>([\W\w]*)<\/title>/);
                title = title ? title[1] : '';
                return {
                    level: pathSplit.length,
                    pathSplit: pathSplit,
                    title: title
                };
            });

            destPaths.forEach(function (pathOne) {
                if (pathOne.indexOf('.') !== -1) {
                    return;
                }
                fileObjArr.forEach(function (fileObj) {
                    if (fileObj.pathSplit[0] === pathOne) {
                        fileObj.pathSplit.shift();
                        return;
                    }
                });
            });

            //console.log(destPaths);
            //console.log(fileObjArr);
            //console.log('============================');

            var fileTree = {};
            fileObjArr.forEach(function (fileObj) {

                var curentPathArr = [];
                fileObj.pathSplit.forEach(function (path) {

                    var treelink;

                    curentPathArr.push(path);
                    curentPathArr.forEach(function (p, i) {
                        var indexI = p.indexOf('.');
                        var filename;

                        var t = i === 0 ? fileTree : treelink;

                        if (indexI === -1) {
                            if (!t[p]) {
                                t[p] = {};
                            }
                            treelink = t[p];
                        } else {
                            t[p] = fileObj.title;
                            if(!t[p]){
                                t[p] = 'null';
                            }
                        }
                    });
                });
            });

            //console.log(util.inspect(fileTree, {showHidden: true, depth: null, colors: true}));

            var htmlTree = [];
            var fistSlashReg = /^\//;
            function buildUl(arg,htmls,path){
                var start,end;
                if(path){
                    start = '<li><ul>';
                    end = '</ul></li>';
                }else{
                    start ='<ul>';
                    end = '</ul>';
                }
                if(typeof arg === 'object'){
                    htmls.push(start);

                    var tmp = [];
                    for(var k in arg){
                        var v = arg[k];
                        buildUl(v,tmp,path+'/'+k);
                    }
                    htmls.push(tmp);
                    htmls.push(end);

                }else if(typeof arg === 'string'){

                    path = path.replace(fistSlashReg,'');

                    htmls.push('<li>');
                    htmls.push(fileTmpLink.replace(/%s/,path).replace(/%t/,arg));
                    htmls.push('</li>');
                }
            }
            buildUl(fileTree,htmlTree,'');
            //console.log(util.inspect(htmlTree, {depth: null, colors: true}));

            var finalHTML = '';
            function buildFinalHTML(strArr){
                var tmp = [];

                strArr.forEach(function(one){
                    if(typeof one === 'object'){
                        tmp.push(buildFinalHTML(one));
                    }else if(typeof one === 'string'){
                        tmp.push(one);
                    }
                });
                return tmp.join('');
            }
            finalHTML = buildFinalHTML(htmlTree);
            finalHTML =  finalHTML.replace(/^<ul><li>/,'').replace(/<\/li><\/ul>$/,'');

            var destHtmls = grunt.file.read(dest);
            destHtmls = destHtmls.replace(insertRegExp,startTag+finalHTML+endTag);
            grunt.file.write(dest,destHtmls);
        });
    });

};
