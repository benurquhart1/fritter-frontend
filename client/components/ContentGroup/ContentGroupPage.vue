<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>Content Groups:</h2>
      </header>
    </section>
    <section>
      <header>
        <CreateContentGroupForm />
      </header>
    </section>
      <div class = "vertical-menu">
        <h3>Followed Groups:</h3>
        <div v-if="groups !== null">
          <button @click="setGroup(name)"
            v-for="name in groups"
            :key="name"
          >
          {{name}}
          </button>
        </div>
      </div>
    <section>
      <div v-if="groupName !== null">
        <header>
          <h2>You are viewing the group: {{groupName}}</h2>
        </header>
      </div>
      <div v-if="isModerator">
        <p> {{groupData}}</p>
        <p> you can eidt</p>
        <EditContentGroupForm />
      </div>
    </section>
  </main>
</template>

<script>
import CreateContentGroupForm from '@/components/ContentGroup/CreateContentGroupForm.vue';
import EditContentGroupForm from '@/components/ContentGroup/EditContentGroupForm.vue';

export default {
  name: 'ContentGroupPage',
  components: {
    CreateContentGroupForm,
    EditContentGroupForm
  },
  data() {
    return {
      groups:null,
      username:null,
      groupName:null,
      groupData:null,
      isModerator:null,
      usOwner:null,
      editMode:null,
    }
  },
  mounted() {
    this.username = this.$route.query.username ? this.$route.query.username : this.$store.state.username;
    this.group = this.$route.query.group ? this.$route.query.group : null
    fetch(`/api/FollowGroup?username=${this.username}`, {method:"GET"}).then(res => res.json()).then(res => {
      this.groups = res.followGroupNames
    });
  },
  methods: {
    setGroup(name) {
      this.groupName = name;
      fetch(`/api/ContentGroup?name=${name}`, {method:"GET"}).then(res => res.json()).then(res => {
        if (res) {
          this.groupData = res;
          this.isModerator = res.moderators.includes(this.$store.state.username);
          this.isOwner = res.owner === this.$store.state.username;
        }
        else {
          this.$store.comit("alert", {message: `The group with name: '${name}' could not be found`, status:error});
        }
      });
    },
    deleteGroup(name) {

    }
  }
};
</script>

<style scoped>
.vertical-menu {
  width:200px
}
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
</style>