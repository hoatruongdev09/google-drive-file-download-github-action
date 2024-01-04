
GitHub action to download a file from Google Drive with file id.

File ID's can be specified by either the raw id on Google Drive, or by using the URL obtained from Get URL from the Google Drive dashboard.

For instructions on how to set up service account required to download file, please follow this steps:
1. Create a project in the [Google Cloud Platform Console](https://console.cloud.google.com/) .
2. Enable [Google Drive API](https://developers.google.com/drive/api/v3/enable-drive-api) in new project.
3. Create a service account for new project.
4. Create authentication keys for the service account and download it as json file.
5. Share the file that you want to download to the service account in google drive.
6. Encode your service account json file content to base64 and store in your action secret

### Inputs
- file-id: The raw File ID for the file to download
- service-account-json: base64 encoded of service account json file
- download-to: path of folder for downloaded file
### output
- file-path: download file path
