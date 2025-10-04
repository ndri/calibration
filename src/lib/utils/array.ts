export function chooseNearbyPair<T>(array: T[], valueFunction?: (element: T) => number): [T, T] {
	if (array.length < 2) {
		throw new Error('Array must contain at least two elements to choose a nearby pair.');
	}

	const sortedArray = valueFunction
		? [...array].sort((a, b) => valueFunction(a) - valueFunction(b))
		: [...array];

	// Skew towards smaller sizes
	const subArrayLength = Math.min(
		Math.floor(array.length * Math.random() ** 1.5) + 2,
		sortedArray.length
	);
	const subArrayIndex = Math.floor(Math.random() * (sortedArray.length - subArrayLength + 1));

	const subArray = sortedArray.slice(subArrayIndex, subArrayIndex + subArrayLength);

	const firstSelection = spliceRandomElement(subArray);

	const subArrayWithoutDuplicates = valueFunction
		? subArray.filter((element) => valueFunction(element) !== valueFunction(firstSelection))
		: subArray;

	let secondSelection;
	if (subArrayWithoutDuplicates.length === 0) {
		// Edge case: subArray only has elements with duplicate values,
		// so just find a random one ignoring the subArray
		const sortedArrayWithoutDuplicates = [...sortedArray].filter((element) =>
			valueFunction
				? valueFunction(element) !== valueFunction(firstSelection)
				: element !== firstSelection
		);
		secondSelection = randomElement(sortedArrayWithoutDuplicates);
	} else {
		secondSelection = randomElement(subArrayWithoutDuplicates);
	}

	return [firstSelection, secondSelection];
}

export function sum(array: number[]) {
	return array.reduce((acc, curr) => acc + curr, 0);
}

export function randomElement<T>(array: T[]) {
	return array[randomInt(0, array.length - 1)];
}

export function spliceRandomElement<T>(array: T[]) {
	return array.splice(randomInt(0, array.length - 1), 1)[0];
}

export function randomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
