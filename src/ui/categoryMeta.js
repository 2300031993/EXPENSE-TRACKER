export function getCategoryMeta(category) {
	const key = String(category || 'Other').toLowerCase();
	const map = {
		food: { icon: '🍽️', cls: 'cat-food' },
		transport: { icon: '🚗', cls: 'cat-transport' },
		utilities: { icon: '💡', cls: 'cat-utilities' },
		entertainment: { icon: '🎬', cls: 'cat-entertainment' },
		shopping: { icon: '🛍️', cls: 'cat-shopping' },
		healthcare: { icon: '🩺', cls: 'cat-health' },
		education: { icon: '🎓', cls: 'cat-education' },
		travel: { icon: '✈️', cls: 'cat-travel' },
		other: { icon: '📦', cls: 'cat-other' },
	};
	return map[key] || map.other;
}
