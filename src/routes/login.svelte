<script>
  import { supabase, user } from "$lib/db";
  import { goto } from "$app/navigation";

  let email = "";
  let isNewRegistration = false;

  const signUp = async () => {
    let { user: userDetails, error } = await supabase.auth.signUp({
      email: email,
      password: "iHyWfEdsXWDoAgSEjePT",
    });

    console.error(error);
    goto("/");
  };
  const logIn = async () => {
    let { user: userDetails, error } = await supabase.auth.signIn({
      email: email,
      password: "iHyWfEdsXWDoAgSEjePT",
    });
    goto("/");
  };
</script>

{#if $user?.email}
  Hi, {$user?.email} You are already a user. Head back to
  <a href="/">Homepage</a>
{:else}
  <label for="">
    Email
    <input type="text" bind:value={email} />
  </label>
  {#if isNewRegistration}
    <button on:click={signUp}>Signup</button>
    <p on:click={() => (isNewRegistration = false)} class="switch">
      Already have and account?
    </p>
  {:else}
    <button on:click={logIn}>Login</button>
    <p on:click={() => (isNewRegistration = true)} class="switch">
      Create new account?
    </p>
  {/if}
{/if}

<style>
  label {
    display: block;
    margin-bottom: 1em;
  }
</style>
