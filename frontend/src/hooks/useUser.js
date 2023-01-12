import { useEffect, useState } from 'react';
import { authenticateUser, fetchUser } from '../backend';

export default function useUser(setMessages) {
	const [user, setUser] = useState(undefined);

	useEffect(() => {
		let isMounted = true;
		fetchUser().then(data => {
			if (!isMounted) return;

			if (data.messages) setMessages(data.messages);
			setUser(data.user);
		});
		return () => isMounted = false;
	}, []);

	function attemptAuth(type, username, password) {
		authenticateUser(type, username, password).then(data => {
			if (data.messages) setMessages(data.messages);
			setUser(data.user);
		});
	}

	return [user, attemptAuth];
}