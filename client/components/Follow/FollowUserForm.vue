<!-- Form for creating freets (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'FollowUserForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/follow',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'username', label: 'username', value: ''}
      ],
      title: 'Follow a user',
      refreshFreets: true,
      callback: () => {
        const message = 'You have successfully followed the user';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
