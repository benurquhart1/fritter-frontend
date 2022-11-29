<!-- Form for registering an account (block style) -->

<script>
import Button from '@/components/common/Button.vue';

export default {
  name: 'FollowButton',
  mixins: [Button],
  data() {
    return {
      url: '/api/follow',
      method: 'POST',
      hasBody: true,
      setUsername: true,
      setUserId: true,
      fields: [
        {id: 'username', label: 'Username', value: '1'},
      ],
      title: 'Follow User',
      callback: () => {
        const message = 'Successfully created an account!';
        this.$router.push({name: 'Home'});
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
