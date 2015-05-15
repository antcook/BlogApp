var LocalStrategy    = require('passport-local').Strategy;
var bcrypt           = require('bcrypt-nodejs');

// REQUIRE MODEL
// ==============================================

var User = require('./models/user');

module.exports = function(passport) {

    // SERIALIZE USER
    // ==============================================

    passport.serializeUser(function(user, done)
    {
        done(null, user.id);
    });

    // DESERIALIZE USER
    // ==============================================

    passport.deserializeUser(function(id, done)
    {
        User.findById(id, function(err, user)
        {
            done(err, user);
        });
    });


    // LOGIN
    // ==============================================

    passport.use('login', new LocalStrategy(
    {
        usernameField : 'email',
        passwordField : 'password'
    },

        function(email, password, done)
        {
            User.findOne({email :  email}, function(err, user)
            {
                if (err)                           return done(err);
                if (!user)                         return done(null, false, { message: 'Incorrect username.' });
                if (!user.validPassword(password)) return done(null, false, { message: 'Incorrect password.' });

                return done(null, user);
            });

        }));


    // REGISTER
    // ==============================================

    passport.use('register', new LocalStrategy(
    {
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },

        function(req, email, password, done)
        {
            User.findOne({email :  email}, function(err, user)
            {
                if (err) return done(err);

                if (user) 
                {
                    return done(null, false, { message: 'Email already exists.' });
                }
                else
                {
                    var newUser = new User();

                    newUser.email     = email;
                    newUser.password  = newUser.generateHash(password);
                    newUser.firstName = req.body.firstName;
                    newUser.lastName  = req.body.lastName;
                    newUser.url       = req.body.firstName.toLowerCase() + req.body.lastName.toLowerCase();

                    newUser.save(function(err)
                    {
                        if (err) { throw err; }
                        return done(null, newUser);
                    });
                }
            });
        })
    );
}