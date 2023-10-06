

class Auth {

	// TODO: class User/Person
	user = {}

	// TODO: colocar na Class View
	#submit = null
	#btn_force = null
	#btn_getcourse = null
	#btn_logout = null
	#login = ''
	#password = ''
	#form = null
	#profile = null

	// TODO: Class PRODUTO
	#result = null
	counter = 0
	#node = null
	start = 0
	end = 0

	// TODO: Class Server
	#api = {
		registe: 'http://localhost:3000/user/registre',
		login: 'http://localhost:3000/login',
		logout: 'http://localhost:3000/logout',
		courses: 'http://localhost:3000/courses',
		image: 'http://localhost:3000/img/user/'
	}

	lang = 'en'
	langs = {
		en: {
			login: 'Login successfully!',
			logout: 'Logout successful!',
			log_in: 'Logged in ',
			unauthorized: 'You are not logged in!',
			login_error: 'Invalid login or password!',
		},
		pt: {
			login: 'Login efetuado com sucesso!',
			logout: 'Logout efetuado com sucesso!',
			log_in: 'Registrado às ',
			unauthorized: 'Você não está logado!',
			login_error: 'Login ou senha inválida!',
		}

	}

	constructor() {
		this.#submit = __('#submit')
		this.#btn_force = __('#btn_force')
		this.#btn_getcourse = __('#btn_getcourse')
		this.#btn_logout = __('#btn_logout')
		this.#login = __('#login')
		this.#password = __('#password')
		this.#form = __('form')
		this.#result = __('#result')
		this.#profile = __('#profile')

		this.#form.onsubmit = this.submit.bind(this)
		this.#btn_force.onclick = () => this.courses()
		this.#btn_getcourse.onclick = () => this.course()
		this.#btn_logout.onclick = () => this.logout()

		__glass(false)

		this.user = JSON.parse(localStorage.getItem('user'))
		if (!this.user) return this.viewLogout(false)
		this.viewLogin(false)

		//this.courses()
	}

	async submit(e) {
		e.preventDefault()
		__glass()

		const data = {
			email: this.#login.value,
			password: this.#password.value
		}

		const res = await this.server({
			url: this.#api.login,
			data: data
		})

		console.log('Submit:', res)

		__glass(false)

		if (res.error) return report(this.langs[this.lang].login_error, ALERT) // ERROR ....

		this.login(res)
		return false;
	}

	async login(res) {
		if (res.token) {
			localStorage.setItem('token', res.token)
			localStorage.setItem('refresh', res.refresh)
			localStorage.setItem('user', JSON.stringify({ name: res.name, avatar: res.avatar }))
		}
		this.viewLogin()
	}

	async logout() {
		const res = await this.server({
			url: this.#api.logout,
			method: 'get',
			data: {},
			refresh: true
		})

		console.log('Logout:', res)

		localStorage.removeItem('token')
		localStorage.removeItem('refresh')
		localStorage.removeItem('user')

		this.viewLogout()
	}


	// TODO: colocar em Person ou User class (arquivo separado)
	getUser() {
		return JSON.parse(localStorage.getItem('user')) ?? false
	}


	// View Login - TODO: colocar na Class View
	viewLogin(msg) {

		const user = this.getUser()
		if (user) {
			this.#profile.classList.add('on')
			__('img', this.#profile).src = user.avatar
			__('h2', this.#profile).innerHTML = user.name
			__('p', this.#profile).innerHTML = `${this.langs[this.lang].log_in} <b>${new Date().toLocaleTimeString()}</b>`
		}

		this.#form.classList.remove('on')
		if (msg === false) return
		report(msg ?? this.langs[this.lang].login, INFO)
	}


	// View Logout - TODO: colocar na Class View
	viewLogout(msg) {

		this.#profile.classList.remove('on')
		this.#form.classList.add('on')

		if (msg === false) return
		report(msg ?? this.langs[this.lang].logout, WARN)
	}

	// Get 1 Course
	async course() {

		//this.#btn_force.style.display = 'none'
		this.counter++

		this.start = new Date()
		this.startText = `<p>Iniciando às <b>${this.start.toLocaleTimeString()}hms</b>.</p>`

		const res = await this.server({
			url: this.#api.courses,
			method: 'get'
		})

		if (res.error) {

			this.end = new Date()
			this.#result.innerHTML += `<p>Terminado às <b>${this.end.toLocaleTimeString()}hms</b>.</p>`
			this.#result.innerHTML += `<p class="error"><b>Error: </b>${res.message}</p>`

			this.#btn_force.style.display = 'block'
			return this.viewLogout(false)
		}

		this.#result.innerHTML = `<h2>Cursos</h2>
			<p>Refresh : <b>${this.counter}</b></p>
			<table><tr><th>ID</th><th>Course</th></tr>
			${res.map(c => `<tr><td>${c.id}</td><td>${c.name}</td></tr>`).join('')}
			</table>${this.startText}`
	}

	// Courses - TODO: colocar em PRODUTO
	async courses() {

		this.#btn_force.style.display = 'none'

		this.start = new Date()
		this.startText = `<p>Iniciando às <b>${this.start.toLocaleTimeString()}hms</b>.</p>`

		this.counter = 0
		this.#node = setInterval(async () => {

			this.counter++

			const res = await this.server({
				url: this.#api.courses,
				method: 'get'
			})

			if (res.error) {
				clearInterval(this.#node)

				this.end = new Date()
				this.#result.innerHTML += `<p>Terminado às <b>${this.end.toLocaleTimeString()}hms</b>.</p>`
				this.#result.innerHTML += `<p class="error"><b>Error: </b>${res.message}</p>`

				this.#btn_force.style.display = 'block'
				return this.viewLogout(false)
			}

			if (this.counter == 50000) {
				clearInterval(this.#node)
				this.#result.innerHTML = 'Você já tem 500 cursos!'
				this.#btn_force.style.display = 'block'
			}

			this.#result.innerHTML = `<h2>Cursos</h2>
			<p>Refresh : <b>${this.counter}</b></p>
			<table><tr><th>ID</th><th>Course</th></tr>
			${res.map(c => `<tr><td>${c.id}</td><td>${c.name}</td></tr>`).join('')}
			</table>${this.startText}`

		}, 300)
	}

	// Server e RefreshToken - TODO: colocar na Class Server

	async server({ url, data, method, refresh = false }) {

		const config = {
			method: method && method.toLowerCase() == 'get' ? 'GET' : 'POST',
			credentials: 'include',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			}
		}

		// Login without token!!
		const token = localStorage.getItem(refresh ? 'refresh' : 'token')
		if (token) config.headers.Authorization = 'Bearer ' + token

		data = data || {}

		if (config.method == 'GET' && data != {}) {
			url += '?' + new URLSearchParams(data).toString()
		} else {
			config.body = JSON.stringify(data)
		}

		let f = await fetch(url, config)

		if (f.status == 401 || f.status == 500) f = await this.refreshToken({ url, config }) // Tenta fazer refresh do token...
		if (!f.ok) return { error: true, message: f.statusText }

		const res = await f.json()
		if (res == {}) res.error = false
		return res
	}

	async refreshToken(request) {
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

export default new Auth();