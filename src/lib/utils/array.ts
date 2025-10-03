export function chooseNearbyPair<T>(array: T[]): [T, T] {
	if (array.length < 2) {
		throw new Error('Array must contain at least two elements to choose a nearby pair.');
	}

	// Skew towards smaller sizes
	const subArrayLength = Math.min(
		Math.floor(array.length * Math.random() ** 1.5) + 2,
		array.length
	);
	const subArrayIndex = Math.floor(Math.random() * (array.length - subArrayLength + 1));

	const subArray = array.slice(subArrayIndex, subArrayIndex + subArrayLength);

	const firstIndex = Math.floor(Math.random() * subArray.length);
	const firstSelection = subArray.splice(firstIndex, 1)[0];

	let secondIndex = Math.floor(Math.random() * subArray.length);
	const secondSelection = subArray.splice(secondIndex, 1)[0];

	return [firstSelection, secondSelection];
}

export function sum(array: number[]) {
	return array.reduce((acc, curr) => acc + curr, 0);
}
