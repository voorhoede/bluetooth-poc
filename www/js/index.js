'use strict';

// https://www.bluetooth.com/specifications/gatt/characteristics
const battery = {
	service: '180F',
	level: '2A19'
}

var mainPage = document.getElementById('main-page');
var detailPage = document.getElementById('detail-page');
var deviceList = document.getElementById('device-list');
var refreshButton = document.getElementById('refresh-button');
var batteryState = document.getElementById('battery-state');
var batteryStateButton = document.getElementById('battery-state-button');
var disconnectButton = document.getElementById('disconnect-button');

var app = {
	initialize: function () {
		this.bindEvents();
		detailPage.hidden = true;
	},
	bindEvents: function () {
		document.addEventListener('deviceready', this.onDeviceReady, false);
		refreshButton.addEventListener('click', this.refreshDeviceList, false);
		batteryStateButton.addEventListener('click', this.readBatteryState, false);
		disconnectButton.addEventListener('click', this.disconnect, false);
		deviceList.addEventListener('click', this.connect, false);
	},
	onDeviceReady: function () {
		app.refreshDeviceList();
	},
	refreshDeviceList: function () {
		deviceList.innerHTML = '';
		ble.scan([], 5, app.onDiscoverDevice, app.onError);
	},
	onDiscoverDevice: function (device) {
		if (typeof device.name === 'string') {
			var listItem = document.createElement('li');
			var html = `
                <span>${device.name}</span>
                <button class="btn btn-blue" data-device-id="${device.id}">Connect</button>
            `;

			listItem.classList.add('list-item');
			listItem.innerHTML = html;
			deviceList.appendChild(listItem);
		}
	},
	connect: function (e) {
		if (e.target.classList.contains('btn-blue')) {
			var deviceId = e.target.dataset.deviceId;
			var onConnect = function () {
				ble.startNotification(deviceId, battery.service, battery.level, app.onBatteryLevelChange, app.onError);
				batteryStateButton.dataset.deviceId = deviceId;
				disconnectButton.dataset.deviceId = deviceId;
				app.showDetailPage();
			};
			ble.connect(deviceId, onConnect, app.onError);
		}
	},
	onBatteryLevelChange: function (data) {
		console.log('onBatteryLevelChange', data);
		var batteryLevel = new Uint8Array(data);
		batteryState.innerHTML = batteryLevel[0];
	},
	readBatteryState: function (event) {
		console.log('readBatteryState');
		var deviceId = event.target.dataset.deviceId;
		ble.read(deviceId, battery.service, battery.level, app.onReadBatteryLevel, app.onError);
	},
	onReadBatteryLevel: function (data) {
		console.log('onReadBatteryLevel', data);
		var batteryLevel = new Uint8Array(data);
		batteryState.innerHTML = batteryLevel[0];
	},
	disconnect: function (event) {
		var deviceId = event.target.dataset.deviceId;
		ble.disconnect(deviceId, app.showMainPage, app.onError);
	},
	showMainPage: function () {
		mainPage.hidden = false;
		detailPage.hidden = true;
	},
	showDetailPage: function () {
		mainPage.hidden = true;
		detailPage.hidden = false;
	},
	onError: function (reason) {
		alert('ERROR: ' + JSON.stringify(reason, 0, 4)); // real apps should use notification.alert
	}
};

app.initialize()