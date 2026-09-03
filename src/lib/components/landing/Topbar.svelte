<script lang="ts">
	const navLinks = [
		{ href: '#about', label: 'About' },
		{ href: '#what-we-do', label: 'What We Do' },
		{ href: '#join', label: 'Join' },
		{ href: 'mailto:westranchml@example.com', label: 'Contact' }
	] as const;
</script>

<header>
	<a href="/">
		<h1>
			<span>WRML</span>
			<span>West Ranch Machine Learning</span>
		</h1>
	</a>

	<nav aria-label="Main navigation">
		<ul>
			{#each navLinks as link (link.href + link.label)}
				<li><a href={link.href}>{link.label}</a></li>
			{/each}
		</ul>
	</nav>
</header>
