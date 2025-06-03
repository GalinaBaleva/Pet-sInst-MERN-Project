const fetchData = async (method, path, body) => {
    const host = import.meta.env.VITE_API_URL;
    const options = {
        credentials: 'include',
        method,
        headers: { 'Content-Type': 'application/json' }
    };

    if (body !== undefined) {
        options.body = JSON.stringify(body);
    };

    try {
        const response = await fetch(host + path, options);

        if (response.status !== 200) {
            const error = await response.json();
            throw new Error(error.message);
        }

        const data = await response.json();

        return { status: response.status, data };

    } catch (error) {
        return error.message
    };
}



export const get = fetchData.bind(null, 'get');
export const post = fetchData.bind(null, 'post');
export const put = fetchData.bind(null, 'put');
export const del = fetchData.bind(null, 'delete');



