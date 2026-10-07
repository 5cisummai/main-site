<script lang="ts">
	import { publishedMeetings } from '$lib/data/meetings';

	let open = $state(false);
	let meetingsItem: HTMLLIElement | undefined = $state();

	function close() {
		open = false;
	}

	function toggle() {
		open = !open;
	}

	function handleWindowClick(event: MouseEvent) {
		if (!open) return;
		const target = event.target;
		if (!(target instanceof Node)) return;
		if (meetingsItem && !meetingsItem.contains(target)) {
			close();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && open) {
			close();
		}
	}
</script>

<svelte:window onclick={handleWindowClick} onkeydown={handleKeydown} />

<header>
	<a href="/">
		<h1>
			<span>WRML</span>
			<span>West Ranch Machine Learning</span>
		</h1>
	</a>

	<nav aria-label="Main navigation">
		<ul>
			<li><a href="/#about">About</a></li>
			<li class="meetings" bind:this={meetingsItem}>
				<button
					type="button"
					aria-expanded={open}
					aria-haspopup="menu"
					onclick={toggle}
				>
					Meetings
				</button>
				{#if open}
					<ul class="menu" role="menu">
						{#each publishedMeetings as meeting (meeting.slug)}
							<li role="none">
								<a
									role="menuitem"
									href="/meetings/{meeting.slug}"
									onclick={close}
								>
									{meeting.number}. {meeting.title}
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</li>
			<li><a href="/#what-we-do">What We Do</a></li>
			<li>
				<a href="mailto:99066922@my.hartdistrict.org">Contact</a>
			</li>
		</ul>
	</nav>
</header>

<style>
	.meetings {
		position: relative;
	}

	button {
		font-family: var(--font-sans);
		font-size: 0.875rem;
		padding: 0;
		border: none;
		background: none;
		color: inherit;
		cursor: pointer;
	}

	button:hover {
		text-decoration: underline;
	}

	ul.menu {
		position: absolute;
		top: 100%;
		left: 50%;
		z-index: 10;
		display: block;
		min-width: 14rem;
		margin: 0.25rem 0 0;
		padding: 0;
		list-style: none;
		transform: translateX(-50%);
		background: var(--background);
		border: 1px solid var(--foreground);
		text-align: left;
	}

	ul.menu a {
		display: block;
		padding: 0.5rem 0.75rem;
		white-space: nowrap;
	}
</style>
