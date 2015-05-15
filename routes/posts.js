var express = require('express');
var router = express.Router();

// MODELS
// ==============================================

var Post     = require('../models/post');
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

// ALL POSTS
// ==============================================

router.route('/')

    .get(function(req, res, next)
    {
        Post.find({}).sort({'date': -1}).exec(function(err, posts)
        {
            if (!err)
            {
                res.render('posts/index', {posts: posts, user: req.user, blog: res.blog});
            }
            else
            {
                return next(err);
            }
        });
    });

// SINGLE POST
// ==============================================

router.route('/:url')

    .get(function(req, res, next)
    {
        Post.findOne({url: req.params.url}, function(err, post)
        {
            if(post)
            {
                res.render('posts/single',
                {
                    post: post,
                    user: req.user,
                    blog: res.blog
                });
            }
            else
            {
                return next(err);
            }
        });
    });

// POST BY AUTHOR
// ==============================================

router.route('/author/:author')

    .get(function(req, res, next)
    {
        Post.find({authorUrl: req.params.author}).sort({'date': -1}).exec(function(err, posts)
        { 
            if(posts)
            {
                res.render('posts/index',
                {
                    posts: posts,
                    user: req.user,
                    blog: res.blog
                });
            }
            else
            {
                return next(err);
            }
        })
    });


// POST BY YEAR
// ==============================================

router.route('/archive/:year')

    .get(function(req, res, next)
    {
        Post.find({'date':
        { 
            $gte: new Date(req.params.year, 1, 1), 
            $lte: new Date(req.params.year, 12, 31) }})
            .sort({'date': -1})
            .exec(function(err, posts)
            {
                if(posts)
                {
                    res.render('posts/index',
                    { 
                        posts: posts, 
                        user: req.user,
                        blog: res.blog
                    });
                }
                else
                {
                    return next(err);
                }
            });
    });

// POST BY MONTH
// ==============================================

router.route('/archive/:year/:month')

    .get(function(req, res, next)
    {
        Post.find({'date':
        { 
            $gte: new Date(req.params.year, req.params.month - 1, 1), 
            $lte: new Date(req.params.year, req.params.month - 1, 31) }})
            .sort({'date': -1})
            .exec(function(err, posts)
            {
                if(posts)
                {
                    res.render('posts/index',
                    { 
                        posts: posts, 
                        user: req.user,
                        blog: res.blog
                    });
                }
                else
                {
                    return next(err);
                }
            });
    });

// POST BY DAY
// ==============================================

router.route('/archive/:year/:month/:day')

    // GET
    // =========

    .get(function(req, res, next)
    {
        Post.find({'date':
        { 
            $gte: new Date(req.params.year, req.params.month - 1, req.params.day, 00, 00, 00, 00),
            $lte: new Date(req.params.year, req.params.month - 1, req.params.day, 23, 59, 59, 59) }})
            .sort({'date': -1})
            .exec(function(err, posts)
            {
                if(posts)
                {
                    res.render('posts/index',
                    { 
                        posts: posts, 
                        user: req.user,
                        blog: res.blog
                    });
                }
                else
                {
                    return next(err);
                }
            });
    });

// ADMIN PANAL
// ==============================================

router.route('/admin')

    .get(function(req, res, next)
    {

        if (req.isAuthenticated())
        {
            Post.find({}).sort({'date': -1}).exec(function(err, posts)
            {
                if (!err)
                {
                    res.render('admin/index', {posts: posts, user: req.user, blog: res.blog});
                }
                else
                {
                    return next(err);
                }
            });
        }
        else
        {
            res.redirect('/admin/login');
        }
    });

// ADD POST
// ==============================================

router.route('/admin/add')

    .get(loggedIn, function(req, res, next)
    {
        res.render('admin/add',
        { 
            message: req.flash('success'),
            user: req.user,
            blog: res.blog
        });
    })

    .post(loggedIn, function(req, res, next)
    {
        var post = new Post();

        post.title     = req.body.title;
        post.url       = req.body.url;
        post.author    = req.body.author;
        post.authorUrl = req.body.author.replace(/\s/g, '').toLowerCase();
        post.content   = req.body.content;

        post.save(function(err)
        {
            if(!err)
            {
                req.flash('success', 'Post created - <a href="/' + post.url + '">View Post</a>');
                res.redirect('/' + post.url + '/edit');
            }
            else
            {
                return next(err);
            }
        });
    });

// EDIT POST
// ==============================================

router.route('/:url/edit')

    .get(loggedIn, function(req, res, next)
    {
        Post.findOne({url: req.params.url}, function(err, post)
        {
            if(post)
            {
                res.render('admin/edit', { post: post, message: req.flash('success'), user: req.user, blog: res.blog});
            }
            else
            {
                return next(err);
            }
        });
    })

    .post(loggedIn, function(req, res, next)
    {
        Post.findOne({url: req.params.url}).exec(function(err, post)
        {
            post.title      = req.body.title;
            post.author     = req.body.author;
            post.authorUrl  = req.body.author.replace(/\s/g, '').toLowerCase();
            post.content    = req.body.content;
            post.url        = req.body.url;

            post.save(function(err)
            {
                if(!err)
                { 
                    req.flash('success', 'Post updated - <a href="/' + post.url + '">View Post</a>');
                    res.redirect('/' + post.url + '/edit');
                }
                else
                {
                    return next(err);  
                }
            });
        });
    });


// DELETE POST
// ==============================================

router.route('/:url/delete')

    .get(loggedIn, function(req, res, next)
    {
        Post.remove({url: req.params.url}, function(err, post)
        {
            if(!err)
            {
                res.redirect('/admin');
            }
            else
            {
               return next(err); 
            }
        });
    });

// SETTINGS
// ==============================================

router.route('/admin/settings')

    .get(loggedIn, function(req, res, next)
    {
        Settings.findOne(function(err, blog)
        {
            if (!err)
            {
                res.render('admin/config', { blog: blog, message: req.flash('success'), user: req.user, blog: res.blog});
            }
            else
            {
                return next(err);
            }
        });
    })

    .post(loggedIn, function(req, res, next)
    {
        Settings.findOne({id: 0}).exec(function(err, blog)
        {

            blog.title       = req.body.title;
            blog.description = req.body.description;

            blog.save(function(err)
            {
                if(!err)
                { 
                    req.flash('success', 'Settings updated');
                    res.redirect('/admin/settings');
                }
                else
                {
                    return next(err);  
                }
            });

        });  
    });



// LOGGED IN CHECK
// ==============================================

function loggedIn(req, res, next)
{
    if (req.isAuthenticated()) return next();
    res.redirect('/');
}

// EXPORT
// ==============================================

module.exports = router;