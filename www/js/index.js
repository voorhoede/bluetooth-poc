'use strict';

const battery = {
	service: "180F",
	level: "2A19"
};

const mainPage = document.getElementById('main-page');
const detailPage = document.getElementById('detail-page');
const deviceList = document.getElementById('device-list');
const refreshButton = document.getElementById('refresh-button');
const batteryState = document.getElementById('battery-state');
const batteryStateButton = document.getElementById('battery-state-button');
const disconnectButton = document.getElementById('disconnect-button');

const app = {
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
			const listItem = document.createElement('li');
			listItem.classList.add('list-item');
			listItem.innerHTML = `
				<span>${device.name}</span>
				<button class="btn btn-blue" data-device-id="${device.id}">Connect</button>
      `;
			deviceList.appendChild(listItem);
		}
	},
	connect: function (e) {
		if (e.target.classList.contains('btn-blue')) {
			const deviceId = e.target.dataset.deviceId;
			const onConnect = function () {
				ble.startNotification(deviceId, battery.service, battery.level, app.onBatteryLevelChange, app.onError);
				batteryStateButton.dataset.deviceId = deviceId;
				disconnectButton.dataset.deviceId = deviceId;
				app.showDetailPage();
			};
			ble.connect(deviceId, onConnect, app.onError);
		}
	},
	onBatteryLevelChange: function (data) {
		const batteryLevel = new Uint8Array(data);
		batteryState.innerHTML = batteryLevel[0];
	},
	readBatteryState: function (event) {
		const deviceId = event.target.dataset.deviceId;
		ble.read(deviceId, battery.service, battery.level, app.onReadBatteryLevel, app.onError);
	},
	onReadBatteryLevel: function (data) {
		const batteryLevel = new Uint8Array(data);
		batteryState.innerHTML = batteryLevel[0];
	},
	disconnect: function (event) {
		const deviceId = event.target.dataset.deviceId;
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
		alert('ERROR: ' + JSON.stringify(reason, null, 4)); // real apps should use notification.alert
	}
};

app.initialize();