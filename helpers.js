var hbs = require('hbs');

// EXCERPT
// ==============================================

hbs.registerHelper('short', function(str)
{
    return new hbs.SafeString(str.substring(0,250) + '...');
});

// DATE FORMAT
// ==============================================

hbs.registerHelper('dateFormat', function(str)
{
    return new hbs.SafeString(str.toDateString());
});

// DATE URL
// ==============================================

hbs.registerHelper('dateLink', function(str)
{
    date = new Date(str);

    var day   = date.getDate();
    var month = date.getMonth();
    var year  = date.getFullYear();
    return new hbs.SafeString(year + '/' + ("0" + (month + 1)).slice(-2) + '/' + day);
});
