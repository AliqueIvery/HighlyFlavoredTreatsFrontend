import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-delivery-area',
  templateUrl: './delivery-area.component.html',
  styleUrls: ['./delivery-area.component.css']
})
export class DeliveryAreaComponent implements OnInit {
  deliveryRadius = 50; // miles
  deliveryCities = [
    'Albany, GA',
    'Leesburg, GA',
    'Sylvester, GA',
    'Americus, GA',
    'Camilla, GA'
  ];

  ngOnInit(): void {}
}
