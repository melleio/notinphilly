var passport      = require('passport');
var crypto        = require('bcrypt-nodejs');
var LocalStrategy = require('passport-local').Strategy;
var UserModel     = require('../api/user/user.model');

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password' // this is the virtual field on the model
    },
    function(email, password, done) {
        console.log('Authenticating user ' + email);
        UserModel.findOne({
            email: email.toLowerCase()
        }, function(err, user) {
            if (err) {
              console.log(err);
              return done(err);
            }
            else if (!user) {
                return done(null, false, {
                    message: 'This user is not registered.'
                });
            }
            else if (!user.authenticate(password)) {
                return done(null, false, {
                    message: 'This password is not correct.'
                });
            }
            else if (!user.active) {
                return done(null, false, {
                    message: 'Your account is not activated.  Check your email for an activation link.'
                });
            }

            return done(null, user);
        });
    }
));

// Passport needs to be able to serialize and deserialize users to support persistent login sessions
passport.serializeUser(function(user, done) {
    done(null, user.userInfo);
});

passport.deserializeUser(function(user, done) {
    UserModel.findById(user._id, function(err, user) {
        if(err || !user)
        {
          done(err, false, {
              message: 'Your account is not found.'
          });
        }
        else {
          done(null, user.userInfo);
        }
    });
});

// Generates hash using bCrypt
var createHash = function(password){
    return crypto.hashSync(password, crypto.genSaltSync(10), null);
};
