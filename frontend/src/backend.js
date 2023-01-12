function fetchAPI(path, init) {
	return fetch('http://localhost:3000/api' + path, { credentials: 'include', ...init }).then(res => {
		if (res.ok) return res.json();
		else res.text().then(text => {
			throw new Error(`${res.status}: ${res.statusText} - ${text}`);
		});
	});
}

export function fetchUser(){
	return fetchAPI('/user');
}

export function authenticateUser(type, username, password){
	return fetchAPI('/user/' + type, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ username, password })
	});
}

export function fetchCounterValue(){
	return fetchAPI('/counter');
}

export function changeCounterValue(change){
	return fetchAPI('/counter', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ change })
	});
}