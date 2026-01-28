// utils/objectPath.js

export const getByPath = (obj, path) => {
	if (!path) return obj;
	const keys = path.split('.');
	let result = obj;
	for (const key of keys) {
		if (result == null) return undefined;
		result = result[key];
	}
	return result;
};

export const setByPath = (obj, path, value) => {
	if (!path) return value;

	const keys = path.split('.');
	const lastKey = keys.pop();

	// Clone the root based on its type
	const result = Array.isArray(obj) ? [...obj] : { ...obj };

	let current = result;
	let parent = null;
	let parentKey = null;

	// Navigate through the path
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		parent = current;
		parentKey = key;

		// If current level doesn't exist or is null, determine what to create
		if (current[key] == null) {
			const nextKey = i + 1 < keys.length ? keys[i + 1] : lastKey;
			const shouldBeArray = !isNaN(Number(nextKey));
			current[key] = shouldBeArray ? [] : {};
		} else {
			// Clone existing value to maintain immutability
			if (Array.isArray(current[key])) {
				current[key] = [...current[key]];
			} else if (typeof current[key] === 'object') {
				current[key] = { ...current[key] };
			}
		}

		current = current[key];
	}

	// Set the final value
	current[lastKey] = value;

	return result;
};