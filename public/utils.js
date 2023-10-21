export const modal = document.querySelector(".modal")
export const modalMsg = document.querySelector(".modal-message")
const loader = document.querySelector(".loader")

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