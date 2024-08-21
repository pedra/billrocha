// QuerySelector e: element (string: '.class') | a: all elements (boolean: true)
export const __ = (e, a = false) => document[`querySelector${a ? "All" : ""}`](e) || null

// AddEventListener a: action (function) | e: element (string|HTML Node) | v: event type (string: 'click')
export const __e = (a, e = 'document', v = "click") => {
	let c = e != null && 'object' == typeof e ? e :
		(e == 'document' || !e || e == "" || e == null ? document : __(e, true))
	if (c == null || c.length == 0) return false
	return (!c[0] ? [c] : c).forEach(x => x.addEventListener(v, a))
}

// Create Element
export const __c = (type = 'div', a = {}, content = false) => {
	const e = document.createElement(type)
	for (let x in a) e.setAttribute(x, a[x])
	switch (typeof content) {
		case 'boolean': break
		case 'string': e.innerHTML = content; break
		case 'object': e.appendChild(content); break
	}
	return e
}

export const __glass = (a = true) => {
	if (a === false) return __('.__glass').classList.remove('on')
	let g = __('.__glass')
	if (!g) {
		let b = __c('div', { class: '__glass' }, __c('img', { src: "/asset/img/l.gif", alt: 'loading' }))
		document.body.appendChild(b)
		setTimeout(() => b.classList.add('on'), 200)
		return
	}
	g.classList.add('on')
}


// Converte um INTEIRO para a base 36 ou gera um randômico usando a DATA atual (timestamp)
export const __random = n => ('number' == typeof n ? n : new Date().getTime()).toString(36)
export const __randomize = max => Math.floor(Math.random() * parseInt(max + 0))
export const __delay = ms => new Promise(r => setTimeout(r, ms))

// Mostra mensagem na tela
export const __report = async (
	text,
	type = '',
	extra = null,
	tempo = null
) => {
	extra = extra || null
	tempo = tempo || 2000 + text.length * 40
	type = '__rep-' + ((type == 'info' || type == 'i') ? "info" : (type == 'warn' || type == 'w') ? "warn" : "alert")

	const id = '__' + __random()

	const c = __c('div', { class: `__rep-content ${type}`, id },
		__c('span', { class: '__report_i material-symbols-outlined pulse' }, 'close'))
	c.innerHTML += text

	__e(async e => {
		const x = e.currentTarget
		x.classList.remove('active')
		await __delay(400)
		x.remove()
	}, c)

	let r = __('#__report')
	if (!r) {
		r = __c('div', { class: '__report', id: '__report' })
		__('body').appendChild(r)
	}
	r?.appendChild(c)

	await __delay(500)
	__('#' + id).classList.add('active')

	await __delay(tempo)
	const e = __('#' + id)
	if (e) {
		e.classList.remove('active')
		await __delay(400)
		e.remove()
	}
}

// Pega as iniciais do nome ou do nome + sobrenome (último nome)
export const __nm = n => n.match(/(^\S\S?|\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase()

/** Cria um "avatar" (SVG) com as letras do texto [optional =>  com o tamanho "s" (pixels) e a cor "c"].
 * Ex.: document.body.innerHTML += __avt(__nm('Paulo Rocha'), 100, '#f00')
 */
export const __avt = (t, s, c) => {
	let cs = ["#1abc9c", "#16a085", "#f1c40f", "#f39c12", "#2ecc71", "#27ae60", "#e67e22", "#d35400", "#3498db", "#2980b9", "#e74c3c", "#c0392b", "#9b59b6", "#8e44ad", "#bdc3c7", "#34495e", "#2c3e50", "#95a5a6", "#7f8c8d", "#ec87bf", "#d870ad", "#f69785", "#9ba37e", "#b49255", "#b49255", "#a94136"],
		ci = Math.floor(((t.charCodeAt(0) - 65) + (t.charCodeAt(1) - 65 || 0)) % cs.length)
	return `<svg height="${s}" width="${s}" style="background: ${c || cs[ci]}">,<text text-anchor="middle" x="50%" y="50%" dy="0.35em" fill="white" font-size="${Math.ceil(s / 1.8)}">${t}</text></svg>`
}


// Only TEST - DELETE
export const __log = (...a) => console.log(...a)