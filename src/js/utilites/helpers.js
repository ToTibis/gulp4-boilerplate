export function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}
export function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
