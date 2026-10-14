import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';

@Component({
  selector: 'app-student-directory',
  templateUrl: './student-directory.page.html',
  styleUrls: ['./student-directory.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class StudentDirectoryPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
