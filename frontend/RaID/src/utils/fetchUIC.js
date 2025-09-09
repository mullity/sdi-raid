const uic = 'WSGLAA';

export async function fetchUIC (){
    const response = await fetch(`http://localhost:3001/api/${uic}`)
    const data = await response.json();
    console.log(data[0]['uic']);
    return data[0]['uic'];
};