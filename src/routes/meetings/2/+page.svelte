<script lang="ts">
	import Footer from '$lib/components/landing/Footer.svelte';
	import Meeting2Content from '$lib/components/meetings/Meeting2Content.svx';
	import Topbar from '$lib/components/landing/Topbar.svelte';
</script>

<svelte:head>
	<title>How Machines Learn: Neural Networks, Training, and Better Predictions — West Ranch Machine Learning</title>
	<meta
		name="description"
		content="Foundations of neural networks, how models improve through training, and pitfalls like overfitting and dataset bias."
	/>
</svelte:head>

<Topbar />
<main>
	<Meeting2Content />
</main>
<Footer />
