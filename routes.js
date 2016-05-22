/**
 * Created by Ivan on 17.05.2016.
 */
/**
 * Main application routes
 */

'use strict';

var path = require('path');

module.exports = function(app) {

    // Insert routes below
    app.use('/users', require('./controler/user'));
    app.use('/news', require('./controler/news'));

    // All undefined asset or controler routes should return a 404
    app.route('/:url(controler|auth|components|app|bower_components|assets)/*')


    // All other routes should redirect to the index.html
    app.route('/*')
        //.get(function(req, res) {
        //    res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
        //});
};