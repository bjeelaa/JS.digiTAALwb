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
        console.log('HTTP Request:', method, url);
        this.addEventListener('load', function() {
            console.log('HTTP Response:', this.status, this.responseText);
            var rawResponseBody = this.responseText;
            var parsedBody = JSON.parse(rawResponseBody);
            var definition = parsedBody.definition;
            console.log(definition);
        });
        origOpen.apply(this, arguments);
    };
})();
