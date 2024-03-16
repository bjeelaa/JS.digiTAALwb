// ==UserScript==
// @name         Oplossingenverklapper voor digiTAAL Werkboek
// @namespace    https://github.com/bjeelaa/JS.digiTAALwb
// @version      1.0
// @description  Dit scriptje geeft je de juiste antwoorden op oefeningen op het digiTAAL Werkboek platform
// @author       bzh
// @match        https://www.explio.com/digwb/*
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
