import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DummyDataService, User } from '../../../../core/services/dummy-data/dummy-data.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  user: User | undefined;
  

  constructor(
    private route: ActivatedRoute,
    private dummyDataService: DummyDataService
  ) {}

  ngOnInit(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    this.user = this.dummyDataService.getUsers().find(user => user.id === userId);
  }
}
