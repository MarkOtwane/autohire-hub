import { Component, OnInit } from '@angular/core';
import { SupportService } from '../../core/services/support.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-tickets',
  templateUrl: './my-tickets.component.html',
  styleUrls: ['./my-tickets.component.scss'],
  imports: [CommonModule],
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
