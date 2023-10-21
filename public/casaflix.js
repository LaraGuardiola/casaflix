import { closeModal, modal } from './utils.js';
import { getFiles, getSubs } from './api.js'
const menu = document.querySelector(".menu")
const video = document.querySelector(".video")
const logo = document.querySelector(".logo")

const appendListItem= (div, file) => {
    let p = document.createElement("p")
    p.innerHTML = file
    div.appendChild(p)
}

const createSidemenu = (files) => {
    try {
        files.filter(file => file.includes(".mp4") || file.includes(".mkv")).forEach(file => {
            const div = document.createElement("div")
            div.className = "list-item"
            appendListItem(div, file)
            addVideoEvent(div)
            menu.appendChild(div)
            createMkvSubs(menu, div)
        })
    } catch (error) {
        console.error(error)
    }
}

const createMkvSubs = (menu, div) => {
    const mkvSubs = document.createElement("div")
    mkvSubs.className = "mkv-subs"
    menu.appendChild(mkvSubs)

    const subsImg = document.createElement("img")
    subsImg.src = "./assets/img/sub.png"
    mkvSubs.appendChild(subsImg)

    mkvSubs.onclick = async () => {
        let mkv = div.firstChild.innerText
        await getSubs(mkv)
        
    }
}

const addVideoEvent = (div) => {
    let originalTop = 0

    div.onclick = () => {
        let videos = document.querySelectorAll('.list-item')
        let file = div.firstChild.innerText
        let indexOf = Array.from(div.parentNode.children).indexOf(div)
        let mkvSubs = div.parentNode.children[indexOf + 1]

        videos.forEach(video => video.classList.remove("video-selected"))
        Array.from(div.parentNode.children).forEach(mkvSubs => mkvSubs.classList.remove("selected"))

        div.classList.add("video-selected")
        mkvSubs.classList.add("selected")
        
        // Se asegura que el elemento se quede pegado a su correspondiente video
        if (originalTop === 0) {
            originalTop = mkvSubs.offsetTop;
        }

        mkvSubs.style.transform = "translateX(-80px)"
        mkvSubs.style.top = `${originalTop - 70}px`

        video.setAttribute("src", `assets/video/${file}`)
        
    }
}

const setVideo = (file) => {

}

const init = async() => {
    createSidemenu(await getFiles())
}

init()

video.addEventListener("play", () => logo.style.opacity = 0)
video.addEventListener("pause", () => logo.style.opacity = 1)
modal.addEventListener("click", closeModal)