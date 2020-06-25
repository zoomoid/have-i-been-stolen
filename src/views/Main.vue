<template>
  <div>
    <v-alert v-if="this.error" type="error" class="error-alert" dismissible>{{ this.error }}</v-alert>
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
                <v-btn @click="estimate_stolen()">Yes, I did!</v-btn>
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
        <Timeline @paginate="load_more" :bike="this.bike"></Timeline>
        <v-progress-linear
          indeterminate
          v-if="this.loading"
          color="blue darken-4"
          rounded
          height="8"
        ></v-progress-linear>
        <v-sheet class="primary" height="4em"></v-sheet>
        <p class="version" v-if="!this.bike">
          <a href="https://alexander.bartolomey.me" class="author">🚴 @zoomoid</a> 
          <a href="https://github.com/occloxium/have-i-been-stolen" target="_blank" class="version-no">
            v1.3.1
          </a><br>
          <router-link class="text-center" to="/disclaimer">Disclaimer</router-link>
        </p>
      </v-container>
      <v-btn x-large bottom right fixed id="to-top" class="rounded-pill" @click="$vuetify.goTo(0, {duration: 300, offset: 0, easing: 'easeInOutCubic'})" color="accent" v-if="this.show_fab"><v-icon>keyboard_arrow_up</v-icon> Go up</v-btn>
  </div>
</template>

<script>  
import Timeline from "@/components/Timeline.vue";
import axios from "axios";

export default {
  name: 'Main',
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
      loading: false,
      currently_loaded_pages: 0,
      show_fab: false,
    };
  },
  methods: {
    query() {
      this.bike = null;
      this.loading = true;
      this.prompt = false;
      this.probably_stolen = false;
      axios
        .get(`https://bikehistory.openvelo.org/${this.bike_id}/1`)
        .then(({data}) => {
          this.bike = {
            id: this.bike_id,
            states: data,
            weeks_loaded: this.currently_loaded_pages,
          };
          this.prompt = true;
          this.currently_loaded_pages = 1
          this.loading = false;
        })
        .catch(err => {
          this.bike = null;
          this.error = err;
          this.currently_loaded_pages = 0
          this.loading = false;
        });
    },
    load_more(){
      this.loading = true;
      axios
        .get(`https://bikehistory.openvelo.org/${this.bike_id}/${this.currently_loaded_pages + 1}`)
        .then(({data}) => {
          this.currently_loaded_pages++;
          this.bike.states = this.bike.states.concat(data);
          this.bike.weeks_loaded = this.currently_loaded_pages,
          this.loading = false;
        }).catch(err => {
          this.bike = null;
          this.error = err;
          this.currently_loaded_pages = 0
          this.loading = false;
        });
    },
    estimate_stolen() {
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
    },
    handle_scroll(){
      this.show_fab = window.scrollY > 2000;
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
  },
  created: function () {
    window.addEventListener('scroll', this.handle_scroll);
  },
  destroyed: function () {
    window.removeEventListener('scroll', this.handle_scroll);
  }

}
</script>

<style lang="scss">
#container {
  max-width: 768px;
  width: 100%;
  margin: 0 auto;
}
.error-alert {
  margin: 1em;
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
#to-top {
  right: 32px;
  bottom: 32px;
}
</style>