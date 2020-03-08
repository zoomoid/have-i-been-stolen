import { Icon } from 'leaflet';

class LeafletPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('Leaflet Plugin', () => {
      delete Icon.Default.prototype._getIconUrl;
      Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
      });
    })
  }
}

module.exports = LeafletPlugin;