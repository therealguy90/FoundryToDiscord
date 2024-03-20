import { getThisModuleSetting } from "../modulesettings.mjs";

//Convert base64 to a blob
export function dataToBlob(base64String) {
    const byteCharacters = atob(base64String.split(',')[1]);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    const parts = base64String.split(',');
    let mimeType;
    if (parts.length > 0) {
        // Get the part before the semicolon in the first segment
        const mimeTypeSegment = parts[0].split(';')[0];
        // Extract the actual MIME type
        mimeType = mimeTypeSegment.split(':')[1];
    }
    return new Blob(byteArrays, { type: mimeType });
}

// Image links from server
export async function generateimglink(imgSrc, requireAvatarCompatible = true) {
    const supportedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    let imgUrl;
    if (!imgSrc || (imgSrc && imgSrc === "")) {
        return getDefaultAvatarLink()
    }
    if (imgSrc.includes("http")) {
        imgUrl = imgSrc;
    } else {
        if (getThisModuleSetting('inviteURL') !== "http://") {
            imgUrl = `${getThisModuleSetting('inviteURL')}${await convertToValidURI(imgSrc)}`;
        }
        else {
            return "";
        }
    }
    const urlParts = imgUrl.split('.');
    let fileExtension = urlParts[urlParts.length - 1].toLowerCase();
    if (fileExtension.split('?').length > 1) {
        fileExtension = fileExtension.split('?')[0];
    }
    if (!requireAvatarCompatible || supportedFormats.includes(fileExtension)) {
        return imgUrl;
    }
    else {
        return getDefaultAvatarLink();
    }
}

export function getDefaultAvatarLink() {
    if (getThisModuleSetting('inviteURL') !== "http://") {
        return getThisModuleSetting('inviteURL') + "modules/foundrytodiscord/src/images/defaultavatar.png";
    }
    else {
        return "";
    }
}

async function convertToValidURI(filePath) {
    filePath = filePath.replace(/\\/g, '/'); // failsafe
    const pathParts = filePath.split("/");
    const root = await async function () {
        let key;
        if (pathParts.length > 0) {
            key = "dirs";
        }
        else {
            key = "files";
        }
        pathParts[0] = encodeURI(decodeURI(pathParts[0]));
        const dataPath = await FilePicker.browse("data");
        if (dataPath[key].includes(pathParts[0])) {
            return "data";
        }
        const publicPath = await FilePicker.browse("public");
        if (publicPath[key].includes(pathParts[0])) {
            return "public";
        }
        return undefined;
    }();
    if (root) {
        let target = undefined;
        if (pathParts.length > 0) {
            for (const pathIndex in pathParts) {
                if (Number(pathIndex) === pathParts.length - 1) {
                    const fileName = encodeURI(decodeURI(pathParts[pathIndex]));
                    return `${target ? [target, fileName].join("/") : fileName}`;
                }
                else {
                    target = (await FilePicker.browse(root, `${target ? [target, pathParts[pathIndex]].join("/") : pathParts[pathIndex]}`)).target;
                }
            }
        }
        else {
            return encodeURI(decodeURI(filePath));
        }
    }
    else {
        return filePath;
    }
}