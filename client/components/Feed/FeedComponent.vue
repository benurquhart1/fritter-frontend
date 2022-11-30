<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section v-if="feedName">
      <section v-if="freets !== null">
        <section>
          <header>
            <h2>You are viewing the feed <b>@{{ feedName }}</b></h2>
          </header>
        </section>
        <section>
          <FreetComponent
            v-for="freet in freets"
            :key="freet.id"
            :freet="freet">
          </FreetComponent>
        </section>
      </section>
      <section v-else>
        <h3> Freets for the feed<b>@{{feedName}}</b> could not be found</h3>
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
    // Data from the stored freet
    feedName: {
      type: String,
      required: true
    },
    freets: {
      type: [Object],
      required: true
    }
  },
  data() {
    return {
      feedName:null,
      freets:null,
      accounts:null,
      sort:0,
    }
  },
  mounted() {
    this.feedName = props.feedName;
    this.freets = props.freets
    // if (this.feedName) {
      // fetch(`/api/feed?name=${this.feedName}`, {method:"GET"}).then(res => res.json()).then(res => {
      //   if (res) {
      //     this.freets = res.freets;
      //     this.sort = res.sort;
      //     this.accounts = res.accounts;
      //   }
      // });
    // }
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
