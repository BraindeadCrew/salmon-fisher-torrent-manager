/*jslint node: true, nomen: true, white: true */

var files = function () {
        "use strict";
        var fs = require('fs'),
            params = require('./params');

        function readFolder(dirpath, recursive, isFinished) {
            var ret = [];

            function readFolderRec(basepath, dirpath, ret) {
                var filesList = fs.readdirSync(dirpath),
                    i, path = require('path'), file,
                    fileStats;
                for (i = 0; i < filesList.length; i=i+1) {
                    file = dirpath + '/' + filesList[i];
                    fileStats = fs.statSync(file);
                    if (fileStats.isFile() || !recursive) {
                        ret.push({
                            name: path.relative(dirpath, file),
                            webpath: path.relative(basepath, file),
                            stats: fileStats,
                            isFile: fileStats.isFile(),
                            isFinished: isFinished
                        });
                    } else {
                        readFolderRec(basepath, file, ret);
                    }
                }
            }
            if(!fs.existsSync(dirpath)) {
                fs.mkdirSync(dirpath);
            }
            readFolderRec(dirpath, dirpath, ret);
            return ret;
        }

        function finished() {
            return readFolder(params.getParam('folder:finished'), true, true);
        }

        function downloading() {
            return readFolder(params.getParam('folder:downloading'), true, false);
        }

        return {
            finished: finished,
            downloading: downloading
        };
    };

module.exports = files();
