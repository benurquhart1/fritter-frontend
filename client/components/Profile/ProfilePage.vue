<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section v-if="username == null">
      <h2>The profile cannot be found</h2>
    </section>
    <section v-if="username != null">
      <section>
        <header>
          <h2>Profile for <b>@{{ username }}</b></h2>
          <p><b>Bio:</b> {{bio}}</p>
        </header>
      </section>
      <section>
        <p> Number of followers: {{followersCount}}</p>
        <p> Number following: {{followingCount}}</p>
      </section>
      <section style="display: flex;gap:20px; font-size:30px">
        <div v-if="isFollowing !==true">
          <button @click="buttonCallback('follow',true)" class="buttonOff"> Follow </button>
        </div>
        <div v-else>
          <button @click="buttonCallback('follow',false)" class="buttonOn"> Following </button>
        </div>
        <div v-if="isFriend !==true">
          <button @click="buttonCallback('friend',true)" class="buttonOff"> Friend</button>
        </div>
        <div v-else>
          <button @click="buttonCallback('friend',false)" class="buttonOn"> Friends </button>
        </div>
        <div v-if="isFavorite !==true">
          <button @click="buttonCallback('favorite',true)" class="buttonOff"> Favorite </button>
        </div>
        <div v-else>
          <button @click="buttonCallback('favorite',false)" class="buttonOn"> Favorited </button>
        </div>
      </section>
      <section v-if="freets !== null">
        <h3> Freets for <b>@{{username}}:</b></h3>
        <FreetComponent
          v-for="freet in freets"
          :key="freet.id"
          :freet="freet">
        </FreetComponent>
      </section>
      <section v-else>
        <h3> Freets for <b>@{{username}}</b> could not be found</h3>
      </section>
    </section>
  </main>
</template>

<script>

import FreetComponent from '@/components/Freet/FreetComponent.vue';

export default {
  name: 'ProfilePage',
  components: {
    FreetComponent
  },
  data() {
    return {
      username:undefined,
      bio:undefined,
      freets:undefined,
      followersCount:undefined,
      followingCount:undefined,
      follow:undefined,
      isFollowing:true,
      favorites:undefined,
      isFavorite:undefined,
      firends:undefined,
      isFriend:undefined,
    }
  },
  mounted() {
    this.username = this.$route.query.username;
      // get the data for the followers
    fetch(`/api/users?username=${this.username}`, {method:"GET"}).then(res => res.json()).then(res => {
      this.bio = res.bio
      if (res) {
        fetch(`/api/follow?username=${this.username}`, {method:"GET"}).then(res => res.json()).then(res => {
          this.follow = res;
          this.followersCount = res.followers.length
          this.followingCount = res.following.length
          if (this.follow.followers.includes(this.$store.state.username)) {
            this.isFollowing = true;
          }
          else {
            this.isFollowing = false;
          }
        });
        // get the data for the favorites
        fetch(`/api/favorite?username=${this.username}`, {method:"GET"}).then(res => res.json()).then(res => {
          this.favorites = res;

          fetch(`/api/favorite?username=${this.$store.state.username}`, {method:"GET"}).then(res => res.json()).then(res => {
            if (res.favorites.includes(this.username)) {
              this.isFavorite = true;
            }
            else {
              this.isFavorite = false;
            }
          });
        });
        // get the data for friends
        fetch(`/api/friend?username=${this.username}`, {method:"GET"}).then(res => res.json()).then(res => {
          this.friends = res;
          if (this.friends.friendMe.includes(this.$store.state.username)) {
            this.isFriend = true;
          }
          else {
            this.isFriend = false;
          }
        });
        // get the freets by the author
        fetch(`/api/freets?author=${this.username}`, {method:"GET"}).then(res => res.json()).then(res => {
          this.freets = res;
        });
      }
    });
  },
  methods: {
    buttonCallback(group,add) {
      if (add) {
        const options = {
          method: "POST",
          headers: {'Content-Type': 'application/json'},
          credentials: 'same-origin',
          body:JSON.stringify({username:this.username}),
        };
        fetch(`/api/${group}`, {...options}).then(res => res.json()).then(res => {
          if(res) {
            switch(group) {
              case "follow":
                this.isFollowing = true;
                this.followersCount +=1;
                break;
              case "favorite":
                this.isFavorite = true;
                if (!this.isFollowing) {
                  fetch(`/api/follow`, {...options}).then(res => res.json()).then(res => {
                    if(res) {
                      this.isFollowing = true;
                      this.followersCount +=1;
                    }
                    else {
                      this.$store.comit("alert", {message: `An error occurred when following`, status:error})
                    }
                  });
                }
                break;
              case "friend":
                this.isFriend = true;
                if (!this.isFollowing) {
                  fetch(`/api/follow`, {...options}).then(res => res.json()).then(res => {
                    if(res) {
                      this.isFollowing = true;
                      this.followersCount +=1;
                    }
                    else {
                      this.$store.comit("alert", {message: `An error occurred when following`, status:error})
                    }
                  });
                }
                break;
            }
          }
          else {
            this.$store.comit("alert", {message: `Your attempt to ${group} ${this.username} was unsuccessful`, status:error})
          }
        });
      }
      else {
        fetch(`/api/${group}/${this.username}`, {method:"DELETE"}).then(res => res.json()).then(res => {
          if(res) {
            switch(group) {
              case "follow":
                this.isFollowing = false;
                this.followersCount -=1;
                if (this.isFavorite) {
                  // handles the synchronization of removing favorite and friend when unfollowing
                  fetch(`/api/favorite/${this.username}`, {method:"DELETE"}).then(res => res.json()).then(res => {
                    if(res) {
                      this.isFavorite = false;
                    }
                    else {
                      this.$store.comit("alert", {message: `An error occurred when removing favorite`, status:error})
                    }
                  });
                }
                if (this.isFriend) {
                  // handles the synchronization of removing friend and friend when unfollowing
                  fetch(`/api/friend/${this.username}`, {method:"DELETE"}).then(res => res.json()).then(res => {
                    if(res) {
                      this.isFriend = false;
                    }
                    else {
                      this.$store.comit("alert", {message: `An error occurred when removing friend`, status:error})
                    }
                  });
                }
                break;
              case "favorite":
                this.isFavorite = false;
                break;
              case "friend":
                this.isFriend = false;
                break;
            }
          }
          else {
            this.$store.comit("alert", {message: `Your attempt un${group} ${this.username} was unsuccessful`, status:error})
          }
        });
      }
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
