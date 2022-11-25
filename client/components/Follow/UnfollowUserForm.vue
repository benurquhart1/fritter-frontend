<!-- Form for creating freets (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'UnfollowUserForm',
  mixins: [BlockForm],
  data() {
    return {
      url: this.value ? `/api/follow/${this.value}` : '/api/follow',
      method: 'DELETE',
      hasBody: true,
      fields: [
        {id: 'username', label: 'username', value: ''}
      ],
      title: 'unfollow a user',
      refreshFreets: true,
      callback: () => {
        const message = 'You have successfully unfollowed the user';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
