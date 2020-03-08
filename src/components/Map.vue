<template>
  <v-container fluid>
      
    <v-card elevation="2">
      <v-card-text v-if="this.error !== null">
        <p class="text-center text--disabled">
          <v-icon>error_outline</v-icon> An error occured while fetching map
        </p>
      </v-card-text>
      <v-card-text class="wrapper" v-else>
        <l-map class="map" 
          :zoom="zoom" 
          :center="center" 
          :max-zoom="zoom"
          :min-zoom="zoom"
          :max-bounds="bounds">
          <l-tile-layer :url="url"></l-tile-layer>
          <l-marker :lat-lng="center"></l-marker>
        </l-map>
      </v-card-text>
    </v-card>
    
  </v-container>

</template>

<script>
import { latLng, latLngBounds } from 'leaflet';
import { 
  LMap, 
  LTileLayer, 
  LMarker 
} from 'vue2-leaflet';

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
  },
  data: () => ({
    error: null,
    zoom: 15,
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  }),
  props: {
    station: String,
  },
  computed: {
    center: function(){
      let _center = this.$root.stations.find(({name}) => name === this.station);
      return latLng(
        _center.latitude,
        _center.longitude,
      );
    },
    bounds: function(){
      let _center = this.$root.stations.find(({name}) => name === this.station);

      return latLngBounds([
        [_center.latitude - 0.0035, _center.longitude - 0.0019],
        [_center.latitude + 0.0035, _center.longitude + 0.0019],
      ])
    }
  },
  mounted: () => {
    
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.map {
  height: 260px;
  width: 100%;
  z-index: 0;
  filter: grayscale(0.66);
  &:hover, &:active {
    filter: none;
  }
}
.overlay {
  display: relative;
  z-index: 10;
}
</style>