var users = function() {
    var prefixKey = 'user',
        cradle = require('cradle'),
        connec = new(cradle.Connection)().database('torrent-manager');
    
    function getUserByPseudo(name, callback) {
        
        connec.get(prefixKey + ':' + name, function(err, doc) {
           if (typeof callback === 'function') {
               callback(err, doc);
           }
        });
    }
    
    function updatePassword(user, newPassword, callback) {
        user.password = newPassword;
        connec.save(user._id, user, callback);
    }
    
    return {    
        getUserByPseudo: getUserByPseudo,
        updatePassword: updatePassword
    };
};

module.exports = users();