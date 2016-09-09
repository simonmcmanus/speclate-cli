# speclate-cli


#API

##Site

###speclate.site.markup(spec, callback)

Given a spec (a collection of pages) Generate static html pages.


```js
    var speclate = require('speclate-cli');
    var spec = {
        '/': {
            page: 'home'
        }
    };
    speclate.site.markup(spec, function(errors) {
        if(!error) {
            console.log('done generating site');
        }
    });
```
