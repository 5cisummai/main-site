<script lang="ts">
	import { meetings } from '$lib/data/meetings';
</script>

<h2>Meetings</h2>
<p>Session notes and demos from club meetings.</p>
<ul>
	{#each meetings as meeting (meeting.slug)}
		<li>
			<h3>Meeting {meeting.number} — {meeting.title}</h3>
			<p>{meeting.description}</p>
			<p><a href="/meetings/{meeting.slug}">Read notes</a></p>
		</li>
	{/each}
</ul>
