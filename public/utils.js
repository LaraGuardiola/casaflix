export const modal = document.querySelector(".modal")
export const modalMsg = document.querySelector(".modal-message")
export const loader = document.querySelector(".loader")
export const logo = document.querySelector(".logo")

export const srcLangs = {
    "English": "en",
    "Español": "es",
    "Français": "fr",
    "Deutsch": "de",
    "Italiano": "it",
    "Português": "pt",
    "Русский": "ru"
}

export const closeModal = () => {
    modal.style.display = "none"
}

export const showModal = (msg) => {
    modal.style.display = "flex"
    modalMsg.innerText = msg
}

export const closeLoader = () => {
    loader.style.display = "none"
}

export const showLoader = () => {
    loader.style.display = "flex"
}

export const hideLogo = () => {
    logo.style.display = "none"
}

export const showLogo = () => {
    logo.style.display = "flex"
}
