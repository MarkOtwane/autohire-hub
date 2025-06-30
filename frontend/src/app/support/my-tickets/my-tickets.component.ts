import { Component, OnInit } from '@angular/core';
import { SupportService } from '../../core/services/support.service';

@Component({
  selector: 'app-my-tickets',
  templateUrl: './my-tickets.component.html',
  styleUrls: ['./my-tickets.component.scss'],
})
export class MyTicketsComponent implements OnInit {
  tickets: any[] = [];

  constructor(private supportService: SupportService) {}

  ngOnInit(): void {
    this.supportService
      .getMyTickets()
      .subscribe((data) => (this.tickets = data));
  }
}
