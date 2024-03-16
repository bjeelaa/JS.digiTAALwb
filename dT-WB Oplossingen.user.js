// ==UserScript==
// @name            Oplossingenverklapper voor digiTAAL Werkboek
// @namespace       https://github.com/bjeelaa/JS.digiTAALwb
// @version         1.0
// @description     Dit scriptje geeft je de juiste antwoorden op oefeningen op het digiTAAL Werkboek platform
// @author          bjeelaa
// @license         MIT
// @icon            https://raw.githubusercontent.com/bjeelaa/bjeelaa.github.io/master/favicon.ico
// @match           https://www.explio.com/digwb/*
// @grant           none
// ==/UserScript==

(function () {
    'use strict';

    function decodeData(encodedData) {
        return pako.ungzip(atob(encodedData), { "to": "string" });
    }

    // Intercept XMLHttpRequest
    var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        this.addEventListener('load', function () {
            var rawResponseBody = this.responseText;
            var parsedBody = JSON.parse(rawResponseBody);
            var definition = parsedBody.definition;
            var decodedDefinition = decodeData(definition);
            var parsedDefinition = JSON.parse(decodedDefinition);
            var items = parsedDefinition.items;
            console.log(items);
            var keys = Object.keys(items);
            console.log(keys);

            for (var i = 0; i < keys.length; i++) {
                if (!items[keys[i]].options) {
                    keys.splice(i, 1);
                };
            };
            console.log(keys);

            var htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Oplossingen</title>
  <meta charset="UTF-8">
</head>
<body>
  <h1>bjeelaa's oplossingenverklapper</h1>
  <h2>De oplossingen voor je oefening:</h2>
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
