

function downloadFile(src, dst) {
	var dstFile = Titanium.Filesystem.getFile(dst);
	var httpClient = Ti.Network.createHTTPClient();
	httpClient.onload = function() {
		alert("ONLOAD!");
	};
	httpClient.onreadystatechange = function() {
		alert("ONREADYSTATECHANGE: " + httpClient.readyState);
		if (httpClient.readyState == 4) {
			dstFile.write(httpClient.responseData);
			//alert("4!!!!");
		}
	};
	/*
	httpClient.onerror = function(e) {
		alert(e);
	};*/
	alert("Preparing to send to: " + src);
	httpClient.open("GET", src, false);
	httpClient.send(null);
}

exports.downloadFile = downloadFile;