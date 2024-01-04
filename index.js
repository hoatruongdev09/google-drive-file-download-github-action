const { google } = require("googleapis")
const fs = require('fs')
const fsAsync = require('fs/promises')

const core = require('@actions/core')
const github = require('@actions/github')

// This is a simple sample script for retrieving the file list.


async function executeAction(fileId, base64Credential, downloadPath) {
    try {

        const text = Buffer.from(base64Credential, 'base64').toString('ascii')
        await fsAsync.writeFile("credentials.json", text)
    } catch (e) {
        console.error(e)
        throw e
    }
    const credentialFilename = "credentials.json";
    const scopes = ["https://www.googleapis.com/auth/drive.readonly"]

    const auth = new google.auth.GoogleAuth({ keyFile: credentialFilename, scopes: scopes })
    const drive = google.drive({ version: "v3", auth })

    try {
        return await downloadFile(drive, fileId, downloadPath)
    } catch (e) {
        throw e
    }
}

async function downloadFile(drive, fileId, fileName, downloadPath) {
    try {
        const fileMetaData = await drive.files.get({ fileId: fileId })
        console.log(`file metadata: `, fileMetaData.data)
        const filePath = `${downloadPath}${fileMetaData.data.name}`
        console.log(`file path: ${filePath}`)
        const fileStream = fs.createWriteStream(filePath)
        console.log('downloading: ' + fileMetaData.data.name)

        const file = await drive.files.get(
            {
                fileId: fileId,
                alt: 'media',
            },
            {
                responseType: "stream"
            }
        );

        file.data.on('end', () => console.log('onCompleted'))
        file.data.pipe(fileStream)
        return filePath
    }
    catch (err) {
        throw err
    }
}

try {
    const fileId = core.getInput('file-id')
    const serviceAccountJson = core.getInput('service-account-json')
    const downloadPath = core.getInput('download-to')
    console.log(`file id: ${fileId}`)
    const filePath = await executeAction(fileId, serviceAccountJson, downloadPath)
    core.setOutput('file-path', filePath)
} catch (e) {
    console.error(e)
    core.setFailed(e.message)
}
// executeAction('1mSw1ZwNxWv_t9Wf8PGrmzCMq5_FFCKaE');



