'use strict';

const uri = "ws:localhost:3000";
const username = "test_streamer"
const user_info = "TD"

//Socket/setup
const websocket = new WebSocket(uri);
const video = document.querySelector("video");

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

};

function processAnswer(id, answer) {

};

function processCandidate(id, candidate) {

};

window.onunload = window.onbeforeunload = () => {
    websocket.close();
};