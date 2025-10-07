const inrFormatter = new Intl.NumberFormat('en-IN', {
	style: 'currency',
	currency: 'INR',
});

export function formatINR(amount) {
	return inrFormatter.format(amount);
}



