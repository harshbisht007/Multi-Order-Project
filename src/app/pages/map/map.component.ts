import { AfterViewChecked, AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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
  @Input() isMissed: any;
  private map!: L.Map;
  private markersLayer = L.layerGroup();
  private touchPointMarkers: L.Marker[] = [];
  private markerBounds: L.LatLngBounds | null = null; // Initialize as null
  private previousRouteLayer: L.GeoJSON | null = null;

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

  constructor(private http: HttpClient) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map) {
      if (changes['dataForMarker']?.currentValue) {
        this.plotMarkers(changes['dataForMarker'].currentValue);
      }
      if (changes['thirdStepDataForMarker']?.currentValue) {
        this.plotMarkerForThirdStep(changes['thirdStepDataForMarker'].currentValue, this.isMissed);
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
      this.plotMarkerForThirdStep(this.thirdStepDataForMarker, this.isMissed);
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

  private async plotMarkerForThirdStep(data: any[], isMissed: any): Promise<void> {

  await this.clearMarkers();
    if (!this.isMissed) {
      this.touchPointMarkers.push(this.createMarker(this.pickupLocation[1], this.pickupLocation[0], 'Hub', 'assets/images/merchant.png', [30, 30]));
      // Prepare coordinates for route
      const coordinates = [
        [this.pickupLocation[0], this.pickupLocation[1]],
        ...data.map(point => [point.touch_point.geom.longitude, point.touch_point.geom.latitude]),
      ];

      // Fetch and plot the route
      if(coordinates.length>1){
        const route = await this.fetchRoute(coordinates);
        this.plotRoute(route);
      }else{
        if (this.previousRouteLayer) {
          this.map.removeLayer(this.previousRouteLayer);
        }
      }
    }


  
    console.log(this.touchPointMarkers,'122')
    data.forEach((point, index) => this.createSpecialMarker(point, index + 1));
  }

  private createSpecialMarker(point: any, index: number): void {
    console.log(point, '122')
    
    const isMissed = this.isMissed;

    const iconOptions: L.IconOptions = {
      iconSize: [30, 42] as L.PointTuple,
      iconAnchor: [15, 42] as L.PointTuple,
      iconUrl: 'assets/images/red-marker.svg'
    };
    const iconHtml = isMissed
      ? L.icon({
        iconUrl: iconOptions.iconUrl,
        iconSize: iconOptions.iconSize,
        iconAnchor: iconOptions.iconAnchor,
      })
      : L.divIcon({
        className: 'custom-div-icon',
        html: `<div style='background-color:blue;' class='marker-pin'></div><i>${index}</i>`,
        iconSize: iconOptions.iconSize,
        iconAnchor: iconOptions.iconAnchor,
      });

    const marker = L.marker(
      [point.touch_point.geom.latitude, point.touch_point.geom.longitude],
      {
        icon: iconHtml,
      }
    ).bindTooltip(point.customer_name || `Point ${index}`, { direction: 'top' });

    this.touchPointMarkers.push(marker);
    marker.addTo(this.map);
    this.markerBounds?.extend([point.touch_point.geom.latitude, point.touch_point.geom.longitude]);
    if (isMissed) {
      this.fitMapToMarkers()
    }
  }

  public fitMapToMarkers(): void {
    if (this.markerBounds?.isValid()) { // Check if bounds are valid
      this.map.fitBounds(this.markerBounds, { padding: [20, 20] }); // Adjust padding as necessary
    }
  }

  private async fetchRoute(coordinates: number[][]): Promise<any> {
    return this.http.post('https://routing.roadcast.co.in/ors/v2/directions/driving-car/geojson', { coordinates }).toPromise();
  }

  private plotRoute(route: any): void {
    if (this.previousRouteLayer) {
      this.map.removeLayer(this.previousRouteLayer);
    }
    this.previousRouteLayer = L.geoJSON(route, { style: { color: 'blue', weight: 4 } }).addTo(this.map);
    this.map.fitBounds(this.previousRouteLayer.getBounds());
  }

  private createMarker(lat: number, lng: number, tooltipText: string, iconUrl: string, iconSize: [number, number]): L.Marker {
    return L.marker([lat, lng], {
      icon: L.icon({ iconSize, iconAnchor: [iconSize[0] / 2, iconSize[1]], iconUrl, shadowUrl: this.markerIconConfig.shadowUrl }),
    }).bindTooltip(tooltipText, { direction: 'top' }).addTo(this.map);
  }

  private async clearMarkers(): Promise<void> {
    this.markersLayer.clearLayers();
    this.touchPointMarkers.forEach((marker: L.Marker) => {
      this.map.removeLayer(marker); // Removes the marker from the map
    });
    this.touchPointMarkers = [];
  }
  ngOnDestroy() {
    this.map.remove();
    this.clearMarkers()
  }
}
