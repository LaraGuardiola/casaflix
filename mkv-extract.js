import { promisify } from 'util';
import { exec } from 'child_process';
import { API_ERROR } from './public/api-error.js';
import fs from 'fs';

const execAsync = promisify(exec);

export async function extractSubtitles(archivoMKV) {
    const salidaSubs = `.\\public\\assets\\subtitles\\${archivoMKV.replace(".mkv", "")}_`
    archivoMKV = `.\\public\\assets\\video\\${archivoMKV}`;

    if (!fs.existsSync(archivoMKV)) {
        console.error('El archivo MKV no se encuentra en la ruta especificada.');
        return API_ERROR.fileNotFound;
    }

    const mkvmergePath = process.env.MKVMERGE ?? 'C:\\Program Files\\MKVToolNix\\mkvmerge.exe';
    const mkvextractPath = process.env.MKVEXTRACT ?? 'C:\\Program Files\\MKVToolNix\\mkvextract.exe';

    // Comando para obtener información sobre las pistas en el archivo MKV
    const comandoInfo = `"${mkvmergePath}" -i "${archivoMKV}"`;

    try {
        const { stdout, stderr } = await execAsync(comandoInfo);

        if (stderr) {
            console.error(`Error al obtener información: ${stderr}`);
            return API_ERROR.infoExtractionError
        }

        // Verificar si hay pistas de subtítulos
        if (stdout.includes('subtitles')) {
            const subs = stdout.split('\n')
                .filter(subtitles => subtitles.includes('subtitles'))
                .map(elemento => {
                    const matches = elemento.match(/\d+/); // \d+ coincide con uno o más dígitos
                    return matches ? parseInt(matches[0]) : null;
                })
                .filter(numero => numero !== null);

            const resultados = await Promise.all(subs.map(async index => {
                const comandoExtraccion = `"${mkvextractPath}" tracks "${archivoMKV}" ${index}:"${salidaSubs}${index}.srt"`;
                const { stdout, stderr } = await execAsync(comandoExtraccion);

                if (stderr) {
                    console.error(`Error al extraer pistas de subtítulos: ${stderr}`);
                    return API_ERROR.subsExtractionError;
                }

                console.log(`Pista de subtítulos ${index} extraída exitosamente.`);
                return `Subtítulos extraídos para la pista ${index}`;
            }));

            return resultados;
        } else {
            console.log('El archivo MKV no tiene pistas de subtítulos.');
            return API_ERROR.noSubsAvailableError;
        }
    } catch (error) {
        console.error(`Error ejecutando el comando: ${error}`);
        return API_ERROR.cliError;
    }
}


// extractSubtitles(archivoMKV, salidaSubs)


