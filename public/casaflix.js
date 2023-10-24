import { closeModal, modal, logo, srcLangs, showModal } from './utils.js'
import { getFiles, getSubs } from './api.js'
import { API_ERROR } from './api-error.js'
const menu = document.querySelector(".menu")
const video = document.querySelector(".video")
const subs = document.querySelector(".mkv-subs")

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
            menu.addEventListener("scroll", () => {
                setStickyItemEvent(div)
            })
            addVideoEvent(div)
            menu.appendChild(div)
        })
    } catch (error) {
        console.error(error)
    }
}

const addVideoEvent = (div) => {
    div.onclick = () => {
        let videos = document.querySelectorAll('.list-item')
        let file = div.firstChild.innerText

        //clean up classes and tracks
        videos.forEach(video => video.classList.remove("video-selected"))

        if(video.children.length > 0) {
            Array.from(video.children).forEach(track => video.removeChild(track))
        }

        div.classList.add("video-selected")
        video.setAttribute("src", `assets/video/${file}`)
    }
}

const getSubtitles = async () => {
    const item = document.querySelector(".list-item.video-selected")

    if(!item || video.children.length > 0) {
        return showModal(API_ERROR.noFileSelectedError)
    }

    return await setVideoSubs(item)
}

const setVideoSubs = async (div) => {
    let mkv = div.firstChild.innerText
    const { tracks, indexes } = await getSubs(mkv)
    if(tracks && indexes && tracks.length > 0) {
        tracks.forEach((track, index) => {
            const trackElement = document.createElement("track")
            trackElement.label = track
            trackElement.kind = "subtitles"
            trackElement.type = "text/vtt"
            trackElement.srclang = srcLangs[track]
            trackElement.src = `./assets/subtitles/${mkv.replace(".mkv", "")}_${indexes[index].at(-1)}_${track}.vtt`

            video.appendChild(trackElement)
        })
    }
}

const setStickyItemEvent = (div) => {
    let stickyItem = null
    if(document.querySelector(".list-item.video-selected")) {
        const rect = div.getBoundingClientRect()
        if (rect.top >= 0 && rect.bottom <= menu.clientHeight && !stickyItem) {
            stickyItem = div
        }
        
        if (stickyItem) {
            stickyItem.classList.add('sticky')
        }
    }
}

const init = async() => {
    createSidemenu(await getFiles())
}

init()

video.addEventListener("play", () => {
    logo.style.opacity = 0
    subs.style.animation = "desplazamientoDer 0.6s ease-out forwards"
})
video.addEventListener("pause", () => {
    logo.style.opacity = 1
    subs.style.animation = "desplazamientoIzq 0.6s ease-out forwards"
})
subs.addEventListener("click", getSubtitles)
modal.addEventListener("click", closeModal)