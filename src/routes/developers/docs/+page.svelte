<script lang="ts">
  import { createApiReference } from '@scalar/api-reference';
  import '@scalar/api-reference/style.css';

  const specUrl = `${import.meta.env.VITE_API_URL}/openapi/v1.json`;
  let container: HTMLDivElement | undefined = $state();

  $effect(() => {
    if (!container) return;

    const instance = createApiReference(container, {
      url: specUrl,
      theme: 'saturn',
      darkMode: true,
      hideDarkModeToggle: true,
      layout: 'modern',
      onBeforeRequest: ({ request }: { request: Request }) => {
        const currentToken = localStorage.getItem('turteg-token');
        if (currentToken) {
          request.headers.set('Authorization', `Bearer ${currentToken}`);
        }
      }
    });

    return () => instance.destroy();
  });
</script>

<svelte:head>
  <title>API Documentation | TurtegBot</title>
</svelte:head>

<div class="scalar-wrapper" bind:this={container}></div>

<style>
  .scalar-wrapper {
    width: 100%;
  }
</style>