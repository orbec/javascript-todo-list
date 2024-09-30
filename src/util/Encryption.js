async function genKey(){
    const key = await crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );
    return key;
}

async function genIv() {
    return crypto.getRandomValues(new Uint8Array(12));
    
}

async function encrypt(key, iv, data){

    const stringData = typeof data === 'object' ? JSON.stringify(data) : data;
    const encData = new TextEncoder().encode(stringData);
    const encrypted = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        key,
        encData
    );

    return  encrypted;
}

async function decrypt(key, iv, data) {
    const decData = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        key,
        data
    );

    const decodedData = new TextDecoder().decode(new Uint8Array(decData));
    return JSON.parse(decodedData);
    
}

async function exportKey(key){
    const exported = await crypto.subtle.exportKey("raw", key);
    return Array.from(new Uint8Array(exported));
}

async function importKey(data){
    const raw = new Uint8Array(data);
    return await crypto.subtle.importKey(
        "raw",
        raw,
        { name: "AES-GCM" },
        true,
        ["encrypt","decrypt"],
    );
}

export {
    genKey,
    genIv,
    encrypt,
    decrypt,
    exportKey,
    importKey,
}