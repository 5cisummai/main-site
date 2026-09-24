export type Meeting = {
	slug: string;
	number: number;
	title: string;
	description: string;
};

export const meetings: Meeting[] = [
	{
		slug: '1',
		number: 1,
		title: 'Machine Learning: The Basics',
		description:
			'How models learn patterns from data, make predictions, and show up in everyday tools.'
	}
];
