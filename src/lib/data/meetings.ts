export type Meeting = {
	slug: string;
	number: number;
	title: string | null;
	description: string | null;
};

export const meetings: Meeting[] = [
	{
		slug: '1',
		number: 1,
		title: 'Machine Learning: The Basics',
		description:
			'How models learn patterns from data, make predictions, and show up in everyday tools.'
	},
	{
		slug: '2',
		number: 2,
		title: null,
		description: null
	},
	{
		slug: '3',
		number: 3,
		title: 'Training a CNN on MNIST',
		description:
			'Build and train a small convolutional network to classify handwritten digits.'
	}
];

/** Meetings that appear in nav / listings */
export const publishedMeetings = meetings.filter(
	(m): m is Meeting & { title: string; description: string } =>
		m.title != null && m.description != null
);
