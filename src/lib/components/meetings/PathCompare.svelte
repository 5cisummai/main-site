<script lang="ts">
	type Mode = 'traditional' | 'learning';

	let mode = $state<Mode>('traditional');

	const traditionalSteps = [
		{ id: 't1', label: 'Write rules', detail: 'A person decides the if/then logic.' },
		{ id: 't2', label: 'Feed in data', detail: 'New inputs go through those fixed rules.' },
		{ id: 't3', label: 'Get answers', detail: 'Output follows only what was coded.' }
	] as const;

	const learningSteps = [
		{ id: 'l1', label: 'Collect examples', detail: 'Labeled messages, photos, scores…' },
		{ id: 'l2', label: 'Train a model', detail: 'The model finds patterns in those examples.' },
		{ id: 'l3', label: 'Predict on new data', detail: 'It applies what it learned — and can still be wrong.' }
	] as const;

	const steps = $derived(mode === 'traditional' ? traditionalSteps : learningSteps);
	const formula = $derived(
		mode === 'traditional'
			? 'rules + data → answers'
			: 'examples → learned patterns → predictions'
	);

	function setMode(next: Mode) {
		mode = next;
	}
</script>

<div class="compare" aria-labelledby="path-compare-title">
	<div class="toolbar">
		<p id="path-compare-title" class="title">Two ways to get an answer</p>
		<div class="tabs" role="tablist" aria-label="Programming approach">
			<button
				type="button"
				role="tab"
				id="tab-traditional"
				aria-selected={mode === 'traditional'}
				aria-controls="path-panel"
				tabindex={mode === 'traditional' ? 0 : -1}
				class={['tab', mode === 'traditional' && 'active']}
				onclick={() => setMode('traditional')}
			>
				Traditional
			</button>
			<button
				type="button"
				role="tab"
				id="tab-learning"
				aria-selected={mode === 'learning'}
				aria-controls="path-panel"
				tabindex={mode === 'learning' ? 0 : -1}
				class={['tab', mode === 'learning' && 'active']}
				onclick={() => setMode('learning')}
			>
				Machine learning
			</button>
		</div>
	</div>

	<div
		id="path-panel"
		class="panel"
		role="tabpanel"
		aria-labelledby={mode === 'traditional' ? 'tab-traditional' : 'tab-learning'}
	>
		<p class="formula">{formula}</p>
		<ol class="steps">
			{#each steps as step, i (step.id)}
				<li>
					<span class="n" aria-hidden="true">{i + 1}</span>
					<div>
						<strong>{step.label}</strong>
						<p>{step.detail}</p>
					</div>
				</li>
			{/each}
		</ol>
	</div>
</div>

<style>
	.compare {
		border: 1px solid #111;
		background: #fafafa;
		padding: 1.1rem 1rem 1rem;
		margin: 1.25rem 0 0;
	}

	.toolbar {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.75rem 1rem;
		margin-bottom: 0.85rem;
	}

	.title {
		margin: 0;
		font-family: var(--font-heading, 'Geist Mono Variable', ui-monospace, monospace);
		font-size: 0.8rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.02em;
	}

	.tabs {
		display: flex;
		border: 1px solid #111;
	}

	.tab {
		font-family: var(--font-sans, 'Geist Variable', sans-serif);
		font-size: 0.85rem;
		border: none;
		border-radius: 0;
		background: #fff;
		color: #111;
		padding: 0.4rem 0.7rem;
		cursor: pointer;
	}

	.tab + .tab {
		border-left: 1px solid #111;
	}

	.tab.active {
		background: #111;
		color: #fafafa;
	}

	.tab:focus-visible {
		outline: 2px solid #111;
		outline-offset: 2px;
		z-index: 1;
	}

	.panel {
		border: 1px solid #111;
		background: #fff;
		padding: 0.9rem 0.95rem;
	}

	.formula {
		margin: 0 0 0.85rem;
		font-family: var(--font-heading, 'Geist Mono Variable', ui-monospace, monospace);
		font-size: 0.95rem;
	}

	.steps {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}

	.steps li {
		display: flex;
		gap: 0.75rem;
		align-items: flex-start;
		margin: 0;
		padding: 0;
		border: none;
	}

	.steps li + li {
		margin-top: 0;
		padding-top: 0;
		border-top: none;
	}

	.n {
		flex: 0 0 auto;
		width: 1.5rem;
		height: 1.5rem;
		display: grid;
		place-items: center;
		border: 1px solid #111;
		font-family: var(--font-heading, 'Geist Mono Variable', ui-monospace, monospace);
		font-size: 0.75rem;
		line-height: 1;
		margin-top: 0.1rem;
	}

	.steps strong {
		display: block;
		font-family: var(--font-heading, 'Geist Mono Variable', ui-monospace, monospace);
		font-size: 0.9rem;
		font-weight: 500;
		margin-bottom: 0.15rem;
	}

	.steps p {
		margin: 0;
		font-size: 0.92rem;
		color: #333;
	}

	@media (max-width: 480px) {
		.toolbar {
			flex-direction: column;
			align-items: stretch;
		}

		.tabs {
			width: 100%;
		}

		.tab {
			flex: 1;
		}
	}
</style>
