import express from 'express'
import morgan from 'morgan'
import fs from 'fs'
import { extractSubtitles } from './mkv-extract.js'
import { API_ERROR } from './public/api-error.js'
import { convertirSRTaVTT } from './srt-vtt.js'

const app = express()
const videoRoute = "./public/assets/video"
const subtitlesRoute = ".\\public\\assets\\subtitles\\"

app.use(express.static('public'))
app.use(morgan('dev'))

app.get('/files', (req, res) => {
    fs.readdir(videoRoute, (err, files) => {
        res.json(files)
    })
})

app.get('/subs', async (req, res) => {
    const { mkv } = req.query
    try {
        const tracks = await extractSubtitles(mkv)
        const tracksVtt = []

        const subs = await fs.promises.readdir(subtitlesRoute)
        const filteredSubs = subs.filter(sub => sub.includes(mkv.replace(".mkv", "")) && sub.endsWith(".srt"))

        await Promise.all(filteredSubs.map(async sub => {
            try {
                const conversion = await convertirSRTaVTT(`${subtitlesRoute}${sub}`, `${subtitlesRoute}${sub.replace(".srt", ".vtt")}`)
                tracksVtt.push(conversion)
            } catch (error) {
                console.error(error)
            }
        }))

        if(tracks === API_ERROR.fileNotFound) return res.status(404).json({ message: API_ERROR.fileNotFound })
        if(tracks === API_ERROR.infoExtractionError) return res.status(500).json({ message: API_ERROR.infoExtractionError })
        if(tracks === API_ERROR.noSubsAvailableError) return res.status(404).json({ message: API_ERROR.noSubsAvailableError })
        if(tracks === API_ERROR.subsExtractionError) return res.status(500).json({ message: API_ERROR.subsExtractionError })
        if(tracks === API_ERROR.cliError) return res.status(500).json({ message: API_ERROR.cliError })
        if(tracks.length > 0) return res.status(200).json({ message: "all good fella", tracks: tracksVtt, indexes: tracks })

    } catch (error) {
        return res.status(500).json({ message: API_ERROR.serverError })
    }
})

app.listen(3000, () => console.log('listening on port 3000'))
