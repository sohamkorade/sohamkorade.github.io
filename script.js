const canvas = document.querySelector("#main")
/** @type{CanvasRenderingContext2D}*/
const ctx = canvas.getContext("2d")

const width = window.innerWidth
const height = window.innerHeight
canvas.width = width
canvas.height = height

Array("mousemove", "touchmove").forEach(ev =>
    canvas.addEventListener(ev, e => {
        const cRect = canvas.getBoundingClientRect()
        stars[50].x = e.offsetX * width / cRect.width
        stars[50].y = e.offsetY * height / cRect.height
        stars[50].vx = 0
        stars[50].vy = 0
        return false
    }))
Array("mouseup", "touchend").forEach(ev => canvas.addEventListener(ev, e => {
    const cRect = canvas.getBoundingClientRect()
    const newstar = stars[Math.floor(stars.length * Math.random())]
    newstar.x = e.offsetX * width / cRect.width
    newstar.y = e.offsetY * height / cRect.height
    newstar.vx = randomsign(2)
    newstar.vy = randomsign(2)
}))

const randomsign = v => Math.random() * v - v / 2

class star {
    constructor(props = {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: randomsign(2),
        vy: randomsign(2),
        radius: Math.random() * 1.5 + 0.5
    }) {
        Object.assign(this, props)
    }
}

const stars = []
for (let i = 50; i--;) {
    stars.push(new star())
}
stars.push(new star({ vx: 0, vy: 0, radius: 0 }))

function drawstars() {
    ctx.fillStyle = "#fff"
    stars.forEach(star => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI)
        ctx.fill()
    })
}

function drawlines() {
    ctx.lineWidth = 0.4
    stars.forEach(star1 => {
        stars.forEach(star2 => {
            const distance = Math.hypot(star1.x - star2.x, star1.y - star2.y)
            const attraction = 100 - distance
            // let distance = Math.pow(star1.x - star2.x, 2) + Math.pow(star1.y - star2.y, 2)
            if (distance < 100) {
                ctx.strokeStyle = `rgba(255,255,255,${attraction}%)`
                ctx.beginPath()
                ctx.moveTo(star1.x, star1.y)
                ctx.lineTo(star2.x, star2.y)
                ctx.stroke()
            }
        })
    })
}

function motion() {
    stars.forEach(star => {
        if (star.x > width) star.x = 0 //star.vx *= -1
        if (star.x < 0) star.x = width //star.vx *= -1
        if (star.y > height) star.y = 0 //star.vy *= -1
        if (star.y < 0) star.y = height //star.vy *= -1
        star.x += star.vx
        star.y += star.vy
    })
}

function draw() {
    ctx.clearRect(0, 0, width, height)
    drawstars()
    drawlines()
}

function loop() {
    motion()
    draw()
    window.requestAnimationFrame(loop)
}

loop()