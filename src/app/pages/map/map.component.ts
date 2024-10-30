import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { pick } from 'apollo-angular/http/http-batch-link';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
@Component({
  standalone: true,
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  imports: [ToastModule, LeafletModule],
  providers: [MessageService]
})
export class MapComponent implements OnChanges {
  @Input() dataForMarker: any;
  @Input() thirdStepDataForMarker: any;
  @Input() pickupLocation: any;
  @Input() zoneName: any;
  @Input() isMissed: any;
  @Output() showSpinner: EventEmitter<any> = new EventEmitter();
  @Input() startFromHub: any;
  @Input() endAtHub: any;
  map!: L.Map;
  layerMainGroup!: L.LayerGroup[];

  private markersLayer = L.layerGroup();
  private touchPointMarkers: L.Marker[] = [];
  private markerBounds!: L.LatLngBounds
  private previousRouteLayer: L.GeoJSON | null = null;


  options = {
    zoom: 5,
    center: L.latLng(28.7040795, 77.1591007),
    maxZoom: 20,
  };

  private readonly markerIconConfig = {
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    shadowUrl: 'assets/images/marker-shadow.png',
  };

  constructor(private http: HttpClient, private messageService: MessageService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map) {
      if (changes['dataForMarker']?.currentValue) {
        this.plotMarkers(changes['dataForMarker'].currentValue, this.pickupLocation);
      }
      if (changes['thirdStepDataForMarker']?.currentValue) {
        this.plotMarkerForThirdStep(changes['thirdStepDataForMarker'].currentValue);
      }
    }
  }


  async initializeMap(map: L.Map) {

    this.map = map;
    if (this.map) {
      setInterval(() => {
        this.map.invalidateSize({ debounceMoveend: true });

      }, 500);

    }
    L.tileLayer(`https://mt{s}.googleapis.com/vt?x={x}&y={y}&z={z}&key=${environment.googleMapKey}`, {
      subdomains: ['0', '1', '2', '3'],
      maxZoom: this.options.maxZoom,
      attribution: '&copy; <a href="https://www.google.com/intl/en_us/help/terms_maps.html">Google Maps</a>',
    }).addTo(this.map);

    this.markersLayer.addTo(this.map);
    await this.handleInitialData();

  }


  private async handleInitialData(): Promise<void> {

    this.showSpinner.emit(true)
    setTimeout(async () => {
      if (this.dataForMarker) {
        await this.plotMarkers(this.dataForMarker, this.pickupLocation);
      } else if (this.thirdStepDataForMarker) {
        await this.plotMarkerForThirdStep(this.thirdStepDataForMarker);
      }
      this.showSpinner.emit(false)
    }, 1000);

  }

  private async plotMarkers(data: any[], hubLocation: any[]): Promise<void> {
    this.clearMarkers();

    const markers = data
      .filter(row => (row.latitude || (row.geom && row.geom.latitude)) && (row.longitude || (row.geom && row.geom.longitude)))
      .map(row => {
        const latitude = row.latitude || row.geom.latitude;
        const longitude = row.longitude || row.geom.longitude;

        const marker = this.createMarker(latitude, longitude, row.shipment_id, 'assets/images/map-marker.png', [15, 31]);
        this.markersLayer.addLayer(marker);
        return marker.getLatLng();
      });

    if (hubLocation?.length > 0) {
      const hubMarker = this.createMarker(hubLocation[1], hubLocation[0], this.zoneName ? this.zoneName : 'Hub', 'assets/images/merchant.png', [30, 30]);
      this.markersLayer.addLayer(hubMarker);
      markers.push(hubMarker.getLatLng());
    }


    if (markers.length > 0) {
      this.map.fitBounds(L.latLngBounds(markers));
    }
  }



  private async plotMarkerForThirdStep(data: any[]): Promise<void> {
    await this.clearMarkers();
    if (!this.isMissed) {
      this.touchPointMarkers.push(this.createMarker(this.pickupLocation[1], this.pickupLocation[0], this.zoneName ? this.zoneName : 'Hub', 'assets/images/merchant.png', [30, 30]));

      const coordinates = await this.buildCoordinates(data);

      // Fetch and plot the route
      if (coordinates.length > 1) {
        const route = await this.fetchRoute(coordinates);
        this.plotRoute(route);
      } else {
        if (this.previousRouteLayer) {
          this.map.removeLayer(this.previousRouteLayer);
        }
      }
    }



    data.forEach((point, index) => this.createSpecialMarker(point, index + 1));
  }

  private async buildCoordinates(data: any): Promise<any> {
    let coordinates;
    if (this.startFromHub && this.endAtHub) {
      coordinates = [
        [this.pickupLocation[0], this.pickupLocation[1]],
        ...data.map((point: any) => [point.touch_point.geom.longitude, point.touch_point.geom.latitude]), // Touch points
        [this.pickupLocation[0], this.pickupLocation[1]]
      ];
    } else if (this.startFromHub) {
      coordinates = [
        [this.pickupLocation[0], this.pickupLocation[1]],
        ...data.map((point: any) => [point.touch_point.geom.longitude, point.touch_point.geom.latitude]), // Touch points
      ]
    } else if (this.endAtHub) {
      coordinates = [
        ...data.map((point: any) => [point.touch_point.geom.longitude, point.touch_point.geom.latitude]), // Touch points
        [this.pickupLocation[0], this.pickupLocation[1]],

      ]
    } else {
      coordinates = [
        ...data.map((point: any) => [point.touch_point.geom.longitude, point.touch_point.geom.latitude]), // Touch points
      ]
    }
    return coordinates;
  }

  private createSpecialMarker(point: any, index: number): void {
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
    ).bindTooltip(
      `${point.customer_name || point?.touch_point?.customer_name} (#${point?.touch_point?.id || ''})`,
      { direction: 'top' }
    );




    this.touchPointMarkers.push(marker);
    marker.addTo(this.map);

    if (isMissed) {
      const latlng: [number, number] = [
        point.touch_point.geom.latitude,
        point.touch_point.geom.longitude
      ];

      this.markerBounds = this.markerBounds || new L.LatLngBounds(latlng, latlng);
      this.markerBounds.extend(latlng);
      this.fitMapToMarkers();
    }
  }

  public fitMapToMarkers(): void {
    if (this.markerBounds?.isValid()) {
      this.map.fitBounds(this.markerBounds, { padding: [20, 20] });
    }
  }

  private async fetchRoute(coordinates: number[][]): Promise<any> {
    try {
      const response = await this.http.post(
        'https://test-bolt.roadcast.net/api/v1/auth/calculate_eta_route', {
        coordinates,
        radiuses: [-1]
      }).toPromise();
      return response;
    } catch (error) {
      this.showSpinner.emit(false)
      this.messageService.add({ severity: 'error', summary: 'Failed To Fetch  Route', icon: 'pi pi-cross' });

      console.error('Error fetching route:', error);
      return null;
    }
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

  async clearMarkers(): Promise<void> {
    this.markersLayer.clearLayers();
    this.touchPointMarkers.forEach((marker: L.Marker) => {
      this.map.removeLayer(marker); // Removes the marker from the map
    });
    this.touchPointMarkers = [];
  }
  ngOnDestroy() {
    if (this.map) {

    }
    this.clearMarkers()
  }
}
