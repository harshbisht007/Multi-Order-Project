import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { environment } from '../../../environments/environment';  // Ensure you have HERE API key in environment

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  private map!: L.Map;

  constructor() { }

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // Define map options
    const options = {
      layers: [
        L.tileLayer(`https://1.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?apiKey=${environment.hereApiKey}`, {
          attribution: 'Map data ©2024 HERE',
        }),
      ],
      minZoom: 5,
      maxZoom: 18,
      fullscreenControl: true,
      zoomControl: true,
      zoom: 12,
      center: L.latLng(28.7163, 77.1563)  // Set the center to the coordinates
    };

    // Initialize the map with the options
    this.map = L.map('map', options);
    setTimeout(() => {
      this.map.invalidateSize()
    }, 2000);
  }
}
