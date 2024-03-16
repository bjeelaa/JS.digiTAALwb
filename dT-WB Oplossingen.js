// ==UserScript==
// @name         Oplossingenverklapper voor digiTAAL Werkboek
// @namespace    https://github.com/bjeelaa/JS.digiTAALwb
// @version      1.0
// @description  Dit scriptje geeft je de juiste antwoorden op oefeningen op het digiTAAL Werkboek platform
// @author       bzh
// @match        https://www.explio.com/digwb/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    console.log(pako);
    function decodeData(encodedData) {
        return pako.ungzip(atob(encodedData), { "to": "string" });
    }

    // Intercept XMLHttpRequest
    var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        console.log('HTTP Request:', method, url);
        this.addEventListener('load', function () {
            console.log('HTTP Response:', this.status, this.responseText);
            var rawResponseBody = this.responseText;
            var parsedBody = JSON.parse(rawResponseBody);
            var definition = parsedBody.definition;
            console.log(definition);
            var decodedDefinition = decodeData(definition);
            console.log(decodedDefinition);
            var parsedDefinition = JSON.parse(decodedDefinition);
            console.log(parsedDefinition);
            var items = parsedDefinition.items;
            console.log(items);
            var keys = Object.keys(items);
            console.log(keys);

            for (var i = 0; i < keys.length; i++) {
                if (keys[i].length != 36) {
                    keys.splice(i, i);
                };
            };
            console.log(keys);

            var htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Oplossingen</title>
</head>
<body>
  <h1>De oplossingen voor je oefening:</h1>
`;

            for (var k = 0; k < keys.length; k++) {
                var key = keys[k];
                var options = items[key].options;
                for (var j = 0; j < options.length; j++){
                    if(options[j].correct){
                        var answer = options[j].text;
                        break;
                    };
                };
                htmlContent = htmlContent + '  <p>' + (k+1).toString() + '. ' + answer + `</p>
`;
            };
            htmlContent = htmlContent + `</body>
</html>`;
            console.log(htmlContent);
            var blob = new Blob([htmlContent], { type: 'text/html' });
            var url = URL.createObjectURL(blob);
            window.open(url, '_blank', 'width=400,height=400');
            URL.revokeObjectURL(url);
        });
        origOpen.apply(this, arguments);
    };
})();