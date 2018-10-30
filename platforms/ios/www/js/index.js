/**
Central Life Cycle
1. initialize
2. scan (if device address is unknown)
3. connect
4. discover OR services/characteristics/descriptors (iOS)
5. read/subscribe/write characteristics AND read/write descriptors
6. disconnect
7. close
 */

let logStatus = document.querySelector('[data-status]')
let logInfo = document.querySelector('[data-info]')
let logScan = document.querySelector('[data-scan]')
const btnStartScanning = document.querySelector('[data-start-scanning]')
const btnStopScanning = document.querySelector('[data-stop-scanning]')

function initialize() {
	document.addEventListener('deviceready', onDeviceReady, false)
	btnStartScanning.addEventListener('click', startScan)
	btnStopScanning.addEventListener('click', stopScan)
}

function onDeviceReady() {
	bluetoothle.initialize(initializeBluetoothLe, {
		'request': false,
		'statusReceiver': true,
		'restoreKey': 'bluetoothleplugin'
	});
	bluetoothle.enable(() => { }, () => { })
	bluetoothle.getAdapterInfo(getAdapterCb)
}

function initializeBluetoothLe(value) {
	logStatus.textContent = `Status: ${value.status}`
}

function scan() {
	bluetoothle.startScan(startScanSuccess, startScanError)
}

function startScan(event) {
	logScan.textContent = `Start scanning...`
	scan()
}

function stopScan(event) {
	logScan.textContent = `Stop scanning...`
	bluetoothle.stopScan(stopScanSuccess, stopScanError)
}

function startScanSuccess(value) {
	logScan.textContent = JSON.stringify(value, null, 4)
}

function startScanError(value) {
	logScan.textContent = JSON.stringify(value, null, 4)
}

function stopScanSuccess(value) {
	logScan.textContent = JSON.stringify(value, null, 4)
}

function stopScanError(value) {
	logScan.textContent = JSON.stringify(value, null, 4)
}

function getAdapterCb(value) {
	logInfo.textContent = JSON.stringify(value, null, 4)
}

initialize()