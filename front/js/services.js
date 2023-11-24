async function getAllPrizes() {
    try {
        const response = await fetch('/api/get-all-prizes');
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function checkCode(code , name) {
    try {
        const response = await fetch(`/api/check-code?code=${code}&name=${name}`);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error checking code:', error);
    }
}

async function getWinners() {
    try {
        const response = await fetch('/api/get-winners');
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error fetching winners:', error);
    }
}
