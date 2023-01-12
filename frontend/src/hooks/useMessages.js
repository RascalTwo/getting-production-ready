import { useState } from 'react';

export default function useMessages() {
	const [messages, setMessages] = useState({});

	function dismissMessage(type, index) {
		setMessages(messages => {
			const newMessages = { ...messages };
			newMessages[type] = newMessages[type].filter((_, i) => i !== index);
			if (newMessages[type].length === 0) delete newMessages[type];
			return newMessages;
		});
	}

	return [messages, setMessages, dismissMessage];
}