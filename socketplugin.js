// # Socket Plugin Module

// Module dependencies
var when        = require('when'),
    express     = require('express'),
    errors      = require('./server/errorHandling'),
    fs          = require('fs'),
    path        = require('path'),
    plugins     = require('./server/plugins');
