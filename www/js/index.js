const btnStartScanning = document.querySelector('[data-start-scanning]')
const btnStopScanning = document.querySelector('[data-stop-scanning]')
let logDevices = document.querySelector('[data-devices]')
let foundDevices = []
let hasPermission = false
let isLocationEnabled = false
let scanInterval

function initialize() {
	document.addEventListener('deviceready', onDeviceReady, false)
	btnStartScanning.addEventListener('click', handleStartScan)
	btnStopScanning.addEventListener('click', handleStopScan)
}

function onDeviceReady() {
	initializeBluetoothLe()
}

function initializeBluetoothLe() {
	new Promise(function (resolve) {
		bluetoothle.initialize(resolve, {
			'request': true,
			'statusReceiver': true,
			'restoreKey': 'bluetoothleplugin',
		})
	}).then(initializeSuccess, handleError)
}

function initializeSuccess(value) {
	console.log(value)
	if (value.status === 'enabled') {
		console.log('Bluetooth is enabled')
	}
	else {
		console.log('Bluetooth is not enabled', value)
		// @todo: request enable bluetooth
	}
}

function handleError(error) {
	console.log('error', error)
}

function scan(stopped) {
	console.log('stopped', stopped)
	if (stopped) {
		console.log('Should stop interval', scanInterval)
		window.clearInterval(scanInterval)
	}
	else {
		bluetoothle.startScan(startScanSuccess, startScanError)
	}
}

function requestPermissionSuccess(value) {
	return value.requestPermission
}

function hasPermissionSuccess(value) {
	if (value.hasPermission) {
		hasPermission = true
	}
	else {
		console.log('No permission. Request permission!')
	}
}

function handleStartScan() {
	// @todo: request bluetooth enable (show prompt)
	console.log('Start scanning')
	scanInterval = window.setInterval(scan, 5000, true)
}

function handleStopScan(event) {
	console.log('Stop scanning')
	bluetoothle.stopScan(stopScanSuccess, stopScanError)
}

function isLocationEnabledSuccess(value) {
	console.log(value)
	if (value.isLocationEnabled) {
		isLocationEnabled = true
	}
	else {
		console.log('No location enabled. Request location!')
		bluetoothle.requestLocation(requestLocationSuccess, handleError)
	}
}

function requestLocationSuccess(value) {
	console.log(value)
	if (value.requestLocation) {
		isLocationEnabled = true
	}
}

function startScanSuccess(value) {
	console.log('startScanSuccess', value)
	foundDevices = []

	bluetoothle.hasPermission(hasPermissionSuccess)
	bluetoothle.isLocationEnabled(isLocationEnabledSuccess, handleError)

	if (value.status === 'scanResult' && hasPermission && isLocationEnabled) {
		console.log('FOUND DEVICE', value)
		logDevices.textContent += `${value.address} \n\n`

	}
}

function startScanError(value) {

}

function stopScanSuccess(value) {

}

function stopScanError(value) {

}

initialize()