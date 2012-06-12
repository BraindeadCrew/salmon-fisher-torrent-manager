var params = function() {
    var nconf = require('nconf');
    
    nconf.argv().env();
    nconf.file({ file: 'config.json' });

    nconf.defaults({
        'port': 8042,
        'session': {
            'secret': 'n0t g00d 3n0ugh7'   
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