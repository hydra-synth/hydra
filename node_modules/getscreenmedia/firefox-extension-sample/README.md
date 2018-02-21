Mozilla Firefox added support for screensharing in Firefox 33. The feature is currently only enabled for a small number of whitelisted domains which can be specified in the preferences.
This extension is a [bootstrapped extension](https://developer.mozilla.org/en/Add-ons/Bootstrapped_extensions) that adds and removes [simplewebrtc.com](https://simplewebrtc.com) from the screensharing whitelist preference without user interaction.

Firefox 52 [will drop](https://www.mozilla.org/en-US/firefox/52.0a2/auroranotes/) the use of a whitelist and therefore also the need for a domain-specific extension.

## How to build your own extension
1. Download this code
2. Replace `simplewebrtc.com` with your domain in `bootstrap.js`
3. If necessary change name and description
4. Create the XPI: `zip screenshare.xpi bootstrap.js install.rdf`
4. [Publish your extension](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Publishing_your_WebExtension)

## License
MPL 2.0

Based on an [example by Mozilla's Brad Lassey](https://hg.mozilla.org/users/blassey_mozilla.com/screenshare-whitelist/) which is licensed under MPL 2.0
