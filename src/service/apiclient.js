import fetch from 'node-fetch';

async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Error fetching data: ${error.message}`);
    }
}

export default fetchData;