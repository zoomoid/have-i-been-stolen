import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    stations: [],
    selectedBike: 0,
    bikes: {},
    error: ""
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
    setBike(state, {id}) {
      state.selectedBike = id; 
    },
  },
  getters: {
    bikeById: state => id => {
      return {...state[id], id} || {id, stations: [], page: 0};
    },
  },
  actions: {
    queryStations({ commit, state }) {
      axios
        .post("https://gbfsql.bikeshare.dev/graphql", {
          query: "{ Velocity { stations { name lon lat } } }"
        })
        .then(({ data }) => {
          state.stations = data["data"]["Velocity"]["stations"];
        })
        .catch(error => {
          commit("pushNotification", { message: error.message });
        });
    },
    loadMore({ commit, state }) {
      const id = state.selectedBike;
      if (state.bikes[id]) {
        commit("incrementPage", { id });
        const page = state.bikes[id].page;
        axios
          .get(`https://bikehistory.openvelo.org/${id}/${page}`)
          .then(({ data }) => {
            commit("addToBike", { id, stations: data });
          })
          .catch(error => {
            if (error.response) {
              if (error.status === 404) {
                // no stations on this page, add empty list
                commit("addToBike", { id, stations: [] });
              } else {
                // bike state got corrupted, remove bike from state
                commit("removeBike", { id });
                commit("setBike", {id: -1});
              }
            } else {
              // Possible network error, rollback page increment
              // to try again later
              commit("decrementPage", { id });
            }
          });
      }
    },
    query({ commit, state }, { id }) {
      if (!state.bikes[id]) {
        axios
          .get(`https://bikehistory.openvelo.org/${id}/1`)
          .then(({ data }) => {
            commit("addBike", {
              id: id,
              stations: data
            });
            commit("setBike", {
              id
            });
          })
          .catch(error => {
            if (error.response && error.status === 404) {
              // Page 1 got no results, add bike anyways
              commit("addBike", {
                id,
                stations: []
              });
              commit("setBike", {
                id
              });
            } else {
              commit("pushNotification", {
                message: error.message
              });
            }
          });
      }
    }
  }
});
