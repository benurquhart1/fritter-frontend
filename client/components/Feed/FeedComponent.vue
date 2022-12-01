<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section v-if="feedName">
      <section v-if="localFreets !== null">
        <section>
          <header>
            <h2>You are viewing the <b>{{ feedName }}</b> feed </h2>
            <button @click="setSort(0)"> sort by date (newest first)</button>
            <button @click="setSort(1)"> sort by date (oldest first)</button>
            <button @click="setSort(2)"> sort by likes</button>
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
          <h3> Freets for the <b>{{feedName}}</b> feed  could not be found</h3>
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
    }
  },
  data() {
    return {
      freets:null,
      accounts:null,
      sort:null,
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
      const options = {
        method: "PUT",
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin',
        body:JSON.stringify({name:this.feedName,sort:sort}),
      };
      fetch(`/api/feed`, {...options}).then(res => res.json()).then(res => {
        if(res) {
          this.sort = sort;
          this.updateFreets();
        }
      });
    },
    updateFreets() {
      if (this.feedName) {
        fetch(`/api/feed?name=${this.feedName}`, {method:"GET"}).then(res => res.json()).then(res => {
          if (res) {
            this.localFreets = res.freets;
            this.sort = res.sort;
            this.accounts = res.accounts;
          }
        });
      }
    },
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
