<script lang="ts">
    import type { User } from '$lib/API/Models/Users';
	import { myUser } from '$lib/stores/userStore';

    let me: User | null = $myUser;
    $: if(me == null) me = $myUser;
</script>

<section class="welcome">
    <h1>Welcome {me?.display_name}</h1>
    <p>Enjoy doing your <strong style="color: {me?.role.color}">{me?.role.name}</strong> stuff!</p>
</section>

<style lang="scss">
    .welcome {
        margin-bottom: 20px;
        padding: 10px;
        background-color: #191919;
        border-radius: 8px;
        text-align: center;

        h1 {
            margin: 0;
            font-size: 1.5em;
        }

        p {
            margin: 5px 0 0 0;
            font-size: 1.2em;
        }
    }
</style>
