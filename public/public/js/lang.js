import { Server } from './server.js'

class LangClass {

	idiom = 'en'
	langs = {
		'en': 'English',
		'es': 'Spanish',
		'pt': 'Portuguese'
	}
	dictionary = {
		lang: 'en',
		sentences: []
	}

	constructor() {
		this.#load('es')
	}

	/**Get current idiom
	 * 
	 * @returns {string} this idiom
	 */
	get() { return this.idiom }

	/**
	 * Load a new idiom 
	 * 
	 * @param {string} l One the idioms in this langs 
	 * @returns {boolean}
	 */
	async set(l) {
		if (l != this.idiom && l in this.langs) return this.#load(l)
		false
	}

	/**
	 * Returns the exists langs or check if lang "l" existis
	 * 	 
	 * @param {string | undefined} l string to langs
	 * @returns {object | boolean} object with langs or boolean false
	 */
	langs(l) {
		if (l) return l in this.langs ? this.langs[l] : false
		return this.langs
	}

	/**
	 * Returns the sentence from the dictionary
	 * 
	 * @param {number}
	 */
	sentence(id, data = {}) {

		const d = this.dictionary.sentences.find(s => s.id == id)
		if (!d) return ''
		return this.populate(d.text, data)
	}

	/**
	 * Load a new idiom
	 * 
	 * @param {string} lang Idiom to load...
	 * @returns {boolean} Success or fail
	 */
	async #load(lang) {
		const l = await Server.get({ url: 'lang', data: { lang } })
		console.log('Lang: ', l)
		if (l.error === false) {
			this.dictionary = l.data
			this.idiom = lang

			console.log('Lang loaded: ', this)
			return true
		}
		return false
	}

	/**
	 * Replace all ${<var>} in string text to data{<var>: value}
	 * @param {string} text 
	 * @param {object} data 
	 * @returns {string} 
	 */
	populate(text, data = {}, none = '(?!') {
		var regex = new RegExp('\\${(' + Object.keys(data).join('|') + ')}', 'gi')
		const o = text.replace(regex, (m, $1) => data[$1] || m)
		return o.replace(/\${(.*)}/gi, none)
	}
}

export const Lang = new LangClass()