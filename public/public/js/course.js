import { Server } from './server.js'
import { Lang } from './lang.js'

class CourseClass {
	#btn_getcourse = null
	#btn_force = null
	#result = null
	counter = 0
	#node = null
	start = 0
	end = 0

	constructor(data) {
		this.#btn_force = data.btn_force
		this.#btn_getcourse = data.btn_getcourse
		this.#result = data.result
	}

	// Get 1 Course
	async get() {

		this.start = new Date()
		this.startText = `<p>Iniciando às <b>${this.start.toLocaleTimeString()}hms</b>.</p>`

		const res = await Server.get({ url: 'courses' })

		if (res.error) {

			this.end = new Date()
			this.#result.innerHTML += `<p>Terminado às <b>${this.end.toLocaleTimeString()}hms</b>.</p>`
			this.#result.innerHTML += `<p class="error"><b>Error: </b>${res.message}</p>`

			this.#btn_force.style.display = 'block'
			return this.viewLogout(false)
		}

		this.#result.innerHTML = `<h2>${Lang.sentence(4)}</h2>
			<p>Refresh : <b>${this.counter}</b></p>
			<table><tr><th>ID</th><th>Course</th></tr>
			${res.map(c => `<tr><td>${c.id}</td><td>${c.name}</td></tr>`).join('')}
			</table>${this.startText}`
	}

	// Courses
	async getCourses() {

		this.#btn_force.style.display = 'none'

		this.start = new Date()
		this.startText = `<p>Iniciando às <b>${this.start.toLocaleTimeString()}hms</b>.</p>`

		this.counter = 0
		this.#node = setInterval(async () => {

			this.counter++

			const res = await Server.get({ url: 'courses' })

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

			this.#result.innerHTML = `<h2>${Lang.sentence(4)}</h2>
			<p>Refresh : <b>${this.counter}</b></p>
			<table><tr><th>ID</th><th>Course</th></tr>
			${res.map(c => `<tr><td>${c.id}</td><td>${c.name}</td></tr>`).join('')}
			</table>${this.startText}`

		}, 300)
	}
}

export const Course = CourseClass