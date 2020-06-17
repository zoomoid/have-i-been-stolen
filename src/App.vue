<template>
  <v-app dark>
    <v-app-bar flat class="primary" app>
      <v-toolbar-title class="font-weight-bold">Have I Been Stolen?</v-toolbar-title>
    </v-app-bar>
    <v-main app class="primary">
      <v-alert v-if="this.error" type="error">{{ this.error }}</v-alert>
      <v-container id="container" fluid>
        <v-sheet class="primary"  height="4em"></v-sheet>
        <v-form v-on:submit.prevent="query" id="search_form">
          <v-text-field
            v-model="bike_id"
            class="text-field"
            flat
            tabindex="0"
            hint="The bike number is usually visible on the frame of the bike"
            label="Bike No."
            :rules="[
              (id) => /^-?[0-9]*$/.test(id) || 'ID must be a number.',
              (id) => id > 0 || 'ID must be greater than 0.',
            ]"
          >
          </v-text-field>
          <v-sheet class="primary" height="1em"></v-sheet>
          <v-btn
            type="button"
            @click="query()"
            bottom
            block
            large
            depressed
            color="accent"
            >Find Bike</v-btn
          >
        </v-form>
        <v-sheet class="primary" height="2em"></v-sheet>
        <v-progress-linear
          indeterminate
          v-if="this.loading"
          color="blue darken-4"
          rounded
          height="8"
        ></v-progress-linear>
        <template v-if="bike !== null">
          <v-alert
            prominent
            v-if="prompt"
            type="error"
            color="red"
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
            <v-alert prominent v-else color="green" type="info" dismissible>
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
        <p class="version" v-if="!this.bike">
          <a href="https://alexander.bartolomey.me" class="author">🚴 @zoomoid</a> 
          <a href="https://github.com/occloxium/have-i-been-stolen" target="_blank" class="version-no">
            v1.2.1
          </a>
        </p>
      </v-container>
    </v-main>
  </v-app>
</template>

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

<style lang="scss">
#container {
  max-width: 768px;
  width: 100%;
  margin: 0 auto;
}
.notification-text {
  // padding-left: 1em;
  span {
    display: block;
  }
}
input {
  max-height: none !important;
  font-weight: 600 !important;
  font-size: 4em !important;
}
.v-toolbar__title {
  font-size: 1.25em !important;
}
.version {
  text-align: center;
  a {
    text-decoration: none;
    opacity: 0.4;
    color: #ffffff !important;
    &:hover, &:active {
      opacity: 1;
    }
  }
  .version-no {
    &::before {
      content: ' \2013' 
    }
  }
}
</style>