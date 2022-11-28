<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>@{{ $store.state.profile }}</h2>
      </header>
    </section>
    <section>
      <header>
        <FollowUserForm/>
      </header>
    </section>
  </main>
</template>

<script>
import FollowUserForm from '@/components/Follow/FollowUsernameForm.vue';
import ChangePasswordForm from '@/components/Account/ChangePasswordForm.vue';
import DeleteAccountForm from '@/components/Account/DeleteAccountForm.vue';
import LogoutForm from '@/components/Account/LogoutForm.vue';

export default {
  name: 'ProfilePage',
  components: {
    FollowUserForm,
    ChangePasswordForm,
    DeleteAccountForm,
    LogoutForm
  }
};
</script>
