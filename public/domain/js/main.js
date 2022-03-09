window.onload = () => {

    _a('.lang img').forEach(a => a.onclick = changeLang)

    renderLang()
    setDomains()

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

    _('#container').classList.add('active')
}
const setDomains = () => {
    _('#domains-check').innerHTML = ''
    _('#domains-list').innerHTML = ''
    config.domains.map((a, b) => {
        _('#domains-check').innerHTML += `<div class="position-relative icon-group mb-3 in-line"><input id="d${b}" type="checkbox" class="form-control border-2" checked><label for="d${b}">${a}</label></div>`
        _('#domains-list').innerHTML += `<h2 class="text-14 fw-700 text-white mb-4 domain-name">${a}</h2>`
    })
}

const changeLang = e => {
    config.actlang = e.target.id.replace('lang-', '')
    _a('.lang img').forEach(a => a.classList.remove('active'))
    e.target.classList.add('active')
    renderLang()
}

const renderLang = () => _a('[data-lang]').forEach(a => {
    d = a.dataset.lang -1
    a[(d >= 7 && d <= 9) ? 'placeholder' : 'innerHTML'] = config.lang[config.actlang][d]
})

const _ = e => document.querySelector(e) || false
const _a = e => document.querySelectorAll(e) || false