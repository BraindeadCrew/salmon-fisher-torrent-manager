var params = function() {
    var nconf = require('nconf'),
        path = require('path');
    
    nconf.argv().env();
    nconf.file({ file: 'config.json' });

    nconf.defaults({
        'port': 8042,
        'session': {
            'secret': 'n0t g00d 3n0ugh7'   
        },
        'couchdb': {
            'dbname': 'torrent-manager'
        },
        'folder': {
            'finished': path.join(__dirname, '..', 'public', 'files'),
            'downloading': path.join(__dirname, '..', 'downloading'),
            'uploadedTorrent': path.join(__dirname, '..', 'torrents')
        }
    });
    
    function getParam(key) {
        return nconf.get(key);
    }

    return {    
        getParam: getParam
    };
};

module.exports = params();
