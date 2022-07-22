<script lang="ts">
	import { AuthService } from '$lib/auth.service';
	import { goto  } from '$app/navigation';
	import { onMount } from 'svelte';
	onMount(async () => {
    let authservice = AuthService.getInstance();
    if (!authservice) {
      authservice = AuthService.createInstance({
			client_id: 'identity-admin',
			redirect_uri: 'https://aspisapp.dev:3011/callback',
			authority: 'https://aspisapp.dev:3000/oidc',
			response_type: 'code',
      scope: "offline_access openid profile api:read api:write"
		  })
    }
		const ressult = await authservice.completeAuthentication();
		if (ressult && ressult.returnUrl) {
			await goto(ressult.returnUrl);
		} else {
			await goto('/')
		}
	});
</script>
Callback done

