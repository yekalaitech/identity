<script lang="ts">
	export let interaction: { [key: string]: any } = {};
	export let interactionUrl = `/interaction/${interaction.uid}/consent`
  import { onMount } from 'svelte';
  onMount(async () => {
    const form = document.getElementById('loginForm') as HTMLFormElement;
    form.submit();
  });
</script>

<div class="bg-blue-200 flex">
	<div class="flex-col flex ml-auto mr-auto items-center w-full lg:w-2/3 md:w-3/5">
		<h1 class="font-bold text-2xl my-10 text-white">Consent</h1>
		<!-- <form class="mt-2 flex flex-col lg:w-1/2 w-8/12" method="POST" id="loginForm" on:submit|preventDefault="{login}" > -->
		<form class="mt-2 flex flex-col lg:w-1/2 w-8/12" method="POST" action="{interactionUrl}" id="loginForm" >
			<button
				type="submit"
				class="bg-blue-400 py-4 text-center px-17 md:px-12 md:py-4 text-white rounded leading-tight text-xl md:text-base font-sans mt-4 mb-20"
			>
				Login
			</button>      
		</form>
	</div>
</div>
