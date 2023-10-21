import { showLoader, closeLoader, showModal } from "./utils.js"
import { API_ERROR } from "./api-error.js"

export const getFiles = async () => {
    try {
        const response = await fetch("http://192.168.1.38:3000/files")
        const files = await response.json()

        if(!response.ok) {
            throw new Error()
        }

        return files
    } catch (error) {
        showModal(API_ERROR.filesNotFound)
    }
}

export const getSubs = async (mkv) => {
    try {
        showLoader()
        const response = await fetch(`http://192.168.1.38:3000/subs?mkv=${mkv}`)
        const data = await response.json()
        closeLoader()

        if(!response.ok) {
            throw new Error(data.message)
        }
        
        return data
    } catch (error) {
        showModal(error.message)
    }
}
