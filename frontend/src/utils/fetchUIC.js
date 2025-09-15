const uic = 'WAMZB0';

export async function fetchUIC (){
    const response = await fetch(`http://localhost:3001/api/${uic}`)
    const data = await response.json();
    return data.uic;
};