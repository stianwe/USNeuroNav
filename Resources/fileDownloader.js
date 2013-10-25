function downloadFile(src, dst) {
    var dstFile = Titanium.Filesystem.getFile(dst);
    var httpClient = Ti.Network.createHTTPClient();
    httpClient.onload = function() {
        alert("ONLOAD!");
    };
    httpClient.onreadystatechange = function() {
        alert("ONREADYSTATECHANGE: " + httpClient.readyState);
        4 == httpClient.readyState && dstFile.write(httpClient.responseData);
    };
    alert("Preparing to send to: " + src);
    httpClient.open("GET", src, false);
    httpClient.send(null);
}

exports.downloadFile = downloadFile;