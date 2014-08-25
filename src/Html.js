var _ = require('lodash');
var createKey = require('./AssetHelper').createKey;

module.exports = {
    createHtmlFiles:createHtmlFiles
}

function createHtmlFiles(bosco, staticAssets, next) {

    var htmlAssets = {},
        port = bosco.config.get('cdn:port') || "7334";

    _.forOwn(staticAssets, function(value, key) {

        var html,
            htmlFile = createKey(bosco, value.tag, value.type, 'html', 'html'),
            cdn = bosco.config.get('aws:cdn') ? bosco.config.get('aws:cdn') : 'http://localhost:' + port;

        if ((value.type == 'js' && value.extname == '.js') || value.type == 'css') {

            htmlAssets[htmlFile] = htmlAssets[htmlFile] || {
                content: "",
                type: "html",
                assetType: value.type,
                tag: value.tag,
                extname: ".html"
            };

            if (value.type == 'js') {
                htmlAssets[htmlFile].content += _.template('<script src="<%= url %>"></script>\n', {
                    'url': cdn + "/" + key
                });
            } else {
                htmlAssets[htmlFile].content += _.template('<link rel="stylesheet" href="<%=url %>" type="text/css" media="screen" />\n', {
                    'url': cdn + "/" + key
                });
            }
        }

    });

    staticAssets = _.merge(htmlAssets, staticAssets);

    next(null, staticAssets);

}