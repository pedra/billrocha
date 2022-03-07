window.onload = () => {

    _('#contact-form').onsubmit = e => {
        e.preventDefault()

        var c = _a('#contact-form input[type="checkbox"]')
        var i = 0
        c.forEach(e => {console.log(e.checked, e.name)
            if(e.checked) i++        
        })

        console.log("Resultado: " + i)
        if (i > 0) _('#contact-form').submit()
    }

}
const _ = e => document.querySelector(e) || false
const _a = e => document.querySelectorAll(e) || false