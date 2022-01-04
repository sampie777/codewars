const serverUrl = {
    production: "ws://" + window.location.host + "/ws",
    localhost: "ws://localhost:8080/ws",
    other: "ws://" + window.location.host + "/ws"
}

const config = {
    stepsPerSecond: 10,
    serverUrl: process.env.NODE_ENV === "production" ?
        serverUrl.production :
        (window.location.hostname === "localhost") ?
            serverUrl.localhost : serverUrl.other,
    serverUseSecureConnection: window.location.protocol === "https:",
    socketWaitTillClosedTimeout: 5000,
};

export default config;
