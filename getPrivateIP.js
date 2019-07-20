var ipaddress_public;
var ipaddress_private;

function send_ip(key_value){
	
	url = "http://localhost/local-ip-server-side.php?";
	
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", url + key_value, true);
	xhttp.send();
}

// https://www.ipify.org/
function getPublicIP(json) {   
    document.cookie = "ipaddress_public="+json.ip;
    send_ip("ipaddress_public="+json.ip);
  }

// https://jsfiddle.net/ourcodeworld/cks0v68q/
function getLocalIP(onNewIP) { //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({
        iceServers: []
    }),
    noop = function() {},
    localIPs = {},
    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
    key;

    function iterateIP(ip) {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
    }

     //create a bogus data channel
    pc.createDataChannel("");

    // create offer and set local description
    pc.createOffer(function(sdp) {
        sdp.sdp.split('\n').forEach(function(line) {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });
        
        pc.setLocalDescription(sdp, noop, noop);
    }, noop); 

    //listen for candidate events
    pc.onicecandidate = function(ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
}

getLocalIP(function(ip){
	document.cookie = "ipaddress_private="+ip;
	send_ip("ipaddress_private="+ip);
	
});
