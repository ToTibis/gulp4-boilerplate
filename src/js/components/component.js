const axios = require('axios');

async function getUser(id) {
	try {
		return await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`).then(response => response.data)
	}
	catch (e) {
		throw new Error('Не удалось получить данные от сервера')
	}
}


(async () => {
	try {
		let user = await getUser(6);
		document.getElementById('output').innerHTML = JSON.stringify(user)
	}
	catch (error) {
		console.log(error);
	}
})();

