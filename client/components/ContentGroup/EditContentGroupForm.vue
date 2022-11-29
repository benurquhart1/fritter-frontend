<!-- Form for changing username (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'EditContentGroupForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/ContentGroup',
      method: 'PUT',
      hasBody: true,
      fields: [
        {id: 'addAccount', label: 'add an account', value: ''},
        {id: 'removeAccount', label: 'remove an account', value: ''},
        {id: 'addModerator', label: 'add a moderator', value: ''},
        {id: 'removeModerator', label: 'remove a moderator', value: ''},
      ],
      title: 'Edit the group',
      callback: () => {
        const message = 'Successfully edited the group';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
