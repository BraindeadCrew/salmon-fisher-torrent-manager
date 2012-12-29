var addUser = function(pseudo, pwd) {
  // FIXME this path to ../lib/users really suxx (config file?)
  var usersLib = require('../lib/users');

  usersLib.saveUser(pseudo, pwd, function(err, res) {
    if (err) {
      console.log("Sorry something went wrong...");
    } else {
      console.log("User ["+pseudo+"] added to db successfully!");
    }
  }); 

};

// TODO enhance with prompt for password to avoid getting any
// password in the command line history
if (process.argv[2] && process.argv[3]) {
  addUser(process.argv[2], process.argv[3]);
} else {
  console.log("[Error] Not enough arguments");
  console.log("[Error] $ node "+process.argv[1]+" <pseudo> <password>");
}
  