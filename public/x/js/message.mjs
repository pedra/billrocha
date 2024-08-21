import { __log, __avt, __nm, __, __c, __e } from './utils.mjs'

class MessageClass {

	peer = null
	peerConnection = null
	lastPeerId = null
	conn = null
	id = null

	peerConfig = {
		debug: 2,
		host: "ping.freedomee.com",
		port: 443,
		secure: true,
		path: "/peer",
	}

	type = 'sender'
	inter = null

	_vlocal = null
	_vremote = null
	_messages = null
	_message = null
	_send = null
	_close = null
	_receiver = null

	led = {
		peer: null,
		media: null,
		remote: null,
		status: null
	}

	stream = {
		local: null,
		remote: null,
		media: {
			video: {facingMode: 'user'},
			audio: true
		}
	}

	constructor () {
		this.type = location.pathname.split('/').pop() == 'rec' ? 'receiver' : 'sender'
	}

	async init() {
		this._vlocal = __('#vlocal')
		this._vremote = __('#vremote')
		this._messages = __('#messages')
		this._message = __('#message')
		this._send = __('#send')
		this._close = __('#close')
		this._receiver = __('#receiver')

		this.led.peer = __('#sta-peer')
		this.led.media = __('#sta-media')
		this.led.remote = __('#sta-remote')
		this.led.status = __('#sta-status')

		__e(e => this.messageKeyDown(e), this._message, 'keydown')
		__e(e => this.sendMessage(e), this._send)
		__e(e => this.closeChat(e), this._close)
		__e(e => this.setType(e), this._receiver, 'change')

		this.start()
	}

	async start() {
		console.log("START", this.type)
		this._messages.innerHTML = ''
		this._message.value = ''
		this._message.focus()

		if (this.type == 'receiver') this.id = "a9r"
		else setTimeout(() => this.join(), 2000)
		this.connect()

		clearInterval(this.inter)
		this.inter = setInterval(() => this.setLed('status', 'toggle'), 1000)

		const stream = await this.initMedia()
		this.setLed('media', stream)
		this.setLed('remote', false)
	}

	async initMedia() {
		if (this.type == 'sender') this.stream.media.video = true

		this._vlocal.srcObject = null
		this.stream.local = null
		this.stream.remote = null

		const stream = await navigator.mediaDevices.getUserMedia(this.stream.media)
		if (!stream) return false

		this._vlocal.srcObject = stream
		this.stream.local = stream

		return stream
	}

	messageKeyDown(e) {
		if (e.key == 'Enter') this.sendMessage()
	}

	sendMessage() {
		let msg = this._message.value
		if (msg.length == 0) return false
		console.log("SEND", msg)

		this.addMessage(msg)
		this._message.value = ''

		this.conn.send(msg)
	}

	addMessage(msg, type = 'local') {
		this._messages.innerHTML += `<div class="msg${type == 'local' ? ' me' : ''}">${msg}</div>`
		this._messages.scrollTo(0, this._messages.scrollHeight)
	}

	closeChat() {
		// this.setLed('peer', false)
		// console.log('Connection destroyed')
	}


	// --------------------------------------------------------------------------------- PEER
	join() {
		// Close old connection
		if (this.conn) this.conn.close()

		// Create connection to destination peer specified in the input field
		this.conn = this.peer.connect('a9r', { reliable: true })

		this.conn.on('open', () => {
			this.setLed('peer', true)
			console.log("Connected to: " + this.conn.peer)
		})

		this.ready()
	};

	connect() {
		// Create own peer object with connection to shared PeerJS server
		this.peer = new Peer(this.id, this.peerConfig)

		this.peer.on('open', (id) => {
			// Workaround for this.peer.reconnect deleting previous id
			if (this.peer.id === null) {
				console.log('Received null id from peer open');
				this.peer.id = this.lastPeerId;
			} else {
				this.lastPeerId = this.peer.id;
			}

			console.log('ID: ' + this.peer.id);
			this.setLed('peer', false)
		})

		this.peer.on('connection', (c) => {
			this.createPeerConnection()

			if (this.type == 'sender') {
				// Disallow incoming connections
				c.on('open', () => {
					c.send("Sender does not accept incoming connections")
					setTimeout(function () { c.close(); }, 500)
				})
				return false
			}
			this.conn = c
			console.log("Connected to: " + this.conn.peer)
			this.setLed('peer', true)

			this.ready()
		})

		this.peer.on('disconnected', () => {
			this.setLed('peer', false)
			console.log('Connection lost. Please reconnect')

			// Workaround for this.peer.reconnect deleting previous id
			this.peer.id = this.lastPeerId
			this.peer._lastServerId = this.lastPeerId
			this.peer.reconnect()
		})

		this.peer.on('close', () => {
			this.conn = null
			this.setLed('peer', false)
			console.log('Connection destroyed')
		})

		this.peer.on('error', (err) => {
			console.log(err)
			alert('' + err)
		})
	}

	ready() {
		this.conn.on('data', data => {
			console.log("Data recieved", data)
			this.addMessage(data, 'remote')
		})

		this.conn.on('close', () => {
			this.setLed('peer', false)
			this.conn = null
		})

		this.peer.on('call', incomingCall => {
			// Answer incoming call with local stream
			incomingCall.answer(this.stream.local)

			// Set remote video element source to incoming stream
			incomingCall.on('stream', incomingStream => {
				this._vremote.srcObject = incomingStream
				this.setLed('remote', true)
			})
		})

		this.peer.call(this.conn.peer, this.stream.local)
	}

	createPeerConnection() {
		// Initialize PeerConnection
		this.peerConnection = new RTCPeerConnection();

		// Add local stream to PeerConnection
		this.stream.local.getTracks().forEach(track => 
			this.peerConnection.addTrack(track, this.stream.local)
		)

		//console.log('createPeerConnection', this.peerConnection)

		// On ICE candidate event
		this.peerConnection.onicecandidate = event => {
			if (event.candidate) {
				console.log(`Sending ICE candidate to remote peer: ${JSON.stringify(event.candidate)}`);
				this.peerConnection.send(JSON.stringify({ 'ice': event.candidate }));
			}
		};

		// On track event
		this.peerConnection.ontrack = event => {
			console.log('Remote stream received!');
			this._vremote.srcObject = event.streams[0];
		};
	}




	// --------------------------------------------------------------------------------- PEER [END]

	setType() {
		console.log("TYPE", this._receiver.checked)
		this.type = this._receiver.checked ? 'receiver' : 'sender'
		this.start()
	}


	setLed(led, status) {
		if (status == 'toggle') status = !this.led[led].classList.contains('on')

		this.led[led].classList.remove('on', 'off')

		if (undefined == typeof status) return
		this.led[led].classList.add([status ? 'on' : 'off'])
	}
}

const messageClass = new MessageClass()
window.onload = () => messageClass.init()