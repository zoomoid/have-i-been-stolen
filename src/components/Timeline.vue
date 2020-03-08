<template>
  <v-card elevation="16" v-if="bike !== null">
    <v-card-text>
      <v-sheet height="4em"></v-sheet>
      <h1 class="display-2">Bike #{{ bike.id }}</h1>
      <template v-if="bike.states.length == 0">
        <p class="text--disabled">
          No observation in the last week
        </p>
      </template>
      <template v-else>
        <p class="">
          Last seen on
          <span class="last-seen__when">{{
            human_readable_date(bike.states[0].time)
          }}</span>
          at <span class="last-seen__where">{{ bike.states[0].station }}</span>
        </p>
        <div>
          <v-timeline align-top dense>
            <v-timeline-item
              icon="place"
              class="state"
              color="grey darken-4"
              fill-dot
              right
              v-for="state in bike.states"
              v-bind:key="state.time"
            >
              <v-list-item two-line>
                <v-list-item-avatar>
                  <v-tooltip v-if="state.state === 'BIKE_AVAILABLE'" bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">beenhere</v-icon>
                    </template>
                    <span>Bike available</span>
                  </v-tooltip>
                  <v-tooltip v-else-if="state.state === 'BIKE_RESERVED'" bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">lock</v-icon>
                    </template>
                    <span>Bike reserved</span>
                  </v-tooltip>
                  <v-tooltip v-else-if="state.state === 'BIKE_BROKEN'" bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">highlight_off</v-icon>
                    </template>
                    <span>Bike broken</span>
                  </v-tooltip>
                  <v-tooltip v-else-if="state.state === 'SLOT_DISABLED'" bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">build</v-icon>
                    </template>
                    <span>Slot disabled</span>
                  </v-tooltip>
                  <v-tooltip v-else bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">help_outline</v-icon>
                    </template>
                    <span>Unknown status</span>
                  </v-tooltip>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="state__where title">{{
                    state.station
                  }}</v-list-item-title>
                  <v-list-item-subtitle class="state__when subtitle-1">{{
                    human_readable_date(state.time)
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <Map :station="state.station"></Map>
            </v-timeline-item>
          </v-timeline>
        </div>
      </template>
    </v-card-text>
  </v-card>
  <v-card flat v-else>
    <v-card-text>
      <p class="text-center text--disabled">Currently no bike selected</p>
    </v-card-text>
  </v-card>
</template>

<script>
import Map from "./Map.vue";

export default {
  name: "Timeline",
  components: {
    Map
  },
  props: {
    bike: Object,
    default: null
  },
  methods: {
    human_readable_date(date_string) {
      return new Date(date_string).toLocaleString("de-DE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.v-timeline-item {
  align-items: center;
  padding-bottom: 3em;
}
</style>