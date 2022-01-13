<script context="module">
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ params, fetch, session, context }) {
			return {
				props: {
					interactionId: params.interactionId
				}
			};
	}
</script>

<script lang="ts">
	export let interactionId: string;
	export let interaction: { [key: string]: any } = {};
	import { onMount } from 'svelte';
    import Login from '../../../components/login.svelte';
    import Consent from '../../../components/consent.svelte';
    import TermsAndConditions from '../../../components/terms-and-conditions.svelte';
    import MFA from '../../../components/mfa.svelte';

	onMount(async () => {
		console.log(document.cookie);
		const interactionResult = await fetch(`/api/interaction/${interactionId}`, {
			credentials: 'same-origin',
			headers: { 'set-cookie': document.cookie }
		});
		interaction = await interactionResult.json();
		console.log(interaction);
	});
</script>
{#if interaction.prompt === 'login'}
<Login interaction={interaction}></Login>
{/if}
{#if interaction.prompt === 'consent'}
<Consent interaction={interaction}></Consent>
{/if}
{#if interaction.prompt === 'mfa'}
<MFA></MFA>
{/if}
{#if interaction.prompt === 'termsAndConditions'}
<TermsAndConditions  interaction={interaction}></TermsAndConditions>
{/if}

This is Layout: interaction id is {interactionId}