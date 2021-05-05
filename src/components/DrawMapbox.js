import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { observer, inject } from 'mobx-react';
import {
  MapContainer,
  Polyline,
  TileLayer,
  Marker,
  Popup
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// stupid hack so that leaflet's images work after going through webpack
import marker from '../icons/marker.svg';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker,
  shadowUrl: markerShadow
});

@inject('store')
@observer
export default class Mapbox extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { route, zoom } = this.props;

    return (
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <MapContainer
          attributionControl={false}
          zoomControl={false}
          center={[route[0].from.cors.lat, route[0].from.cors.lng]}
          zoom={zoom || 2}
          scrollWheelZoom={true}
        >
          <TileLayer url="http://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}" />
          {route.map((dest, i) => {
            return (
              <Polyline
                key={i}
                positions={[
                  [dest.from.cors.lat, dest.from.cors.lng],
                  [dest.to.cors.lat, dest.to.cors.lng]
                ]}
                color={'#0696d7'}
              />
            );
          })}

          {route.map((dest, i) => {
            return (
              <div>
                {i === 0 && (
                  <Marker
                    key={`marker-${i}`}
                    position={[dest.from.cors.lat, dest.from.cors.lng]}
                  >
                    <Popup>
                      <span>
                        <h5>{dest.from.city}</h5>
                        {dest.from.country}
                      </span>
                    </Popup>
                  </Marker>
                )}

                <Marker
                  key={`marker2-${i}`}
                  position={[dest.to.cors.lat, dest.to.cors.lng]}
                >
                  <Popup>
                    <span>
                      <h5>{dest.to.city}</h5>
                      {dest.to.country}
                    </span>
                  </Popup>
                </Marker>
              </div>
            );
          })}
        </MapContainer>
      </div>
    );
  }
}
