import { useEffect, useState } from 'react';
import { changeCounterValue, fetchCounterValue } from '../backend';

export default function useCount(user) {
	const [count, setCount] = useState(undefined);

	useEffect(() => {
		if (!user) return;
		let isMounted = true;
		fetchCounterValue().then(data =>
			isMounted && setCount(data.count)
		);
		return () => isMounted = false;
	}, [user]);

	function changeCounter(change) {
		changeCounterValue(change).then(data => setCount(data.count));
	}

	return [count, changeCounter];
}