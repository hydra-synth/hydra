var mediaStreamInUse;

function setError(err, $featureContainer) {
    if ($featureContainer) {
        $featureContainer.toggleClass('hide', !!err);
    }
    $('.error-message').toggleClass('hide', !err).text(err && err.message);
}

function buildConstraints(audioDeviceId, videoDeviceId) {
    var mediaConstraints = {};
    if (audioDeviceId) {
        mediaConstraints.audio = {
            optional: [ { sourceId: audioDeviceId} ]
        };
    } else {
        mediaConstraints.audio = true;
    }
    if (videoDeviceId) {
        mediaConstraints.video = {
            deviceId: { exact: videoDeviceId }
        };
    } else {
        mediaConstraints.video = true;
    }
    return mediaConstraints;
}

function getVideoWithDevices(audioDeviceId, videoDeviceId) {
    var constraints = buildConstraints(audioDeviceId, videoDeviceId);
    if (mediaStreamInUse) {
        mediaStreamInUse.stop();
    }
    getUserMedia(constraints, function(err, stream) {
        if (setError(err, $('#video-display'))) return;
        var options = {
            mirror: true,
            muted: false,
            audio: false,
            autoPlay: true
        };
        mediaStreamInUse = stream;
        attachMediaStream(stream, $('#video-preview')[0], options);
        updateDeviceOptions();
        $('#get-started').addClass('hide');
    });
}
function updateDeviceOptions () {
    enumerateDevices().then(function(devices) {
        setError(null);
        var selectedAudio = $('#audio-options').val();
        var selectedVideo = $('#video-options').val();

        $('#audio-options').find('option').remove();
        $('#video-options').find('option').remove();

        var audioDevicesCount = 0;
        var videoDevicesCount = 0;
        for (var i = 0; i < devices.length; i++) {
            var device = devices[i];
            var label = device.label;
            if (device.kind === 'audioinput') {
                audioDevicesCount++;
                label = label || 'Microphone ' + audioDevicesCount;
                $('#audio-options').append($('<option/>').val(device.deviceId).text(label));
            } else if (device.kind === 'videoinput') {
                videoDevicesCount++;
                label = label || 'Camera ' + videoDevicesCount;
                $('#video-options').append($('<option/>').val(device.deviceId).text(label));
            }
        }
        if (selectedAudio && $('#audio-options').find('option[value="' + selectedAudio +'"]')) {
            $('#audio-options').val(selectedAudio);
        } else {
            $('#audio-options')[0].selectedIndex = 0;
        }

        if (selectedVideo && $('#video-options').find('option[value="' + selectedAudio +'"]')) {
            $('#video-options').val(selectedVideo);
        } else {
            $('#video-options')[0].selectedIndex = 0;
        }
    }).catch(function(err) {
        setError(err, $('#video-display, #device-selection'));
    });
}

$(function() {
    updateDeviceOptions();
    $('#refresh-video').click(function() {
        var audioDeviceId = $('#audio-options').val();
        var videoDeviceId = $('#video-options').val();
        getVideoWithDevices(audioDeviceId, videoDeviceId);
    });

    if (window.location.protocol.indexOf('https') > -1) {
        $('#http-message').hide();
    }
});
