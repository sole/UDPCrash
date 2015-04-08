window.addEventListener('DOMContentLoaded', function() {

 'use strict';

  const ECHO_PORT = 7;
  var inSocket = null;
  var floodInterval = null;
  var info = document.getElementById('info');
  var pingTxt = document.getElementById('ping');
  var wifiManager = navigator.mozWifiManager;

  if(!wifiManager) {
    log('WifiManager not available');
  } else {
 
    var decoder = new TextDecoder('utf-8');   
    var status = wifiManager.connection.status;
    var connInfo = wifiManager.connectionInformation;

    setupSockets();
    
    var host = document.getElementById('host');
    var pingInterval = document.getElementById('interval');
    var btnFlood = document.getElementById('flood');
    var btnStop = document.getElementById('stop');
    btnFlood.addEventListener('click', startFlood);
    btnStop.addEventListener('click', stopFlood);

    var fields = [];
    fields.push(['mac', wifiManager.macAddress]);

    if(status === 'associated' || status === 'connected') {
      var network = wifiManager.connection.network;
      fields.push(['Network name', network.ssid]);
      fields.push(['Security', network.security]);
    }

    if(connInfo) {
      fields.push(['ip', connInfo.ipAddress]);
      host.value = connInfo.ipAddress;
    }
    
    fields.push(['socket', `listening on port ${ECHO_PORT}`]);
    
    var txt = fields.map(function(pair) {
      return `<strong>${pair[0]}: </strong> ${pair[1]}`;
    }).join('<br />');
    log(txt);
    console.log('hey');
  }

  function log(txt) {
    info.innerHTML += txt + '<br />';
  }

  function setupSockets() {
    inSocket = new UDPSocket({
      localPort: ECHO_PORT
    });

    inSocket.onmessage = (message) => {
      var decoded = decoder.decode(message.data);
      pingTxt.innerHTML = 'ping ' + decoded;
    };
  }

  function startFlood() {
    var hostToFlood = host.value;
    var intervalLength = pingInterval.value * 1;
    btnFlood.disabled = true;
    btnStop.disabled = false;

    var sequence = 0;
    floodInterval = setInterval(function() {
      ping(hostToFlood, sequence);
      sequence++;
    }, intervalLength);
  }

  function stopFlood() {
    btnFlood.disabled = false;
    btnStop.disabled = true;
    clearInterval(floodInterval);
  }

  function ping(host, message) {
    console.log('ping', host, message);
    var socket = new UDPSocket({
      remoteAddress: host,
      remotePort: ECHO_PORT
    });

    socket.opened.then(() => {
      socket.send(message);
      // If the socket is closed, the app doesn't crash
      // socket.close();
    });
  }

});
