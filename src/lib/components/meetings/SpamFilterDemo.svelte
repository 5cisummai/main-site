<script lang="ts">
	type Label = 'spam' | 'ham';
	type Verdict = 'Spam' | 'Not spam' | 'Not sure';

	type Example = {
		id: string;
		text: string;
		label: Label;
	};

	type Clue = {
		word: string;
		weight: number;
		spamCount: number;
		hamCount: number;
	};

	type MatchedClue = {
		word: string;
		weight: number;
	};

	const STOPWORDS = new Set([
		'a',
		'an',
		'the',
		'to',
		'of',
		'in',
		'on',
		'for',
		'and',
		'or',
		'is',
		'are',
		'be',
		'you',
		'your',
		'our',
		'with',
		'at',
		'it',
		'this',
		'that'
	]);

	const TRAINING: Example[] = [
		{ id: 's1', text: 'Free phone! Click now to claim your prize', label: 'spam' },
		{ id: 's2', text: 'URGENT: you won $1000, verify account', label: 'spam' },
		{ id: 's3', text: 'Limited offer — buy now before it expires', label: 'spam' },
		{ id: 's4', text: 'Congratulations! Claim free cash today', label: 'spam' },
		{ id: 'h1', text: 'ML club meets Thursday in room 204', label: 'ham' },
		{ id: 'h2', text: 'Bring your laptop for the workshop', label: 'ham' },
		{ id: 'h3', text: 'Notes from last meeting are on the drive', label: 'ham' },
		{ id: 'h4', text: 'Office hours after the lecture this week', label: 'ham' }
	];

	const PRESETS = [
		{ id: 'p1', label: 'Prize pitch', text: 'Click now to claim your free prize phone' },
		{ id: 'p2', label: 'Club reminder', text: 'ML club meets Thursday — bring your laptop' },
		{ id: 'p3', label: 'Mixed signals', text: 'Urgent: workshop notes are free on the drive' },
		{ id: 'p4', label: 'Quiet note', text: 'See you after the lecture this week' }
	];

	function tokenize(text: string): string[] {
		return text
			.toLowerCase()
			.split(/[^a-z]+/)
			.filter((token) => token.length > 1 && !STOPWORDS.has(token));
	}

	function buildClues(examples: Example[]): Clue[] {
		const spamCounts: Record<string, number> = {};
		const hamCounts: Record<string, number> = {};

		for (const example of examples) {
			const unique = new Set(tokenize(example.text));
			const target = example.label === 'spam' ? spamCounts : hamCounts;
			for (const word of unique) {
				target[word] = (target[word] ?? 0) + 1;
			}
		}

		const words = new Set([...Object.keys(spamCounts), ...Object.keys(hamCounts)]);
		const clues: Clue[] = [];

		for (const word of words) {
			const spamCount = spamCounts[word] ?? 0;
			const hamCount = hamCounts[word] ?? 0;
			const weight = spamCount - hamCount;
			if (weight !== 0) {
				clues.push({ word, weight, spamCount, hamCount });
			}
		}

		return clues.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight) || a.word.localeCompare(b.word));
	}

	function labelForScore(score: number): Verdict {
		if (score > 1) return 'Spam';
		if (score < -1) return 'Not spam';
		return 'Not sure';
	}

	function verdictClass(verdict: Verdict): string {
		switch (verdict) {
			case 'Spam':
				return 'verdict-spam';
			case 'Not spam':
				return 'verdict-ham';
			case 'Not sure':
				return 'verdict-unsure';
			default: {
				const _exhaustive: never = verdict;
				return _exhaustive;
			}
		}
	}

	const clues = buildClues(TRAINING);
	const clueWeights: Record<string, number> = Object.fromEntries(clues.map((c) => [c.word, c.weight]));

	let message = $state('');

	const analysis = $derived.by(() => {
		const tokens = [...new Set(tokenize(message))];
		const matched: MatchedClue[] = [];
		let score = 0;

		for (const word of tokens) {
			const weight = clueWeights[word];
			if (weight !== undefined) {
				matched.push({ word, weight });
				score += weight;
			}
		}

		matched.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight) || a.word.localeCompare(b.word));

		return {
			score,
			matched,
			verdict: labelForScore(score)
		};
	});

	const barPercent = $derived.by(() => {
		const capped = Math.max(-6, Math.min(6, analysis.score));
		return ((capped + 6) / 12) * 100;
	});

	function fillMessage(text: string) {
		message = text;
	}

	function formatWeight(weight: number): string {
		return weight > 0 ? `+${weight}` : `${weight}`;
	}
</script>

<section class="demo" aria-labelledby="spam-demo-title">
	<div class="demo-header">
		<h2 id="spam-demo-title">Try it: a tiny spam filter</h2>
		<p class="lede">
			A pocket-sized filter: it learns word clues from the labeled examples below, then scores your
			message. Real spam filters are more sophisticated — this one is here so you can see the idea.
		</p>
	</div>

	<div class="training">
		<h3>Training examples</h3>
		<ul class="example-list" aria-label="Labeled training messages">
			{#each TRAINING as example (example.id)}
				<li class="example" data-label={example.label}>
					<span class="chip">{example.label === 'spam' ? 'spam' : 'not spam'}</span>
					<span class="example-text">{example.text}</span>
				</li>
			{/each}
		</ul>
		<p class="math-note">
			How it “learns”: each word gets a weight of (times it appeared in spam) minus (times in not
			spam). Your message’s score is the sum of weights for the clue words it contains.
		</p>
	</div>

	<div class="try">
		<label class="field-label" for="spam-demo-input">Your message</label>
		<textarea
			id="spam-demo-input"
			bind:value={message}
			rows="3"
			placeholder="Type a message, or pick a “try this” below…"
		></textarea>

		<div class="presets" role="group" aria-label="Try this messages">
			<span class="presets-label">Try this:</span>
			{#each PRESETS as preset (preset.id)}
				<button type="button" class="preset-btn" onclick={() => fillMessage(preset.text)}>
					{preset.label}
				</button>
			{/each}
		</div>
	</div>

	<div class="result" aria-live="polite">
		<div class="verdict-row">
			<span class="verdict-label">Prediction</span>
			<strong class="verdict {verdictClass(analysis.verdict)}">{analysis.verdict}</strong>
			<span class="score-num" title="Sum of matched clue weights">score {analysis.score}</span>
		</div>

		<div
			class="score-bar"
			role="img"
			aria-label="Score bar from not spam to spam, currently {analysis.score}"
		>
			<div class="score-track">
				<div class="score-fill" style="width: {barPercent}%"></div>
				<div class="score-zero" aria-hidden="true"></div>
			</div>
			<div class="score-ends">
				<span>← not spam</span>
				<span>spam →</span>
			</div>
		</div>

		{#if analysis.matched.length > 0}
			<h3 class="clues-heading">Matched clues</h3>
			<ul class="clue-list">
				{#each analysis.matched as clue (clue.word)}
					<li class="clue" class:spam-lean={clue.weight > 0} class:ham-lean={clue.weight < 0}>
						<code>{clue.word}</code>
						<span class="contrib">{formatWeight(clue.weight)}</span>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="empty-clues">
				{message.trim()
					? 'No training clue words matched yet — try a preset or borrow words from the examples.'
					: 'Matched clue words and their contributions will show up here.'}
			</p>
		{/if}
	</div>

	<div class="tip" role="note">
		<p>
			Try the “Mixed signals” preset — it borrows words from both sides on purpose. That’s a reminder:
			with thin training data, predictions get shaky fast.
		</p>
	</div>
</section>

<style>
	.demo {
		--demo-bg: #fafafa;
		--demo-fg: #111;
		--demo-muted: #f0f0f0;
		--demo-border: #111;
		background: var(--demo-bg);
		color: var(--demo-fg);
		border: 1px solid var(--demo-border);
		padding: 1.25rem 1.15rem 1rem;
		font-family: Georgia, 'Times New Roman', serif;
		line-height: 1.45;
		max-width: 42rem;
	}

	.demo-header h2,
	.training h3,
	.clues-heading,
	.field-label,
	.presets-label,
	.verdict-label,
	.chip {
		font-family: var(--font-heading, 'Geist Mono Variable', ui-monospace, monospace);
		font-weight: 500;
		letter-spacing: 0.01em;
	}

	.demo-header h2 {
		margin: 0 0 0.4rem;
		font-size: 1.15rem;
		text-transform: uppercase;
	}

	.lede {
		margin: 0 0 1.1rem;
		font-size: 0.95rem;
		color: #333;
	}

	.training h3,
	.clues-heading {
		margin: 0 0 0.55rem;
		font-size: 0.8rem;
		text-transform: uppercase;
	}

	/* Beat site `.meeting ul` / `li` rules when embedded in meeting pages */
	.demo .example-list,
	.demo .clue-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.demo .example-list > li + li,
	.demo .clue-list > li + li {
		margin-top: 0;
		padding-top: 0;
		border-top: none;
	}

	.demo .example {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.45rem 0.6rem;
		padding: 0.45rem 0.55rem;
		border: 1px solid var(--demo-border);
		background: var(--demo-muted);
		font-size: 0.9rem;
	}

	.chip {
		font-size: 0.7rem;
		text-transform: uppercase;
		border: 1px solid var(--demo-border);
		padding: 0.12rem 0.35rem;
		background: #fff;
		white-space: nowrap;
	}

	.example[data-label='spam'] .chip {
		background: #111;
		color: #fafafa;
	}

	.example-text {
		flex: 1 1 12rem;
	}

	.math-note {
		margin: 0.65rem 0 1.1rem;
		font-size: 0.82rem;
		font-family: var(--font-sans, 'Geist Variable', sans-serif);
		color: #444;
	}

	.field-label {
		display: block;
		margin-bottom: 0.35rem;
		font-size: 0.8rem;
		text-transform: uppercase;
	}

	textarea {
		display: block;
		width: 100%;
		box-sizing: border-box;
		border: 1px solid var(--demo-border);
		border-radius: 0;
		background: #fff;
		color: var(--demo-fg);
		font-family: Georgia, 'Times New Roman', serif;
		font-size: 1rem;
		line-height: 1.4;
		padding: 0.65rem 0.7rem;
		resize: vertical;
		min-height: 4.5rem;
	}

	textarea:focus-visible,
	.preset-btn:focus-visible {
		outline: 2px solid var(--demo-fg);
		outline-offset: 2px;
	}

	.presets {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem;
		margin: 0.65rem 0 1.1rem;
	}

	.presets-label {
		font-size: 0.75rem;
		text-transform: uppercase;
		margin-right: 0.15rem;
	}

	.preset-btn {
		font-family: var(--font-sans, 'Geist Variable', sans-serif);
		font-size: 0.85rem;
		border: 1px solid var(--demo-border);
		border-radius: 0;
		background: #fff;
		color: var(--demo-fg);
		padding: 0.35rem 0.55rem;
		cursor: pointer;
	}

	.preset-btn:hover {
		background: var(--demo-muted);
	}

	.preset-btn:active {
		background: #e4e4e4;
	}

	.result {
		border: 1px solid var(--demo-border);
		background: #fff;
		padding: 0.85rem 0.9rem;
	}

	.verdict-row {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.45rem 0.75rem;
		margin-bottom: 0.75rem;
	}

	.verdict-label {
		font-size: 0.75rem;
		text-transform: uppercase;
	}

	.verdict {
		font-family: var(--font-heading, 'Geist Mono Variable', ui-monospace, monospace);
		font-size: 1.05rem;
	}

	.verdict-spam {
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.verdict-ham {
		font-style: italic;
	}

	.verdict-unsure {
		opacity: 0.85;
	}

	.score-num {
		font-family: var(--font-sans, 'Geist Variable', sans-serif);
		font-size: 0.85rem;
		color: #444;
		margin-left: auto;
	}

	.score-bar {
		margin-bottom: 0.85rem;
	}

	.score-track {
		position: relative;
		height: 0.55rem;
		border: 1px solid var(--demo-border);
		background: var(--demo-muted);
	}

	.score-fill {
		height: 100%;
		background: #111;
		max-width: 100%;
	}

	.score-zero {
		position: absolute;
		top: -2px;
		bottom: -2px;
		left: 50%;
		width: 1px;
		background: var(--demo-border);
		transform: translateX(-50%);
	}

	.score-ends {
		display: flex;
		justify-content: space-between;
		margin-top: 0.25rem;
		font-family: var(--font-sans, 'Geist Variable', sans-serif);
		font-size: 0.72rem;
		color: #555;
	}

	.demo .clue {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.75rem;
		padding: 0.3rem 0.45rem;
		border: 1px solid var(--demo-border);
		background: var(--demo-muted);
		font-family: var(--font-sans, 'Geist Variable', sans-serif);
		font-size: 0.88rem;
	}

	.clue code {
		font-family: var(--font-heading, 'Geist Mono Variable', ui-monospace, monospace);
		font-size: 0.85rem;
	}

	.clue.spam-lean .contrib {
		font-weight: 600;
	}

	.clue.ham-lean .contrib {
		font-style: italic;
	}

	.contrib {
		font-variant-numeric: tabular-nums;
	}

	.empty-clues {
		margin: 0;
		font-size: 0.9rem;
		color: #444;
	}

	.tip {
		margin-top: 0.9rem;
		padding-top: 0.75rem;
		border-top: 1px solid var(--demo-border);
	}

	.tip p {
		margin: 0;
		font-size: 0.85rem;
		color: #333;
	}

	@media (max-width: 480px) {
		.demo {
			padding: 1rem 0.85rem 0.85rem;
		}

		.score-num {
			margin-left: 0;
		}
	}
</style>
