import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { latLng } from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { environment } from '../../../environments/environment';
import { icon, marker, Marker } from 'leaflet';

@Component({
  standalone: true,
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  imports: [LeafletModule]
})
export class MapComponent implements OnChanges, AfterViewInit {
  @Input() dataForMarker: any;
  map!: L.Map;
  markersLayer!: L.LayerGroup; 

  options = {
    zoom: 5,
    center: latLng(28.7040795, 77.1591007),
    maxZoom: 20,
  };
  multiOrderData: any[]=[];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataForMarker'] && this.map) {
      this.multiOrderData = changes['dataForMarker'].currentValue;
      console.log(this.multiOrderData,'running')
      this.plotMarkers();
    }
  }

  ngAfterViewInit(): void {
    this.map = L.map('map', {
      center: this.options.center,
      zoom: this.options.zoom,
      maxZoom: this.options.maxZoom,
      zoomControl: true,
    });

    L.tileLayer(`https://mt{s}.googleapis.com/vt?x={x}&y={y}&z={z}&key=${environment.googleMapKey}`, {
      subdomains: ['0', '1', '2', '3'],
      maxZoom: this.options.maxZoom,
      attribution: '&copy; <a href="https://www.google.com/intl/en_us/help/terms_maps.html">Google Maps</a>',
    }).addTo(this.map);

    this.map.setView(this.options.center, this.options.zoom);

    this.markersLayer = L.layerGroup().addTo(this.map);

    if (this.dataForMarker) {
      this.multiOrderData = this.dataForMarker;
      this.plotMarkers();
    }

    setTimeout(() => {
      this.map.invalidateSize();
    }, 500);
  }

  plotMarkers() {
    this.markersLayer.clearLayers();

    if (!this.multiOrderData || this.multiOrderData.length === 0) {
      return;
    }

    const markerList: Marker[] = [];

    this.multiOrderData.forEach((row: any) => {
      if (row.latitude && row.longitude) {
        const m = marker(
          [parseFloat(row.latitude), parseFloat(row.longitude)],
          {
            icon: icon({
              iconSize: [15, 31],
              iconAnchor: [7.5, 31],
              iconUrl: 'assets/images/map-marker.png',
              shadowUrl: 'assets/images/marker-shadow.png',
            }),
          }
        ).bindTooltip(row.shipment_id, {
          permanent: false,
          direction: 'top',
        });

        markerList.push(m);
        this.markersLayer.addLayer(m); 
      }
    });

    if (markerList.length > 0) {
      setTimeout(() => {
        const bounds = L.latLngBounds(markerList.map(m => m.getLatLng()));
        this.map.fitBounds(bounds);
      }, 400);
    }
  }
}
