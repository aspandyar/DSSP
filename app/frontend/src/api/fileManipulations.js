const prepareFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file, file.name);

    try {
        const response = await fetch('http://127.0.0.1:3000/api/server/prepareFile', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Error Fetch backend: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (typeof data.blockHashes === "undefined" || typeof data.serverIds === "undefined") {
            throw new Error("returned blockHashes or serverIds is undefined");
        }

        if (
            !Array.isArray(data.blockHashes) || 
            data.blockHashes.some(item => item === null || item === undefined) ||
            !Array.isArray(data.serverIds) || 
            data.serverIds.some(item => item === null || item === undefined)
        ) {
            throw new Error("returned blockHashes or serverIds contains null or undefined elements");
        }

        return data;
    } catch (error) {
        throw new Error('prepareFile: ' + error.message);
    }
};

const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file, file.name);

    try {
        const response = await fetch('http://127.0.0.1:3000/api/server/uploadFile', {
            method: 'POST',
            body: formData,
        });


        if (!response.ok) {
            throw new Error(`Error Fetch backend: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        throw new Error('uploadFile: ' + error.message);
    }
};

export { prepareFile, uploadFile };

