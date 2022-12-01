<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
  >
    <header class="freetHeader">
        <p style="padding:0px;display: flex;gap:15px;">
          <b>@{{freet.author}}</b>
          <button class="profileButton" @click="$router.push(`/profile?username=${freet.author}`)" >
            View profile
          </button>
        </p>
    </header>
    <p
      class="content"
    >
      {{ freet.content }}
    </p>
    <button v-if="liked" @click="unlikeFreet()">
      unlike freet
    </button>
    <button v-if="!liked" @click="likeFreet()">
      like freet
    </button>
    likes: {{numLikes}}
    <p class="info">
      Posted at {{ freet.dateModified }}
      <button style="float:right" v-if="$store.state.username === freet.author"
      class="actions" @click="deleteFreet">
        🗑️ Delete Freet
      </button>
    </p>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
export default {
  name: 'FreetComponent',
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      alerts: {}, // Displays success/error messages encountered during freet modification
      liked:false,
      numLikes:this.freet.likes.length,
    };
  },
  mounted() {
    // numLikes = this.freet.likes.length;
    fetch(`/api/like?freetId=${this.freet._id}`, {method:"GET"}).then(res => res.json()).then(res => {
      if (res) {
        this.liked = res.likes.includes(this.$store.state.username);
      }
    });
  },
  methods: {
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    async likeFreet() {
      const options = {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin',
        body:JSON.stringify({freetId:this.freet._id}),
      };
      await fetch(`/api/like`, {...options}).then(res => res.json()).then(res => {
        if(res) {
          this.liked = true;
          this.numLikes +=1;
        }
        else {
          this.$store.comit("alert", {message: `An error occurred when liking the freet`, status:error});
        }
      });
    },
    unlikeFreet() {
      fetch(`/api/like/${this.freet._id}`, {method:"DELETE"}).then(res => res.json()).then(res => {
        if(res) {
          this.liked = false;
          this.numLikes -=1;
        }
        else {
          this.$store.comit("alert", {message: `An error occurred when unliking the freet`, status:error});
        }
      });
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.freet {
    border: 1px solid #111;
    padding: 20px;
    padding-top:0px;
    padding-bottom:0px;
    position: relative;
}

.profileButton {
  background:white;
  /* width:120px; */
  height:24px;
  border:1px solid black;
  border-radius:16px;
  margin-right: 10px;
  font-size:16px;
  font-weight:bold;
}



</style>
