'use strict';

// https://www.bluetooth.com/specifications/gatt/characteristics
const battery = {
	service: '180F',
	level: '2A19'
}

// https://www.bluetooth.com/specifications/assigned-numbers/environmental-sensing-service-characteristics
const environment = {
	service: '181A',
	level: {
		temperature: '2A6E'
	}
}

const deviceList = document.querySelector('[data-device-list]')

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
		deviceList.addEventListener('click', this.connect, false)
	},
	onDeviceReady: function () {
		app.refreshDeviceList();
	},
	refreshDeviceList: function () {
		deviceList.innerHTML = ''; // empties the list
		// scan for all devices
		ble.scan([], 5, app.onDiscoverDevice, app.onError)
	},
	onDiscoverDevice: function (device) {
		console.log('New device: ', JSON.stringify(device))
		if (device.name) {
			deviceList.innerHTML += `
				<li class="device-list__item">
					<h2>${device.name}</h2>
					<button data-button data-id="${device.id}">Connect</button>
					<span data-device-status class="device-list__status"></span>
				</li>
			`
		}
	},
	connect: function (e) {
		console.log('in connect')
		const target = e.target
		if (target.tagName !== 'BUTTON') {
			return
		}

		const statusText = target.nextElementSibling
		statusText.textContent = 'Connecting...'
		const deviceId = e.target.getAttribute('data-id')
		const onConnect = function () {
			statusText.textContent = 'Connected'
			ble.startNotification(deviceId, battery.service, battery.level, app.onBatteryLevelChange, app.onError)
			batteryStateButton.dataset.deviceId = deviceId
			disconnectButton.dataset.deviceId = deviceId
			//app.showDetailPage();
		}

		ble.connect(deviceId, onConnect, app.onError)
	},
	onBatteryLevelChange: function (data) {
		console.log('onBatteryLevelChange', data)
		var batteryLevel = new Uint8Array(data)
		batteryState.innerHTML = batteryLevel[0]
	},
	readBatteryState: function (event) {
		console.log('readBatteryState')
		var deviceId = event.target.dataset.deviceId
		ble.read(deviceId, battery.service, battery.level, app.onReadBatteryLevel, app.onError)
	},
	onReadBatteryLevel: function (data) {
		console.log('onReadBatteryLevel', data)
		var batteryLevel = new Uint8Array(data)
		batteryState.innerHTML = batteryLevel[0]
	},
	disconnect: function (event) {
		var deviceId = event.target.dataset.deviceId
		ble.disconnect(deviceId, app.showMainPage, app.onError)
	},
	showMainPage: function () {
		mainPage.hidden = false
		detailPage.hidden = true
	},
	showDetailPage: function () {
		mainPage.hidden = true
		detailPage.hidden = false
	},
	onError: function (value) {
		const button = document.querySelector(`button[data-id="${value.id}"]`)
		const statusText = button.nextElementSibling
		statusText.textContent = `Error: ${value.errorMessage}`
	}
}

app.initialize()