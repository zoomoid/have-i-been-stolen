<template>
  <v-app>
    <v-app-bar flat dark app>
      <v-spacer></v-spacer>
      <v-toolbar-title class="font-weight-bold">Have I Been Stolen?</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-content>
      <v-alert v-if="this.error" type="error">{{ this.error }}</v-alert>
      <v-container id="container" fluid>
        <v-sheet height="4em"></v-sheet>
        <v-form v-on:submit.prevent="query" id="search_form">
          <v-text-field
            v-model="bike_id"
            flat
            hint="The bike number is usually visible on the frame of the bike"
            label="Bike No."
            :rules="[
              (id) => /^-?[0-9]*$/.test(id) || 'ID must be a number.',
              (id) => id > 0 || 'ID must be greater than 0.',
            ]"
          >
          </v-text-field>
          <v-sheet height="1em"></v-sheet>
          <v-btn
            type="button"
            @click="query()"
            bottom
            block
            large
            depressed
            color="primary"
            >Find Bike</v-btn
          >
        </v-form>
        <v-sheet height="2em"></v-sheet>
        <v-progress-linear
          indeterminate
          v-if="this.loading"
          color="grey darken-4"
          rounded
          height="8"
        ></v-progress-linear>
        <template v-if="bike !== null">
          <v-alert
            prominent
            v-if="prompt"
            type="error"
            color="deep-orange"
            dismissible
          >
            <v-row align="center">
              <v-col class="grow"
                >Have you recently encountered the bike you were searching
                for?</v-col
              >
              <v-col class="shrink">
                <v-btn @click="estimateStolen()">Yes, I did!</v-btn>
              </v-col>
            </v-row>
          </v-alert>
          <template v-else>
            <v-alert prominent v-if="probably_stolen" type="error" dismissible>
              <v-row align="center" class="notification-text">
                <v-col class="grow">
                  <span class="body-2">
                    <span class="font-weight-bold">We estimate that this bike is probably stolen!</span>
                    <span class="body-2">If you are unsure, try again in a few hours.</span>                   
                  </span>
                </v-col>
              </v-row>
            </v-alert>
            <v-alert prominent v-else type="info" dismissible>
              <v-row align="center" class="notification-text">
                <v-col class="grow">
                  <span class="font-weight-bold"
                    >This bike has not passed our threshold for being
                    stolen.</span
                  >
                  <span class="body-2"
                    >If you are unsure, try again in a few hours.</span
                  >
                </v-col>
              </v-row>
            </v-alert>
          </template>
        </template>
        <Timeline :bike="this.bike"></Timeline>
      </v-container>
    </v-content>
  </v-app>
</template>

<style lang="scss">
#container {
  max-width: 768px;
  width: 100%;
  margin: 0 auto;
}
</style>

<script>
import Timeline from "@/components/Timeline.vue";
import axios from "axios";
export default {
  components: {
    Timeline
  },
  data: function() {
    return {
      bike_id: null,
      bike: null,
      error: null,
      prompt: false,
      probably_stolen: false,
      loading: false
    };
  },
  methods: {
    query() {
      this.bike = null;
      this.loading = true;
      this.prompt = false;
      this.probably_stolen = false;
      axios
        .get(`https://bikehistory.openvelo.org/${this.bike_id}`)
        .then(response => {
          this.bike = {
            id: this.bike_id,
            states: response.data
          };
          // console.log(this.bike);
          this.prompt = true;
          this.loading = false;
        })
        .catch(err => {
          this.bike = null;
          this.error = err;
          this.loading = false;
        });
    },
    estimateStolen() {
      if (this.bike.states.length == 0) {
        this.probably_stolen = true;
        this.prompt = false;
        return;
      }
      let c = Date.now();
      let lastSeen = Date.parse(this.bike.states[0].time);
      if (c - lastSeen > 1000 * 60 * 60 * 24 * 3 ) {
        this.probably_stolen = true;
      }
      
      if (
        this.bike.states[0].state === "BIKE_BROKEN" ||
        this.bike.states[0].state === "SLOT_DISABLED"
      ) {
        this.probably_stolen = true;
      }
      this.prompt = false;
    }
  },
  mounted: function() {
    axios
      .post("https://gbfsql.bikeshare.dev/graphql", {
        query: "{ Velocity { stations { name lon lat } } }"
      })
      .then(({data}) => {
        this.$root.stations = data["data"]["Velocity"]["stations"];
      })
      .catch(err => {
        this.error = err;
      });
  }
};
</script>

<style lang="scss" scoped>
.notification-text {
  // padding-left: 1em;
  span {
    display: block;
  }
}
</style>