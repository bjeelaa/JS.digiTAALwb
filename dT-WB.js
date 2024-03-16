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
        console.log('HTTP Request:', method, url);
        this.addEventListener('load', function() {
            console.log('HTTP Response:', this.status, this.responseText);
        });
        origOpen.apply(this, arguments);
    };
})();
