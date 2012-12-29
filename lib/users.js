var users = function() {
    var prefixKey = 'user',
        cradle = require('cradle'),
        params = require('./params'),
        db = new(cradle.Connection)().database(params.getParam('couchdb:dbname')),
        security = require('security-lib');
    
    function getUserByPseudo(name, callback) {
        db.get(prefixKey + ':' + name, function(err, doc) {
           if (typeof callback === 'function') {
               callback(err, doc);
           }
        });
    }
    
    function saveUser(name, password, callback) {
      db.save(prefixKey + ':' + name, {
        pseudo: name,
        password: security.generatePasswordHash(password, 'sha1', 128)
      }, function (err, res) {
        if (typeof callback === 'function') {
          callback(err, res);
        }
      });
    }
    
    function updatePassword(user, newPassword, callback) {
        user.password = newPassword;
        db.save(user._id, user, callback);
    }
    
    return {    
        getUserByPseudo: getUserByPseudo,
        updatePassword: updatePassword,
        saveUser: saveUser
    };
};

module.exports = users();
