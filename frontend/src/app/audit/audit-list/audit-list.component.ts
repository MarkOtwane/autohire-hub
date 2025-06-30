import { Component, OnInit } from '@angular/core';
import { AuditService } from '../../core/services/audit.service';

@Component({
  selector: 'app-audit-list',
  templateUrl: './audit-list.component.html',
  styleUrls: ['./audit-list.component.scss'],
})
export class AuditListComponent implements OnInit {
  logs: any[] = [];
  loading = true;

  constructor(private auditService: AuditService) {}

  ngOnInit(): void {
    this.auditService.getAuditLogs().subscribe((data) => {
      this.logs = data;
      this.loading = false;
    });
  }
}
