<script lang="ts">
	import Footer from '$lib/components/landing/Footer.svelte';
	import MainContent from '$lib/components/landing/MainContent.svx';
	import Topbar from '$lib/components/landing/Topbar.svelte';
</script>

<svelte:head>
	<title>West Ranch Machine Learning</title>
	<meta
		name="description"
		content="West Ranch Machine Learning — a student-led club at West Ranch High School."
	/>
</svelte:head>

<Topbar />
<main>
	<MainContent />
</main>
<Footer />
