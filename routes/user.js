var passport = require('passport');
var express  = require('express');

var router = express.Router();

// MODELS
// ==============================================

var User = require('../models/user');
var Settings = require('../models/settings');

router.use(function (req, res, next)
{
        Settings.findOne(function(err, blog)
        {
            if (!err)
            {
                res.blog = blog;
            }
            else
            {
                return next(err);
            }
        });
    next();
});

// LOGIN
// ==============================================

router.route('/login')

    // GET
    // =========

    .get(notLoggedIn, function(req, res)
    {
        res.render('admin/login', { message: req.flash('error'), blog: res.blog });
    })

    // POST
    // =========

    .post(passport.authenticate('login',
    {
        successRedirect : '/admin',
        failureRedirect : '/admin/login',
        failureFlash : true
    }));

// REGISTER
// ==============================================

router.route('/register')

    // GET
    // ===========

    .get(isLoggedIn, function(req, res)
    {
        res.render('admin/register', { message: req.flash('error'), user: req.user, blog: res.blog });
    })

    // POST
    // ===========

    .post(isLoggedIn, passport.authenticate('register',
    {
        successRedirect : '/',
        failureRedirect : '/admin/register',
        failureFlash : true
    }));

// LOGOUT
// ==============================================

router.route('/logout')

    .get(function(req, res)
    {
        req.logout();
        res.redirect('/');
    });


// USER ADMIN
// ==============================================

router.route('/users')

    .get(isLoggedIn, function(req, res)
    {
        User.find(function(err, users)
        {
            if (!err)
            {
                res.render('admin/users', {users: users, user: req.user, blog: res.blog});
            }
            else
            {
                return next(err);
            }
        });
    });

// DELETE USER
// ==============================================

router.route('/user/:url/delete')

    .get(isLoggedIn, function(req, res, next)
    {
        User.remove({url: req.params.url}, function(err, post)
        {
            if(!err)
            {
                res.redirect('/admin/users');
            }
            else
            {
               return next(err); 
            }
        });
    });


// EDIT USER
// ==============================================

router.route('/user/:url/edit')

    .get(isLoggedIn, function(req, res, next)
    {
        User.findOne({url: req.params.url}, function(err, userinfo)
        {
            if(userinfo)
            {
                res.render('admin/useredit', { userinfo: userinfo, message: req.flash('success'), user: req.user, blog: res.blog});
            }
            else
            {
                return next(err);
            }
        });
    })

    .post(isLoggedIn, function(req, res, next)
    {
        User.findOne({url: req.params.url}).exec(function(err, userinfo)
        {
            userinfo.email     = req.body.email;
            userinfo.password  = userinfo.generateHash(req.body.password);
            userinfo.firstName = req.body.firstName;
            userinfo.lastName  = req.body.lastName;
            userinfo.url       = req.body.firstName.toLowerCase() + req.body.lastName.toLowerCase();

            userinfo.save(function(err)
            {
                if(!err)
                { 
                    req.flash('success', 'User updated');
                    res.redirect('/admin/user/' + userinfo.url + '/edit');
                }
                else
                {
                    return next(err);  
                }
            });
        });
    });

// LOGGED IN CHECKS
// ==============================================

function notLoggedIn(req, res, next)
{
    if (!req.isAuthenticated()) return next();
    res.redirect('/');
}

function isLoggedIn(req, res, next)
{
    if (req.isAuthenticated()) return next();
    res.redirect('/');
}

// EXPORT
// ==============================================

module.exports = router;