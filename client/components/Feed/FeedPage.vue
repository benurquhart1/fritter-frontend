<!-- Default page that also displays freets -->

<template>
  <main>
    <section>
      <div class ="sideMenu">
        <heading>
          <h4 style="padding-left:10px"> Feeds:</h4>
        </heading>
        <div v-if="feeds !== null">
          <button class="sideButton"
            @click="setFeed(name)"
            v-for="name in feeds"
            :key="name"
          >
          {{name}}
          </button>
        </div>
      </div>
    </section>
    <section class="mainPage">
      <section v-if="feedName !== null">
        <FeedComponent v-bind:feedName="feedName" :key="feedName" v-bind:freets="freets" />
      </section>
    </section>

  </main>
</template>
<script>
import FeedComponent from '@/components/Feed/FeedComponent.vue';

export default {
  name: 'FeedPage',
  components: {FeedComponent},
  data() {
    return {
      feedName:"following",
      freets:null,
      feeds:["following","favorites","friends"]
    }
  },
  mounted() {
    fetch(`/api/followGroup?username=${this.$store.state.username}`, {method:"GET"}).then(res => res.json()).then(res => {
      this.feeds = this.feeds.concat(res.followGroupNames)
  
    });
    this.feedName = this.$route.query.feedName;
    if (this.feedName) {
      fetch(`/api/feed?name=${this.feedName}`, {method:"GET"}).then(res => res.json()).then(res => {
        if (res) {
          this.freets = this.feeds
          this.sort = res.sort;
          this.accounts = res.accounts;
        }
      });
    }
  },
  methods: {
    changefeed(name) {
      this.feedName = name
      fetch(`/api/feed?name=${this.feedName}`, {method:"GET"}).then(res => res.json()).then(res => {
        if (res) {
          this.freets = res.freets;
          this.sort = res.sort;
          this.accounts = res.accounts;
        }
      });
    },
    setFeed(name) {
      this.feedName = name
      this.updateFreets();
    },
    updateFreets() {
      fetch(`/api/feed?name=${this.feedName}`, {method:"GET"}).then(res => res.json()).then(res => {
        if (res) {
          this.freets = res.freets;
          this.sort = res.sort;
          this.accounts = res.accounts;
        }
      });
    }
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}

.buttonOn {
  background:lightblue;
  width:240px;
  height:40px;
  border:2px solid black;
  border-radius:20px;
  margin-right: 10px;
  font-size:20px;
  font-weight:bold;
}

.sideMenu {
  width:200px;
  position:fixed;
  z-index:1;
  overflow-x:hidden;
  padding-left:0px;
  top:75px;
  left:0;
  bottom:0;
  background-color: lightblue;
}
.mainPage {
  padding-left:200px;
}

.sideButton {
  width:100%;
  height:40px;
  font-size:20px;
  /* border-top:1px; */
  border-bottom:1px;
  border-left:0px;
  border-right:0px;
  
}
</style>
