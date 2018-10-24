'use strict';

var battery = {
    service: "180F",
    level: "2A19"
};

var app = {
    initialize: function() {
        this.bindEvents();
        detailPage.hidden = true;
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        refreshButton.addEventListener('touchstart', this.refreshDeviceList, false);
        batteryStateButton.addEventListener('touchstart', this.readBatteryState, false);
        disconnectButton.addEventListener('touchstart', this.disconnect, false);
        button.addEventListener('touchstart', this.connect, false);
    },
    onDeviceReady: function() {
        app.refreshDeviceList();
    },
    refreshDeviceList: function() {
        deviceList.innerHTML = ''; // empties the list
        // scan for all devices
        ble.scan([], 5, app.onDiscoverDevice, app.onError);
    },
    onDiscoverDevice: function(device) {
        console.log('New device: ', JSON.stringify(device));

        if (typeof device.name === 'string') {
            var listItem = document.createElement('li');
            var button = document.createElement('button');
            button.id = device.id;
            button.innerHtml = device.name + '<br/>' +
                    'RSSI: ' + device.rssi + '&nbsp;|&nbsp;' +
                    device.id;

            listItem.dataset.deviceId = device.id;  // TODO
            listItem.appendChild(button);
            deviceList.appendChild(listItem);
        }
    },
    connect: function(e) {
        var deviceId = e.target.dataset.deviceId,
            onConnect = function() {
                ble.startNotification(deviceId, battery.service, battery.level, app.onBatteryLevelChange, app.onError);
                batteryStateButton.dataset.deviceId = deviceId;
                disconnectButton.dataset.deviceId = deviceId;
                app.showDetailPage();
            };

        ble.connect(deviceId, onConnect, app.onError);
    },
    onBatteryLevelChange: function(data) {
        console.log('onBatteryLevelChange', data);
        var batteryLevel = new Uint8Array(data);
        batteryState.innerHTML = batteryLevel[0];
    },
    readBatteryState: function(event) {
        console.log('readBatteryState');
        var deviceId = event.target.dataset.deviceId;
        ble.read(deviceId, battery.service, battery.level, app.onReadBatteryLevel, app.onError);
    },
    onReadBatteryLevel: function(data) {
        console.log('onReadBatteryLevel', data);
        var batteryLevel = new Uint8Array(data);
        batteryState.innerHTML = batteryLevel[0];
    },
    disconnect: function(event) {
        var deviceId = event.target.dataset.deviceId;
        ble.disconnect(deviceId, app.showMainPage, app.onError);
    },
    showMainPage: function() {
        mainPage.hidden = false;
        detailPage.hidden = true;
    },
    showDetailPage: function() {
        mainPage.hidden = true;
        detailPage.hidden = false;
    },
    onError: function(reason) {
        alert('ERROR: ' + JSON.stringify(reason, 0, 4)); // real apps should use notification.alert
    }
};