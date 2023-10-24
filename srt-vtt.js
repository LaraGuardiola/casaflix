import fs from 'fs'
export function srtToWebVTT(srtContent, language) {
    // console.log(srtContent)
    let webVTTContent = 'WEBVTT\n'

    srtContent.forEach((line, index) => {
      let treatedLine = line.split(',')
      let lineMsg = line.split(',,')
      if (lineMsg[1].trim() !== '') {
        let formattedText = lineMsg[1].replace(/^\\N/, '').replaceAll('\\N','\n').replaceAll('\\',"");
        webVTTContent += `\n${index + 1}\n${treatedLine[1]}0 --> ${treatedLine[2]}0\n${formattedText}\n`;
      }
    })

    return [webVTTContent, language]
}

export function convertirSRTaVTT(rutaSRT, rutaVTT) {
  return new Promise(async (resolve, reject) => {
    try {
      const srtContentBuffer = await fs.promises.readFile(rutaSRT); // No se especifica la codificación para obtener un búfer
      const srtContent = srtContentBuffer.toString('utf-8'); // Convierte el búfer a una cadena con codificación utf-8
      const lang = srtContent.split(/\r?\n/)[1]

      // Verificar si se encontró "[Events]" y cortar el array en consecuencia
      const indiceEvents = srtContent.split(/\r?\n/).indexOf("[Events]");
      const strContentArr = srtContent.split(/\r?\n/).slice(indiceEvents + 1)
        .filter(line => !line.includes("{"))
        .filter(line => line.includes("Dialogue:"))
      
      const resolvedLanguage = findLanguage(lang)
      const [webVTTContent] = srtToWebVTT(strContentArr, resolvedLanguage)

      fs.promises.writeFile(rutaVTT.replace(".vtt", `_${resolvedLanguage}.vtt`), webVTTContent, 'utf-8');
      console.log(`La conversión se completó. Archivo WebVTT creado en: ${rutaVTT}. Idioma: ${resolvedLanguage}`);
      resolve(resolvedLanguage);
    } catch (error) {
      reject(error);
    }
  });
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
