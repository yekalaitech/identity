<script lang="ts">
	import type { User } from 'oidc-client';
	import { AuthService } from '$lib/auth.service';
	const authService = AuthService.getInstance();
	let user: any;
  let userLoggedIn = false;
	if (authService && authService.isLoggedIn) {
		user = authService.user;
    userLoggedIn = true;
	}
</script>
{#if userLoggedIn}
<h1>Hello {JSON.stringify(user)}</h1>
{:else}
<p>...redirecting</p>
{/if}
