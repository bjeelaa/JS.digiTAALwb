// ==UserScript==
// @name            Oplossingenverklapper voor digiTAAL Werkboek
// @namespace       https://github.com/bjeelaa/JS.digiTAALwb
// @version         1.0
// @description     Dit scriptje geeft je de juiste antwoorden op oefeningen op het digiTAAL Werkboek platform
// @author          bzh
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
            console.log(rawResponseBody);
            var parsedBody = JSON.parse(rawResponseBody);
            console.log(parsedBody);
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
                if (!items[keys[i]].options) {
                    keys.splice(i, 1);
                };
            };

            var htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Oplossingen</title>
  <meta charset="UTF-8">
  <style>
    p, button {
      display: inline-block;
    }
  </style>
</head>
<body>
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
                htmlContent = htmlContent + '  <p id="' + k + '">' + (k+1).toString() + '. ' + answer + `</p> <button onclick="copyText('` + k + `')">Kopieer</button><br/>
`;
            };
            htmlContent = htmlContent + `<script>
    function copyText(id) {
      var paragraph = document.getElementById(id);
      var text = paragraph.textContent;
      var index = 0;
      while (index < text.length && !isNaN(parseInt(text[index]))) {
        index++;
      };
      var newText = text.slice(index+1).trim();
      navigator.clipboard.writeText(newText);
    };
  </script>
</body>
</html>`;
            console.log(htmlContent);
            var blob = new Blob([htmlContent], { type: 'text/html' });
            var url = URL.createObjectURL(blob);
            window.open(url, '_blank', 'width=600,height=600');
            URL.revokeObjectURL(url);
        });
        origOpen.apply(this, arguments);
    };
})();
