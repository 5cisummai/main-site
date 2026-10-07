<script lang="ts">
	import hljs from 'highlight.js/lib/core';
	import python from 'highlight.js/lib/languages/python';
	import 'highlight.js/styles/github.css';

	hljs.registerLanguage('python', python);

	interface Props {
		n: number;
		title?: string;
		code: string;
		note?: string;
		lang?: string;
	}

	let { n, title, code, note, lang = 'python' }: Props = $props();

	const highlighted = $derived(hljs.highlight(code, { language: lang }).value);
</script>

<div class="code-cell">
	<div class="meta">
		<span class="cell-n">In [{n}]:</span>
		{#if title}
			<span class="cell-title">{title}</span>
		{/if}
	</div>
	<pre><code class="hljs language-{lang}">{@html highlighted}</code></pre>
	{#if note}
		<p class="note">{note}</p>
	{/if}
</div>

<style>
	.code-cell {
		margin: 1.25rem 0 0;
		border: 1px solid var(--foreground);
		padding: 0.75rem 1rem;
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.5rem 0.75rem;
		margin-bottom: 0.5rem;
	}

	.cell-n {
		font-family: var(--font-heading);
		font-size: 0.75rem;
		color: #666;
	}

	.cell-title {
		font-family: var(--font-heading);
		font-size: 0.875rem;
	}

	pre {
		margin: 0;
		overflow-x: auto;
		background: transparent;
	}

	code {
		font-family: var(--font-heading);
		font-size: 0.8125rem;
		line-height: 1.5;
		white-space: pre;
		background: transparent;
	}

	.code-cell :global(.hljs) {
		font-family: var(--font-heading);
		font-size: 0.8125rem;
		line-height: 1.5;
		background: transparent;
		padding: 0;
		color: inherit;
	}

	.code-cell :global(.hljs span) {
		font-family: inherit;
		font-size: inherit;
	}

	.note {
		margin: 0.75rem 0 0;
		font-size: 0.875rem;
		color: #555;
	}
</style>
