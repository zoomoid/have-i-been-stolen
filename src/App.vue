<template>
  <v-app>
    <v-app-bar flat dark app>
      <v-toolbar-title>Have I Been Stolen?</v-toolbar-title>
    </v-app-bar>
    <v-content>
      <v-container id="container" fluid>
        <v-sheet height="4em"></v-sheet>
        <v-form id="search_form">
          <v-text-field
            v-model="bike_id"
            flat
            hint="Bike number is usually visible on the frame of the bike"
            label="Bike No."
          >
          </v-text-field>
          <v-sheet height="1em"></v-sheet>
          <v-btn type="submit" bottom block large depressed color="primary">Find Bike</v-btn>
        </v-form>
        <v-sheet height="2em"></v-sheet>
        <Timeline v-bind:bike="bike"></Timeline>
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
    };
  },
  methods: {
    query(){
      axios.get(`https://bikehistory.openvelo.org/${this.bike_id}`)
        .then(response => this.bike = {
          id: this.bike_id,
          states: response.data,
        }).catch(err => {
          this.bike = null;
          this.error = err
        })
    }
  }
};
</script>
