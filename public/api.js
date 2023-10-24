import { showLoader, closeLoader, showModal , hideLogo, showLogo} from "./utils.js"

export const getFiles = async () => {
    try {
        const response = await fetch("http://192.168.1.38:3000/files")
        const files = await response.json()

        if(!response.ok) {
            throw new Error(data.message)
        }

        return files
    } catch (error) {
        showModal(error.message)
        return error
    }
}

export const getSubs = async (mkv) => {
    try {
        hideLogo()
        showLoader()
        const response = await fetch(`http://192.168.1.38:3000/subs?mkv=${mkv}`)
        const data = await response.json()
        closeLoader()
        showLogo()

        if(!response.ok) {
            throw new Error(data.message)
        }
        
        return data
    } catch (error) {
        closeLoader()
        showModal(error.message)
        showLogo()
        return error
    }
}
