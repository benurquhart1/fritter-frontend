<!-- Form for changing username (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateContentGroupForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/ContentGroup',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'name', label: 'name', value: ''},
        {id: 'description', label: 'description', value: ''}
      ],
      title: 'Create a content Group',
      callback: () => {
        const message = 'Successfully created the group';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
