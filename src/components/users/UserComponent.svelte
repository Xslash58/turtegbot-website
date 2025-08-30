<script lang="ts">
    export let userId: number | null;
    export let username: string | null;
</script>

<section class="user">
    <p><a href="/users/{userId}">{username}</a></p>
</section>

<style lang="scss">
    section.user {
        p {
            a {
                text-decoration: none;
                color: inherit;
            }
        }
    }
</style>