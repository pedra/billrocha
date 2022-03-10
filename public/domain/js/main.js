const fm = '#contact-form'
const bt = 'submitbtn'
const bts = 'brsdomain-btn'
const lgs = 'brsdomain-lang'
const dfm = '#br-form'
let hide = false

window.onload = () => {
    var l = localStorage.getItem(lgs)
    cfg.lang.active = l == 'pt' || l == 'en' ? l : (navigator.languages.find(a => a == 'pt-BR' || a == 'pt') ? 'pt' : 'en')
    localStorage.setItem(lgs, cfg.lang.active)

    hide = localStorage.getItem(bts) == 'true' ? true : false
    _(fm)[bt].disabled = hide
    _(dfm).classList[hide ? 'remove' : 'add']('active')

    _a('.lang img').forEach(a => a.onclick = changeLang)

    renderLang()
    setDomains()

    _(fm).onsubmit = e => {
        e.preventDefault()
        var i = 0
        _a(`${fm} input[type="checkbox"]`).forEach(e => e.checked ? i++ : null)
        if (i > 0) return sendEmail()
        else return alert(cfg.lang[cfg.lang.active][10])
    }

    _('#container').classList.add('active')
}

const setDomains = () => {
    var dc = _('#domains-check')
    var dl = _('#domains-list')
    dc.innerHTML = ''
    dl.innerHTML = ''
    cfg.domains.map((a, b) => {
        dc.innerHTML += `<div class="position-relative icon-group mb-3 in-line"><input id="d${b}" type="checkbox" class="form-control border-2" checked><label for="d${b}">${a}</label></div>`
        dl.innerHTML += `<h2 class="text-14 fw-700 text-white mb-4 domain-name">${a}</h2>`
    })
}

const changeLang = e => {
    cfg.lang.active = e.target.id.replace('lang-', '')
    localStorage.setItem(lgs, cfg.lang.active)
    renderLang()
}

const renderLang = () => {
    _a('.lang img').forEach(a => a.classList.remove('active'))
    _(`#lang-${cfg.lang.active}`).classList.add('active')

    _a('[data-lang]').forEach(a => {
    d = a.dataset.lang - 1
    a[(d >= 7 && d <= 9) ? 'placeholder' : 'innerHTML'] = cfg.lang[cfg.lang.active][d]})
}

const sendEmail = () => {
    var f = _(fm)
    f[bt].disabled = true
    localStorage.setItem(bts, true)

    var body = `
    name: ${f.name.value}
    email: ${f.email.value}
    offer: ${f.offer.value}
    domains: `
    cfg.domains.map((a, b) => _(`#d${b}`).checked ? body += a + ' ' : null)

    var data_js = {
        access_token: cfg.email.token,
        subject: `New offer from "${f.name.value}"`,
        text: body,
    }
    send(toParams(data_js))
}

const send = p => {
    var r = new XMLHttpRequest()
    r.onreadystatechange = () => r.readyState == 4 ? (r.status == 200 ? onSuccess() : onError()) : null
    r.open("POST", cfg.email.url, true)
    r.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    r.send(p)
}

const onSuccess = () => alert(cfg.lang[cfg.lang.active][13])
const onError = () => alert(cfg.lang[cfg.lang.active][12])
const toParams = p => {
    var d = []
    for (var key in p) {
        d.push(encodeURIComponent(key) + "=" + encodeURIComponent(p[key]))
    }
    return d.join("&")
}

const _ = e => document.querySelector(e) || false
const _a = e => document.querySelectorAll(e) || false