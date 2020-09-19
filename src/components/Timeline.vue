<template>
  <v-card elevation="16" v-if="bike !== null">
    <v-card-text>
      <v-sheet height="4em"></v-sheet>
      <h1 class="display-2">🚴 Bike #{{ bike.id }}</h1>
      <template v-if="bike.stations.length == 0">
        <p class="text--disabled">
          No observation in the last {{bike.page > 1 ? this.bike.page + " weeks" : "week"}}
        </p>
      </template>
      <template v-else>
        <p class="last_seen">
          Last seen on
          <span class="last-seen__when">{{
            human_readable_date(bike.stations[0].time)
          }}</span>
          at <span class="last-seen__where">{{ bike.stations[0].station }}</span><br>
        </p>
        <p class="text--disabled text-left">
          Searched the bike in data of {{this.bike.weeks_loaded > 1 ? this.bike.weeks_loaded + " weeks" : "one week"}}
        </p>
        <div>
          <v-timeline align-top dense>
            <div v-for="station in bike.stations" v-bind:key="station.time">
              <v-lazy transition="fade-transition" :options="{ threshold: 0.8 }" height="380">
                <v-timeline-item icon="place" class="state" color="grey darken-4"
                  fill-dot right>
                  <v-list-item two-line>
                    <v-list-item-avatar>
                      <v-tooltip v-if="station.state === 'BIKE_AVAILABLE'" bottom>
                        <template v-slot:activator="{ on }">
                          <v-icon v-on="on">beenhere</v-icon>
                        </template>
                        <span>Bike available</span>
                      </v-tooltip>
                      <v-tooltip v-else-if="station.state === 'BIKE_RESERVED'" bottom>
                        <template v-slot:activator="{ on }">
                          <v-icon v-on="on">lock</v-icon>
                        </template>
                        <span>Bike reserved</span>
                      </v-tooltip>
                      <v-tooltip v-else-if="station.state === 'BIKE_BROKEN'" bottom>
                        <template v-slot:activator="{ on }">
                          <v-icon v-on="on">highlight_off</v-icon>
                        </template>
                        <span>Bike broken</span>
                      </v-tooltip>
                      <v-tooltip v-else-if="station.state === 'SLOT_DISABLED'" bottom>
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
                        station.station
                      }}</v-list-item-title>
                      <v-list-item-subtitle class="state__when subtitle-1">{{
                        human_readable_date(station.time)
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <Map :station="station.station"></Map>
                </v-timeline-item>
              </v-lazy>
            </div>
          </v-timeline>
        </div>
      </template>
      <v-divider></v-divider>
      <p class="text-center">
        Searched the bike in data of {{this.bike.page > 1 ? this.bike.page + " weeks" : "one week"}}
      </p>
      <v-lazy transition="fade-transition" :options="{ threshold: 1 }">
        <v-btn rounded x-large id="load-more" class="accent rounded-pill" 
          v-intersect.quiet="{handler: onIntersect, options: { rootMargin: '0px 0px 0px 0px', threshold: 1 }}" @click="$emit('paginate')">
          <v-icon left>cached</v-icon> Load more
        </v-btn>
      </v-lazy>
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
    },
    onIntersect() {
      this.$emit('paginate')
    }
  }
};
</script>

<style lang="scss">
.v-timeline-item {
  align-items: center;
  padding-bottom: 4em;
}

#load-more {
  margin: 3em auto 1em;
  display: block;
}

.v-application--is-ltr .v-timeline--dense:not(.v-timeline--reverse):before {
  left: calc(32px - 1px) !important;
}

.v-timeline--dense .v-timeline-item__body {
  max-width: calc(100% - 64px) !important;
}

.v-timeline-item__divider {
  min-width: 64px !important;
}

@media only screen and (max-width: 450px){
  .v-card__text {
    padding: 0;
  }
}
p.last-seen {
  margin-bottom: 0;
  .last-seen__where {
    font-weight: bold;
  }
  .last-seen__when {
    font-weight: bold;
  }
}
</style>