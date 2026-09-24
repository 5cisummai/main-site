<script lang="ts">
	import Footer from '$lib/components/landing/Footer.svelte';
	import Meeting1Content from '$lib/components/meetings/Meeting1Content.svx';
	import Topbar from '$lib/components/landing/Topbar.svelte';
</script>

<svelte:head>
	<title>Machine Learning: The Basics — West Ranch Machine Learning</title>
	<meta
		name="description"
		content="An introduction to how machine learning learns patterns from data, makes predictions, and shows up in everyday tools."
	/>
</svelte:head>

<Topbar />
<main>
	<Meeting1Content />
</main>
<Footer />
