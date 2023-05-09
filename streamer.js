'use strict';

const uri = "ws:localhost:3000";
const username = "test_streamer"
const user_info = "TD"

//Socket/setup
const websocket = new WebSocket(uri);
const video = document.querySelector("video");

//WebRTC
const peerConnections = {};
const RTCConfig = {
    iceServers: [
        {
            "urls": "stun:stun.l.google.com:19302",
        }
    ]
};

// Media constrains
const constraints = {
    video: { facingMode: "user", width: {exact: 1280}, height: {exact: 720} },
    mimeType: 'video/VP8'
    // audio: true
};

//Setup streaming
navigator.mediaDevices
.getUserMedia(constraints)
.then(stream => {
    video.srcObject = stream;
})
.catch(error => console.error(error));



//Websocket
websocket.onopen = () => {
    websocket.send("U\n" + username + "\n" + user_info);
};

websocket.onclose = () => {
};

websocket.onmessage = e => {
    let parts = e.data.split("\n", 5);
    if (parts[0] == "R") {
        newSubscriber(parts[1]);
    } else if (parts[0] == "A") {
        processAnswer(parts[1], JSON.parse(parts[2]));
    } else if (parts[0] == "C") {
        processCandidate(parts[1], JSON.parse(parts[2]));
    };
};

function newSubscriber(id) {
    const peerConnection = new RTCPeerConnection(RTCConfig);
    peerConnections[id] = peerConnection;

    //Set streaming
    let stream = video.srcObject;
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

    //Candidate
    peerConnection.onicecandidate = e => {
        if (e.candidate) {
            websocket.send("C\n" + id + "\n" + JSON.stringify(e.candidate));
        };
    };

    //Create and send offer
    peerConnection
    .createOffer()
    .then(sdp => peerConnection.setLocalDescription(sdp))
    .then(() => {
        websocket.send("O\n" + id + "\n" + JSON.stringify(peerConnection.localDescription));
    });

    peerConnection.onconnectionstatechange = () => {
        console.log("Disconnecting peer");
        if (peerConnection.iceConnectionState == 'disconnected') {
            peerConnections[id].close();
            delete peerConnections[id];
        };
    };
};

function processAnswer(id, answer) {
    if (id in peerConnections) {
        peerConnections[id].setRemoteDescription(answer);
    };
};

function processCandidate(id, candidate) {
    peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
};

window.onunload = window.onbeforeunload = () => {
    websocket.close();
};