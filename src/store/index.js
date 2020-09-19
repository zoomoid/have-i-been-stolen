import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    stations: [],
    selectedBike: undefined,
    bikes: {},
    error: "",
    loading: false,
  },
  mutations: {
    addBike(state, { id, stations }) {
      state.bikes = {
        ...state.bikes,
        [id]: {
          page: 1,
          stations: stations
        }
      };
    },
    addToBike(state, { id, stations }) {
      const bike = state.bikes[id];
      bike.stations = [...bike.stations, ...stations];
      state.bikes = { ...state.bikes, [id]: bike };
    },
    incrementPage(state, { id }) {
      const bike = state.bikes[id];
      bike.page += 1;
      state.bikes = { ...state.bikes, [id]: bike };
    },
    decrementPage(state, { id }) {
      const bike = state.bikes[id];
      bike.page -= 1;
      state.bikes = { ...state.bikes, [id]: bike };
    },
    removeBike(state, { id }) {
      const bikes = state.bikes;
      delete bikes[id];
      state.bikes = bikes;
    },
    pushNotification(state, { message }) {
      state.message = message;
    },
    setBike(state, { id }) {
      state.selectedBike = id;
    },
    setLoading(state, { loading }) {
      state.loading = loading;
    },
    setStations(state, {stations}) {
      state.stations = stations;
    }
  },
  getters: {
    timespan(state) {
      const id = state.selectedBike;
      if (state.bikes[id]) {
        const lastEncounter = new Date(state.bikes[id].stations[0].time);
        const firstEncounter = new Date(
          state.bikes[id].stations[state.bikes[id].stations.length - 1].time
        );
        return lastEncounter - firstEncounter;
      }
      return 0;
    }
  },
  actions: {
    queryStations({ commit }) {
      commit("setLoading", {
        loading: true
      });
      axios
        .post("https://gbfsql.bikeshare.dev/graphql", {
          query: "{ Velocity { stations { name lon lat } } }"
        })
        .then(({ data }) => {
          commit("setStations", {
            stations: data["data"]["Velocity"]["stations"]
          });
          commit("setLoading", { loading: false });
        })
        .catch(error => {
          commit("pushNotification", { message: error.message });
          commit("setLoading", { loading: false });
        });
    },
    loadMore({ commit, state }) {
      const id = state.selectedBike;
      if (state.bikes[id]) {
        commit("incrementPage", { id });
        commit("setLoading", { loading: true });
        const page = state.bikes[id].page;
        axios
          .get(`https://bikehistory.openvelo.org/${id}/${page}`)
          .then(({ data }) => {
            commit("addToBike", { id, stations: data });
            commit("setLoading", { loading: false });
          })
          .catch(error => {
            if (error.response) {
              if (error.status === 404) {
                // no stations on this page, add empty list
                commit("addToBike", { id, stations: [] });
              } else {
                // bike state got corrupted, remove bike from state
                commit("removeBike", { id });
                commit("setBike", { id: -1 });
              }
            } else {
              // Possible network error, rollback page increment
              // to try again later
              commit("decrementPage", { id });
            }
            commit("setLoading", { loading: false });
          });
      }
    },
    query({ commit, state }, { id }) {
      if (!state.bikes[id]) {
        commit("setLoading", { loading: true });
        axios
          .get(`https://bikehistory.openvelo.org/${id}/1`)
          .then(({ data }) => {
            commit("addBike", {
              id: id,
              stations: data
            });
            commit("setBike", { id });
            commit("setLoading", { loading: false });
          })
          .catch(error => {
            if (error.response && error.status === 404) {
              // Page 1 got no results, add bike anyways
              commit("addBike", {
                id,
                stations: []
              });
              commit("setBike", { id });
            } else {
              commit("pushNotification", { message: error.message });
            }
            commit("setLoading", { loading: false });
          });
      }
    }
  }
});
