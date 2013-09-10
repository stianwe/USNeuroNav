$.index.open();


var vidWin = Titanium.UI.createWindow({
    title : 'Video View Demo',
    backgroundColor : '#fff'
});

var videoPlayer = Titanium.Media.createVideoPlayer({
    top : 2,
    autoplay : true,
    backgroundColor : 'blue',
    height : 300,
    width : 300,
    mediaControlStyle : Titanium.Media.VIDEO_CONTROL_DEFAULT,
    scalingMode : Titanium.Media.VIDEO_SCALING_ASPECT_FIT
});

videoPlayer.url = 'http://192.168.0.104/app/short.mp4';
vidWin.add(videoPlayer);
vidWin.open();


