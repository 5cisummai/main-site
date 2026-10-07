<script lang="ts">
	import Footer from '$lib/components/landing/Footer.svelte';
	import Meeting2Content from '$lib/components/meetings/Meeting2Content.svx';
	import Topbar from '$lib/components/landing/Topbar.svelte';
</script>

<svelte:head>
	<title>Training a CNN on MNIST — West Ranch Machine Learning</title>
	<meta
		name="description"
		content="Build and train a small convolutional network to classify handwritten digits on MNIST."
	/>
</svelte:head>

<Topbar />
<main>
	<Meeting2Content />
</main>
<Footer />
