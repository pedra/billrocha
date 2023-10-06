import { Lang } from "/js/lang.js";
import { Server } from "/js/server.js";
import { Course } from "/js/course.js";

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
	#selLang = null
	#result = null

	#Course

	constructor() {
		window.onload = () => setTimeout(() => this.init(), 500)
	}

	init() {
		this.#submit = __('#submit')
		this.#btn_force = __('#btn_force')
		this.#btn_getcourse = __('#btn_getcourse')
		this.#btn_logout = __('#btn_logout')
		this.#login = __('#login')
		this.#password = __('#password')
		this.#form = __('.form')
		this.#result = __('#result')
		this.#profile = __('#profile')

		this.#form.onsubmit = this.submit.bind(this)
		this.#btn_logout.onclick = () => this.logout()

		// LANG --- init -------------------------------- [begin]
		this.#selLang = __('#selLang')
		this.#selLang.onclick = async (e) => {
			await Lang.set(e.target.value)
			e.target.value = Lang.get()
		}
		this.#selLang.value = Lang.get()

		// Course --- init ------------------------------ [begin]
		this.#Course = new Course({
			btn_force: this.#btn_force,
			btn_getcourse: this.#btn_getcourse,
			result: this.#result
		})
		this.#btn_force.onclick = () => this.#Course.getCourses()
		this.#btn_getcourse.onclick = () => this.#Course.get()

		__glass(false)

		this.user = JSON.parse(localStorage.getItem('user'))
		if (!this.user) return this.viewLogout(false)
		this.viewLogin(false)
	}

	async submit(e) {
		e.preventDefault()
		__glass()

		const data = {
			email: this.#login.value,
			password: this.#password.value
		}

		const res = await Server.post({
			url: 'login',
			data: data
		})

		console.log('Submit:', res)

		__glass(false)

		if (res.error) return report(Lang.sentence(5)) // ERROR ....

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
		const res = await Server.get({ url: 'logout', refresh: false })

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
			__('p', this.#profile).innerHTML = Lang.sentence(3, { v1: `<b>${new Date().toLocaleTimeString()}</b>` })
		}

		this.#form.classList.remove('on')
		if (msg === false) return
		report(msg ?? Lang.sentence(1), INFO)
	}

	// View Logout - TODO: colocar na Class View
	viewLogout(msg) {

		this.#profile.classList.remove('on')
		this.#form.classList.add('on')

		if (msg === false) return
		report(msg ?? Lang.sentence(2), WARN)
	}
}
export default new Auth();