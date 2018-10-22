const btnStartScanning = document.querySelector('[data-start-scanning]')
const btnStopScanning = document.querySelector('[data-stop-scanning]')
let logDevices = document.querySelector('[data-devices]')
let foundDevices = []
let hasPermission = false
let isLocationEnabled = false

function initialize() {
	document.addEventListener('deviceready', onDeviceReady, false)
	btnStartScanning.addEventListener('click', handleStartScan)
	btnStopScanning.addEventListener('click', handleStopScan)
}

function onDeviceReady() {
	initializeBluetoothLe()
	const set1 = new Set([1, 2, 3, 4, 5])
	console.log('typeof set1', typeof set1, set1.has(1))
}

function initializeBluetoothLe() {
	new Promise(function (resolve) {
		console.log('resolve', resolve)
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
	}
}

function handleError(error) {
	console.log('error', error)
}

/*
 * Scan for unpaired devices
 */
function scan() {
	bluetoothle.startScan(startScanSuccess, startScanError)
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
	console.log('Start scanning')
	scan()
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

function getAdapterCb(value) {
	console.log(value)
}

initialize()