<template>
  <v-container fluid>
    <v-card class="card primary" elevation="4">
      <v-card-text v-if="this.error">
        <p class="text-center text--disabled">
          <v-icon>error_outline</v-icon> An error occured while fetching map
        </p>
      </v-card-text>
      <v-card-text class="wrapper" v-else>
        <l-map
          class="map"
          :zoom="zoom"
          :center="center"
          :max-zoom="zoom"
          :min-zoom="zoom"
          :max-bounds="bounds"
        >
          <l-tile-layer :url="url"></l-tile-layer>
          <l-marker :lat-lng="center"></l-marker>
        </l-map>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { latLng, latLngBounds } from "leaflet";
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import { mapState } from "vuex";

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
  },
  data: () => ({
    zoom: 15,
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  }),
  props: {
    station: String,
  },
  computed: {
    ...mapState(['error', 'stations']),
    center: function () {
      let _center = this.stations.find(
        ({ name }) => name === this.station
      );
      return latLng(_center.lat, _center.lon);
    },
    bounds: function () {
      let _center = this.stations.find(
        ({ name }) => name === this.station
      );

      return latLngBounds([
        [_center.lat - 0.0035, _center.lon - 0.0019],
        [_center.lat + 0.0035, _center.lon + 0.0019],
      ]);
    },
  },
  mounted: () => {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.map {
  height: 260px;
  width: 100%;
  z-index: 0;
  filter: grayscale(0.25);
  &:hover,
  &:active {
    filter: none;
  }
  border-radius: 8px;
}
.v-card__text {
  padding: 0;
}
.overlay {
  display: relative;
  z-index: 10;
}
</style>