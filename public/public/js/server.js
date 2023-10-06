class ServerClass {

	#api = {
		base: 'https://b.fd2e.com',
		registe: '/user/registre',
		login: '/login',
		logout: '/logout',
		courses: '/courses',
		image: '/img/user/',
		lang: '/lang/get'
	}

	constructor() {

	}

	async get({ url, data, refresh }) {
		return this.#server({ url, data, method: 'GET', refresh })
	}

	async post({ url, data, refresh }) {
		return this.#server({ url, data, method: 'POST', refresh })
	}

	async #server({ url, data, method, refresh = true }) {

		url = this.#api.base + (url in this.#api ? this.#api[url] : url)

		const config = {
			method: method && method.toLowerCase() == 'get' ? 'GET' : 'POST',
			credentials: 'include',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			}
		}

		// Login without token!!
		// const token = localStorage.getItem(refresh ? 'refresh' : 'token')
		const token = localStorage.getItem('token')
		if (token) config.headers.Authorization = 'Bearer ' + token

		data = data || {}

		if (config.method == 'GET') {
			url += Object.keys(data).length > 0 ? '?' + new URLSearchParams(data).toString() : ''
		} else {
			config.body = JSON.stringify(data)
		}

		let f = await fetch(url, config)

		if (refresh !== false && (f.status == 401 || f.status == 500)) f = await this.#refreshToken({ url, config }) // Tenta fazer refresh do token...
		if (!f.ok) return { error: true, message: f.statusText }

		const res = await f.json()
		if (res == {}) res.error = false
		return res
	}

	async #refreshToken(request) {
		const f = await fetch(this.#api.login, {
			method: 'POST',
			credentials: 'include',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('refresh')
			},
			body: ''
		})

		console.log('RefreshToken: ', f)

		if (!f.ok) {
			localStorage.removeItem('token')
			localStorage.removeItem('refresh')
			localStorage.removeItem('user')

			this.viewLogout(this.langs[this.lang].unauthorized)
			return { ok: false, statusText: 'Unauthorized' }
		}

		const res = await f.json()

		if (res.token) {
			localStorage.setItem('token', res.token)
			request.config.headers['Authorization'] = `Bearer ${res.token}`

			return await fetch(request.url, request.config)
		}

		return { ok: false, statusText: 'Unauthorized' }
	}
}
export const Server = new ServerClass()