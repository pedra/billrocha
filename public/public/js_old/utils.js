const ALERT = 'red',
	INFO = 'blu',
	WARN = 'ora'

// GetElementById
const __ = (e, b) => (b ? b : document).querySelector(e) || false
const _a = (e, b) => (b ? b : document).querySelectorAll(e) || false

// Add Event Listener from click 
const __c = (e, f, b, v = 'click') => (c = __(e, b)) && c.addEventListener(v, f)
const _al = (e, f, b, v = 'click') => (c = _a(e, b)) && c.forEach(e => e.addEventListener(v, f))

// Teste: _al('.glr-item', e => console.log('Clicou em :', __('h2', e.currentTarget).innerText))

// Converte um INTEIRO para a base 36 ou gera um randômico usando a DATA atual (timestamp)
const random = n => ('number' == typeof n ? n : new Date().getTime()).toString(36)

// Returns a day of the year - days(new Date(1691969022601))
const yearDay = d => Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24)

// Mostra mensagem na tela
const report = (text, type, extra, tempo) => {
	extra = extra || null
	tempo = tempo || 2000 + text.length * 40
	type = type || ALERT

	//Criando o toast, eu mesmo...
	var id = random()
	var toast = document.createElement('DIV')
	toast.className = 'xtoast ' + type
	toast.id = id
	toast.innerHTML = '<i class="fa-solid fa-xmark"></i>' + text
	toast.onclick = function (e) {
		var x = e.target.nodeName == 'I' ? e.target.parentElement : e.target
		x.classList.remove('active')
		setTimeout(function () {
			x.remove()
		}, 400)
	}
	__('#ctoast').appendChild(toast)

	setTimeout(function () {
		document.getElementById(id).classList.add('active')
		setTimeout(function () {
			var e = document.getElementById(id)
			if (e) {
				e.classList.remove('active')
				setTimeout(function () {
					e.remove()
				}, 400)
			}
		}, tempo)
	}, 500)

	return true
}

// Convert PT1H2M3S (Youtube) to Date string
const convTime = i => {
	var i = i.toUpperCase()
	var r = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/
	var h = 0, m = 0, s = 0, t = 0, o = ''

	if (r.test(i)) {
		var matches = r.exec(i)
		if (matches[1]) h = Number(matches[1])
		if (matches[2]) m = Number(matches[2])
		if (matches[3]) s = Number(matches[3])
		t = h * 3600 + m * 60 + s
		o = (h < 1 ? '' : h + ':') + (h > 0 && m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s
	}
	return [t, o]
}

const __glass = (show = true) => {
	if (!show) __('#splash').classList.remove('on')
	else __('#splash').classList.add('on')
}