<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <div class ="sideMenu">
        <header>
          <h4 style="padding-left:10px"> Content Groups:</h4>
        </header>
        <div v-if="groups !== null">
          <button class="sideButton"
            @click="setGroup(name)"
            v-for="name in groups"
            :key="name"
          >
          {{name}}
          </button>
        </div>
      </div>
    </section>
    <section class="mainPage">
      <h2>Content Groups Page:</h2>
      <section v-if="groupName">
        <section>
          <div v-if="groupName !== null">
            <section style="display: flex;gap:20px; vertical-align:middle">
              <h3>You are viewing the {{groupName}}</h3>
              <button class="buttonOn" @click="handleFollowButton(following ? false :true)">{{following? "unfollow group" : "follow group"}}</button>
              <button class="buttonOn" v-if="!editMode && isModerator" @click="editGroup()"> Edit Group </button>
              <button class="buttonOn" v-if="editMode && isModerator" @click="uneditGroup()"> Stop Editing </button>
              <button class="buttonOn" v-if="isOwner" @click="deleteGroup()"> Delete Group</button>
            </section>
          </div>
          <div v-if="editMode && isModerator">
            <EditContentGroupForm v-bind:name="groupName"/>
          </div>
        </section>
        <section v-if="freets">
          <FeedComponent v-bind:feedName="groupName" :key="groupName" v-bind:freets="freets"/>
        </section>
        <section v-else>
          The feed for this group could not be found. Make sure you are following the group
        </section>
      </section>
      <section v-else>
        <header>
          <CreateContentGroupForm />
        </header>
      </section>
    </section>
  </main>
</template>

<script>
import CreateContentGroupForm from '@/components/ContentGroup/CreateContentGroupForm.vue';
import EditContentGroupForm from '@/components/ContentGroup/EditContentGroupForm.vue';
import FeedComponent from '@/components/Feed/FeedComponent.vue';

export default {
  name: 'ContentGroupPage',
  components: {
    CreateContentGroupForm,
    EditContentGroupForm,
    FeedComponent,
  },
  data() {
    return {
      groups:null,
      username:null,
      groupName:null,
      groupData:null,
      isModerator:null,
      following:null,
      isOwner:null,
      editMode:null,
      freets:null,
      sort:null,
      accounts:null,
    }
  },
  mounted() {
    this.username = this.$route.query.username ? this.$route.query.username : this.$store.state.username;
    this.group = this.$route.query.group ? this.$route.query.group : null
    fetch(`/api/followGroup?username=${this.username}`, {method:"GET"}).then(res => res.json()).then(res => {
      this.groups = res.followGroupNames
    });
  },
  methods: {
    setGroup(name) {
      this.groupName = name;
      fetch(`/api/contentGroup?name=${name}`, {method:"GET"}).then(res => res.json()).then(res => {
        if (res) {
          this.groupData = res;
          this.isModerator = res.moderators.includes(this.$store.state.username);
          this.isOwner = res.owner === this.$store.state.username;
        }
        else {
          this.$store.comit("alert", {message: `The group with name: '${name}' could not be found`, status:error});
        }
      });
      fetch(`/api/feed?name=${this.groupName}`, {method:"GET"}).then(res => res.json()).then(res => {
        if (res) {
          this.freets = res.freets;
          this.sort = res.sort;
          this.accounts = res.accounts;
        }
        else {

        }
      });
      fetch(`/api/followGroup?username=${this.$store.state.username}`, {method:"GET"}).then(res => res.json()).then(res => {
        if (res) {
          this.following = res.followGroupNames.includes(this.groupName)
        }
      });
    },
    deleteGroup(name) {
      fetch(`/api/contentGroup/${this.groupName}`, {method:"DELETE"}).then(res => res.json()).then(res => {
        if (res) {
          this.groupData = null;
          this.groupName = null;
          this.isOwner = null;
          this.isModerator = null;
          this.accounts = null;
          this.editMode = false;
          this.following = false;
        }
        else {
          this.$store.comit("alert", {message: `The group with name: '${name}' could not be deleted`, status:error});
        }
      });
    },
    editGroup() {
      this.editMode = true;
    },
    uneditGroup() {
      this.editMode = falseS;
    },
    handleFollowButton(add) {
      if (add) {
        const options = {
          method: "POST",
          headers: {'Content-Type': 'application/json'},
          credentials: 'same-origin',
          body:JSON.stringify({name:this.groupName}),
        };
        fetch(`/api/followGroup`, {...options}).then(res => res.json()).then(res => {
          if(res) {
            this.following = true      
            fetch(`/api/feed?name=${this.groupName}`, {method:"GET"}).then(res => res.json()).then(res => {
              if (res) {
                this.freets = res.freets;
                this.sort = res.sort;
                this.accounts = res.accounts;
              }
            });
          }
          else {
            this.$store.comit("alert", {message: `Your attempt to follow the group ${this.groupName} was unsuccessful`, status:error})
          }
        });
      }
      else {
        fetch(`/api/followGroup/${this.groupName}`, {method:"DELETE"}).then(res => res.json()).then(res => {
          if(res) {
            this.following=false;
            this.freets = null;
          }
          else {
            this.$store.comit("alert", {message: `Your attempt unfollow the group ${this.groupName} was unsuccessful`, status:error})
          }
        });
      }
    },
  }
};
</script>

<style scoped>
/* section {
  display: flex;
  flex-direction: column;
} */

/* header, header > * {
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
} */
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
  background-color: lightblue;
  
}

/* .buttonOff {
  background:white;
  width:120px;
  height:40px;
  border:2px solid black;
  border-radius:20px;
  margin-right: 10px;
  font-size:20px;
  font-weight:bold;
}   */
</style>