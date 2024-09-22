import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  imports: [],
})
export class MapComponent implements OnChanges, AfterViewInit {
  @Input() dataForMarker: any;
  @Input() thirdStepDataForMarker: any;
  @Input() pickupLocation: any;
  
  private map!: L.Map;
  private markersLayer = L.layerGroup();
  private touchPointMarkers: L.Marker[] = [];
  
  private readonly options = {
    zoom: 5,
    center: L.latLng(28.7040795, 77.1591007),
    maxZoom: 20,
  };

  private readonly markerIconConfig = {
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    shadowUrl: 'assets/images/marker-shadow.png',
  };

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map) {
      if (changes['dataForMarker']?.currentValue) {
        this.plotMarkers(changes['dataForMarker'].currentValue);
      }
      if (changes['thirdStepDataForMarker']?.currentValue) {
        this.plotMarkerForThirdStep(changes['thirdStepDataForMarker'].currentValue);
      }
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      
      this.initializeMap();
      this.handleInitialData();
    }, 500);
  }

  private initializeMap(): void {
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

    this.markersLayer.addTo(this.map);
  }

  private handleInitialData(): void {
    if (this.dataForMarker) {
      this.plotMarkers(this.dataForMarker);
    } else if (this.thirdStepDataForMarker) {
      this.plotMarkerForThirdStep(this.thirdStepDataForMarker);
    }

    this.map.invalidateSize({ debounceMoveend: true });
  }

  private plotMarkers(data: any[]): void {
    this.clearMarkers();
    const markers = data
      .filter(row => row.latitude && row.longitude)
      .map(row => this.createMarker(row.latitude, row.longitude, row.shipment_id, 'assets/images/map-marker.png', [15, 31]));
    
    markers.forEach(marker => this.markersLayer.addLayer(marker));

    if (markers.length) {
      this.map.fitBounds(L.latLngBounds(markers.map(m => m.getLatLng())));
    }
  }

  private async plotMarkerForThirdStep(data: any[]): Promise<void> {
    this.clearMarkers();

    // Plot pickup location marker
    this.touchPointMarkers.push(this.createMarker(this.pickupLocation[1], this.pickupLocation[0], 'Hub', 'assets/images/merchant.png', [30, 30]));

    // Prepare coordinates for route
    const coordinates = [
      [this.pickupLocation[0], this.pickupLocation[1]],
      ...data.map(point => [point.touch_point.geom.longitude, point.touch_point.geom.latitude]),
    ];

    // Fetch and plot the route
    const route = await this.fetchRoute(coordinates);
    this.plotRoute(route);

    // Plot touchpoint markers
    data.forEach((point, index) => this.createSpecialMarker(point, index + 1));
  }

  private createSpecialMarker(point: any, index: number): void {
    const marker = L.marker(
      [point.touch_point.geom.latitude, point.touch_point.geom.longitude],
      {
        icon: L.divIcon({
          className: 'custom-div-icon',
          html: `<div style='background-color:blue;' class='marker-pin'></div><i>${index}</i>`,
          iconSize: [30, 42],
          iconAnchor: [15, 42],
        }),
      }
    ).bindTooltip(point.name || `Point ${index}`, { direction: 'top' });

    this.touchPointMarkers.push(marker);
    marker.addTo(this.map);
  }

  private async fetchRoute(coordinates: number[][]): Promise<any> {
    return this.http.post('https://routing.roadcast.co.in/ors/v2/directions/driving-car/geojson', { coordinates }).toPromise();
  }

  private plotRoute(route: any): void {
    const routeGeoJson = L.geoJSON(route, { style: { color: 'blue', weight: 4 } }).addTo(this.map);
    this.map.fitBounds(routeGeoJson.getBounds());
  }

  private createMarker(lat: number, lng: number, tooltipText: string, iconUrl: string, iconSize: [number, number]): L.Marker {
    return L.marker([lat, lng], {
      icon: L.icon({ iconSize, iconAnchor: [iconSize[0] / 2, iconSize[1]], iconUrl, shadowUrl: this.markerIconConfig.shadowUrl }),
    }).bindTooltip(tooltipText, { direction: 'top' }).addTo(this.map);
  }

  private clearMarkers(): void {
    this.markersLayer.clearLayers();
    this.touchPointMarkers = [];
  }
  ngOnDestroy(){
    this.map.remove();
    this.clearMarkers()
  }
}
