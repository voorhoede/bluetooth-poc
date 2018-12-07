const TCS_UUID = "ef680100-9b35-4933-9b10-52ffa9740042" // TCS = Thingy Configuration Service
const search = document.querySelector('[data-search]') 
const level = document.querySelector('[data-battery]')

search.addEventListener('click', start)

function start() {
	if (typeof navigator.bluetooth !== 'undefined') {
		navigator.bluetooth.requestDevice({
			filters: [{
				services: [TCS_UUID],
			}],
			optionalServices: ["battery_service"]
		})
			.then(device => device.gatt.connect())
			.then(server => {
				this.connected = server.connected
				return server
			})
			.then(server => server.getPrimaryService('battery_service'))
			.then(service => service.getCharacteristic('battery_level'))
			.then(characteristic => {
				characteristic.startNotifications()
					.then(() => {
						characteristic.addEventListener('characteristicvaluechanged', onCharacteristicChanged)
					})
					.catch(error => console.error(error.code, error.name, error.message))
			})
	}
	else {
		console.log('The Web Bluetooth API is not supported in your browser, yet :(')
	}
}

function onCharacteristicChanged(event) {
	const batteryLevel = event.target.value.getUint8(0)
	level.textContent = batteryLevel
}