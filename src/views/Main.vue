<template>
  <div>
    <v-alert v-if="this.error" type="error" class="error-alert" dismissible>{{
      this.error
    }}</v-alert>
    <v-container id="container" fluid>
      <v-form v-on:submit.prevent="handleSubmit" id="search_form">
        <v-text-field
          v-model="bikeId"
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
        <v-btn
          type="button"
          @click="handleSubmit"
          bottom
          block
          large
          depressed
          color="accent"
          >Find Bike</v-btn
        >
      </v-form>
      <v-sheet height="1em"></v-sheet>
      <template v-if="selectedBike">
        <v-alert prominent v-if="prompt" type="error" color="red" dismissible>
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
                  <span class="font-weight-bold"
                    >We estimate that this bike is probably stolen!</span
                  >
                  <span class="body-2"
                    >If you are unsure, try again in a few hours.</span
                  >
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
      <Timeline v-if="selectedBike" @paginate="handlePaginate" :bike="bike"></Timeline>
      <v-progress-linear
        indeterminate
        v-if="this.loading"
        color="blue darken-4"
        rounded
        height="8"
      ></v-progress-linear>
      <v-sheet height="4em"></v-sheet>
      <p class="version" v-if="!bike">
        <a href="https://alexander.bartolomey.me" class="author">🚴 @zoomoid</a>
        <a
          href="https://github.com/occloxium/have-i-been-stolen"
          target="_blank"
          class="version-no"
        >
          v1.4.1 </a
        ><br />
        <router-link class="text-center" to="/disclaimer"
          >Disclaimer</router-link
        >
      </p>
    </v-container>
    <v-btn
      x-large
      bottom
      right
      fixed
      id="to-top"
      class="rounded-pill"
      @click="
        $vuetify.goTo(0, { duration: 300, offset: 0, easing: 'easeInOutCubic' })
      "
      color="accent"
      v-if="this.show_fab"
      ><v-icon>keyboard_arrow_up</v-icon> Go up</v-btn
    >
  </div>
</template>

<script>
import Timeline from "@/components/Timeline.vue";
import { mapState } from "vuex";

export default {
  name: "Main",
  components: {
    Timeline,
  },
  data: function () {
    return {
      bikeId: "",
      prompt: true,
      probably_stolen: false,
      show_fab: false,
    };
  },
  computed: {
    ...mapState(["selectedBike", "error", "bikes", 'loading']),
    bike() {
      if (this.bikeId) {
        return { ...this.bikes[this.bikeId], id: this.bikeId };
      } else {
        return undefined;
      }
    },
  },
  methods: {
    estimate_stolen() {
      if (this.bike.stations.length == 0) {
        this.probably_stolen = true;
        this.prompt = false;
        return;
      }
      let c = Date.now();
      let lastSeen = Date.parse(this.bike.stations[0].time);
      if (c - lastSeen > 1000 * 60 * 60 * 24 * 3) {
        this.probably_stolen = true;
      }
      if (
        this.bike.stations[0].state === "BIKE_BROKEN" ||
        this.bike.stations[0].state === "SLOT_DISABLED"
      ) {
        this.probably_stolen = true;
      }
      this.prompt = false;
    },
    handleSubmit() {
      this.$store.dispatch("query", {
        id: this.bikeId,
      });
    },
    handlePaginate() {
      this.$store.dispatch("loadMore");
    },
    handle_scroll() {
      this.show_fab = window.scrollY > 2000;
    },
  },
  mounted: function () {
    this.$store.dispatch("queryStations");
  },
  created: function () {
    window.addEventListener("scroll", this.handle_scroll);
  },
  destroyed: function () {
    window.removeEventListener("scroll", this.handle_scroll);
  },
};
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
    &:hover,
    &:active {
      opacity: 1;
    }
  }
  .version-no {
    &::before {
      content: " \2013";
    }
  }
}
#to-top {
  right: 32px;
  bottom: 32px;
}
</style>