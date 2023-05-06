'use strict';

const uri = "ws:localhost:3000";
const username = "test_streamer"
const user_info = "TD"

//Socket/setup
const websocket = new WebSocket(uri);
const video = document.querySelector("video");

//Websocket
websocket.onopen = () => {
};

websocket.onclose = () => {
};

websocket.onmessage = e => {
};

