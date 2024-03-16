// ==UserScript==
// @name         HTTP Request Analyzer
// @namespace    http://your.namespace.com
// @version      1.0
// @description  Analyze HTTP requests and responses
// @author       Your Name
// @match        https://example.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Intercept XMLHttpRequest
    var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        var requestDetails = 'HTTP Request:\n\n' + method + ' ' + url;
        var requestWindow = window.open('', '_blank');
        requestWindow.document.write('<pre>' + requestDetails + '</pre>');
        requestWindow.document.close();

        this.addEventListener('load', function() {
            var responseDetails = 'HTTP Response:\n\n' + this.status + ' ' + this.responseText;
            var responseWindow = window.open('', '_blank');
            responseWindow.document.write('<pre>' + responseDetails + '</pre>');
            responseWindow.document.close();
        });

        origOpen.apply(this, arguments);
    };
})();
