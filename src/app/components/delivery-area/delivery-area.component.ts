// src/app/components/delivery-area/delivery-area.component.ts
import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-delivery-area',
  templateUrl: './delivery-area.component.html',
  styleUrls: ['./delivery-area.component.css']
})
export class DeliveryAreaComponent implements AfterViewInit {

  // used in template text
  deliveryRadius = 25;

  // if you want to bind cities list too:
  deliveryCities = [
    "Dacula, GA",
    "Auburn, GA",
    "Buford, GA",
    "Suwanee, GA",
    "Duluth, GA",
    "Norcross, GA",
    "Lilburn, GA",
    "Snellville, GA",
    "Grayson, GA"
  ];


  private map!: L.Map;

  // Atlanta center point
  private readonly ATLANTA_COORDS: L.LatLngExpression = [33.7490, -84.3880];

  // convert miles → meters
  private get radiusMeters(): number {
    return this.deliveryRadius * 1609.34;
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('deliveryMap', {
      center: this.ATLANTA_COORDS,
      zoom: 9,           // adjust if you want tighter/wider view
      zoomControl: true
    });

    // OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // 50-mile radius circle
    L.circle(this.ATLANTA_COORDS, {
      radius: this.radiusMeters,
      color: '#ff1493',
      weight: 2,
      fillColor: '#ff1493',
      fillOpacity: 0.15
    }).addTo(this.map);

    // Optional: center marker
    // L.marker(this.ATLANTA_COORDS).addTo(this.map).bindPopup('Atlanta, GA');
  }
}
