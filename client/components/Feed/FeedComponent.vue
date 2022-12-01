<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section v-if="feedName">
      <section v-if="localFreets !== null">
        <section>
          <header>
            <h2>You are viewing the feed <b>{{ feedName }}</b></h2>
          </header>
        </section>
        <section>
          <FreetComponent
            v-for="freet in localFreets"
            :key="freet.id"
            :freet="freet">
          </FreetComponent>
        </section>
      </section>
      <section v-else>
        <section v-if="mounted">
          <h3> Freets for the feed <b>{{feedName}}</b> could not be found</h3>
        </section>
        <section v-else>
          <p>Loading the freets for the feed <b>{{feedName}}</b></p>
        </section>
      </section>
    </section>
  </main>
</template>

<script>

import FreetComponent from '@/components/Freet/FreetComponent.vue';

export default {
  name: 'FeedComponent',
  components: {
    FreetComponent
  },
  props: {
    feedName: {
      type: String,
      required: true
    },
    freets: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      freets:null,
      accounts:null,
      sort:0,
      localFreets:null,
      mounted:null,
    }
  },
  mounted() {
    if (this.feedName) {
      fetch(`/api/feed?name=${this.feedName}`, {method:"GET"}).then(res => res.json()).then(res => {
        if (res) {
          this.localFreets = res.freets;
          this.sort = res.sort;
          this.accounts = res.accounts;
        }
      });
    }
    this.mounted = true;
  },
  methods: {
    setSort(sort) {

    }
  },

};
</script>


<style scoped>
.buttonOn {
  background:lightblue;
  width:120px;
  height:40px;
  border:2px solid black;
  border-radius:20px;
  margin-right: 10px;
  font-size:20px;
  font-weight:bold;
}

.buttonOff {
  background:white;
  width:120px;
  height:40px;
  border:2px solid black;
  border-radius:20px;
  margin-right: 10px;
  font-size:20px;
  font-weight:bold;
}

</style>
