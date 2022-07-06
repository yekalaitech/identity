<script lang="ts">
  import "../app.postcss";

	import { AuthService } from '$lib/auth.service';
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
    if (!authservice.isLoggedIn()) {
      await authservice.startAuthentication('https://aspisapp.dev:3011');
    }
	});
</script>

<slot />