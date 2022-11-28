// <!-- Form for creating freets (block style) -->

// <script>
// import InlineForm from '@/components/common/BlockForm.vue';

// export default {
//   name: 'UnfollowUserForm',
//   mixins: [InlineForm],
//   data() {
//     return {value: this.$store.state.unfollow};
//   },
//   methods: {
//     submit() {
//       const url = this.value ? `/api/follow/${this.value}` : '/api/follow';
//       try {
//         const r = await fetch(url);
//         const res = await r.json();
//         if (!r.ok) {
//           throw new Error(res.error);
//         }
//     return {
//       url: this.value ? `/api/follow/${this.value}` : '/api/follow/1',
//       method: 'DELETE',
//       hasBody: true,
//       fields: [
//         {id: 'username', label: 'username', value: ''}
//       ],
//       title: 'unfollow a user',
//       refreshFreets: true,
//       callback: () => {
//         const message = 'You have successfully unfollowed the user';
//         this.$set(this.alerts, message, 'success');
//         setTimeout(() => this.$delete(this.alerts, message), 3000);
//       }
//     };
//   }
// };

//       const options = {
//         method: 'DELETE', headers: {'Content-Type': 'application/json'}

//       try {
//         const r = await fetch(`/api/follow/${this.value}`, options);
//         if (!r.ok) {
//           const res = await r.json();
//           throw new Error(res.error);
//         }

//         this.editing = false;
//         this.$store.commit('refreshFreets');

//         params.callback();
//       } catch (e) {
//         this.$set(this.alerts, e, 'error');
//         setTimeout(() => this.$delete(this.alerts, e), 3000);
//       }

// async request(params) {
//       /**
//        * Submits a request to the freet's endpoint
//        * @param params - Options for the request
//        * @param params.body - Body for the request, if it exists
//        * @param params.callback - Function to run if the the request succeeds
//        */
//       const options = {
//         method: params.method, headers: {'Content-Type': 'application/json'}
//       };
//       if (params.body) {
//         options.body = params.body;
//       }

//       try {
//         const r = await fetch(`/api/follow`, options);
//         if (!r.ok) {
//           const res = await r.json();
//           throw new Error(res.error);
//         }

//         this.editing = false;
//         this.$store.commit('refreshFreets');

//         params.callback();
//       } catch (e) {
//         this.$set(this.alerts, e, 'error');
//         setTimeout(() => this.$delete(this.alerts, e), 3000);
//       }
//     }


// deleteFreet() {
//       /**
//        * Deletes this freet.
//        */
//       const params = {
//         method: 'DELETE',
//         callback: () => {
//           this.$store.commit('alert', {
//             message: 'Successfully deleted freet!', status: 'success'
//           });
//         }
//       };
//       this.request(params);
//     },
// </script>
