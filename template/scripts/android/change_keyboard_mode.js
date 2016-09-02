var fs = require('fs');

// Change android keyboard mode to "adjustPan".
// I prefer this mode because it doesn't resize the viewport and thus is more elegant visually and less cumbersome during development.
// The downside is to insert a padding bottom where necessary to allows hidden content (by keyboard) to scroll.
module.exports = function () {
    var manifestPath = 'platforms/android/AndroidManifest.xml';
    var manifest = fs.readFileSync(manifestPath, 'utf8');

    console.log('Android manifest file found');

    manifest = manifest.replace(/android:windowSoftInputMode="[^"]+"/, 'android:windowSoftInputMode="adjustPan"');

    fs.writeFileSync(manifestPath, manifest, 'utf8');

    console.log('Android manifest updated. Changed windowSoftInputMode to adjustPan');
};
