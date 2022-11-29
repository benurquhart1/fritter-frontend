import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    username: null, // Username of the logged in user
    userId: null, // the id of the logged in user
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
    feed: "following", // the current feed being viewed
    profile:"a",
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    setUserId(state, userId) {
      /**
       * Update the stored username to the specified one.
       * @param userId- new user id to set
       */
      state.userId = userId;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateProfile(state, profile) {
      /**
       * Update the stored freets filter to the specified one.
       * @param profile - Username of the user to view the profile of
       */
      state.profile = profile;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    async updateFeed(state, feed) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.feed = feed;
      await this.updateFeedFreets(state,feed)
    },
    async updateFeedFreets(state) {
      /**
       * Update the stored freets to the provided freets.
       */
       const url = state.filter ? `/api/feed/` : '/api/feed';
       const res = await fetch(url).then(async r => r.json());
       state.freets = res;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/users/${state.filter}/freets` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
