const config = {
    stepsPerSecond: 10,
    serverUrl: process.env.NODE_ENV === "production" ?
        "ws://" + window.location.host + "/ws" :
        (window.location.hostname === "localhost") ?
            "ws://localhost:8080/ws" : "ws://" + window.location.host + "/ws",
};

export default config;
