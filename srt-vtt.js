import fs from 'fs'
export function srtToWebVTT(srtContent) {
    // Divide el contenido SRT en líneas
    
    const lines = srtContent.split(/\r?\n/)
      .filter(line => line.includes("Dialogue"))
      .filter(line => line.includes("\\"))

    const language = srtContent.split(/\r?\n/)[1]

    let webVTTContent = 'WEBVTT\n'

    lines.forEach((line, index) => {
      let treatedLine = line.split(',')
      let lineMsg = line.split(',,')
      webVTTContent += `\n${index + 1}\n${treatedLine[1]}0 --> ${treatedLine[2]}0\n${lineMsg[1].replaceAll('\N','\n').replaceAll('\\',"")}\n`
    })

    return [webVTTContent, language]
}

export function convertirSRTaVTT(rutaSRT, rutaVTT) {
  return new Promise((resolve, reject) => {
    fs.readFile(rutaSRT, 'utf-8', (err, srtContent) => {
      if (err) {
        reject(err)
        return
      }

      let [webVTTContent, language] = srtToWebVTT(srtContent)
      language = findLanguage(language)

      fs.writeFile(rutaVTT.replace(".vtt",`_${language}.vtt`), webVTTContent, 'utf-8', (err) => {
        if (err) {
          reject(err)
          return
        }

        console.log(`La conversión se completó. Archivo WebVTT creado en: ${rutaVTT}. Idioma: ${language}`)
        resolve()
      })
    })
  })
}

export function findLanguage(languageLine) {
  const commonLanguages = ["Español", "English", "Français", "Deutsch", "Italiano", "Português", "Русский"]
  const langLine = languageLine.split(/\s+/);

  for (const lang of commonLanguages) {
    if (langLine.includes(lang)) {
      return lang;
    }
  }
}

  // convertirSRTaVTT('.\\public\\assets\\subtitulos_2.srt','.\\public\\assets\\subtitulos_2.vtt')