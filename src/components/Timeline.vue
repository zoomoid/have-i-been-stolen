<template>
  <v-card elevation="16" v-if="bike !== null">
    <v-card-text>
      <v-sheet height="4em"></v-sheet>
      <h1 class="display-2">Bike #{{ bike.id }}</h1>
      <p class="">
        Last seen on
        <span class="last-seen__when">{{
          human_readable_date(bike.states[0].time)
        }}</span>
        at <span class="last-seen__where">{{ bike.states[0].station }}</span>
      </p>
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
              <v-icon v-if="state.state === 'BIKE_AVAILABLE'">beenhere</v-icon>
              <v-icon v-else-if="state.state === 'BIKE_RESERVED'">lock</v-icon>
              <v-icon v-else-if="state.state === 'BIKE_BROKEN'">help_outline</v-icon>
              <v-icon v-else>highlight_off</v-icon>
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
        </v-timeline-item>
      </v-timeline>
    </v-card-text>
  </v-card>
  <v-card flat v-else>
    <v-card-text>
      <p class="text-center text--disabled">Currently no bike selected</p>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "Timeline",
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