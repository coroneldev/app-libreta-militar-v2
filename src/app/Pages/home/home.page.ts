import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonText } from '@ionic/angular/standalone';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonRow,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  ModalController,
  NavController
} from '@ionic/angular/standalone';
import { ActivatedRoute } from "@angular/router";
import {
  addSharp,
  archiveOutline,
  archiveSharp,
  bookmarkOutline,
  bookmarkSharp,
  bookSharp,
  calendarNumberSharp,
  heartOutline,
  heartSharp,
  listSharp,
  mailOutline,
  mailSharp,
  newspaperSharp,
  paperPlaneOutline,
  paperPlaneSharp,
  trashOutline,
  trashSharp,
  warningOutline,
  warningSharp
} from "ionicons/icons";
import { addIcons } from "ionicons";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonItem,
    IonMenuButton,
    IonButtons,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonCard,
    IonList,
    IonText,
    IonCardContent,
    IonLabel,
    IonIcon,
    IonThumbnail,
    IonFab,
    IonFabButton,
    IonFabList
  ]
})
export class HomePage implements OnInit {
  public folder!: string;
  public userRole: string = '';
  public isInstructor: boolean = false;

  private activatedRoute = inject(ActivatedRoute);
  @ViewChild(IonFab) fab!: IonFab;

  constructor(private modalCtrl: ModalController, private navCtrl: NavController) {
    addIcons({
      mailOutline,
      mailSharp,
      paperPlaneOutline,
      paperPlaneSharp,
      heartOutline,
      heartSharp,
      archiveOutline,
      archiveSharp,
      trashOutline,
      trashSharp,
      warningOutline,
      warningSharp,
      bookmarkOutline,
      bookmarkSharp,
      bookSharp,
      calendarNumberSharp,
      listSharp,
      newspaperSharp,
      addSharp
    });
  }

  ngOnInit() {
    const tipoUsuario = localStorage.getItem('tipo_usuario');
    console.log('[localStorage tipo_usuario]:', tipoUsuario);
    this.userRole = tipoUsuario ?? 'ESTUDIANTE';
    console.log('[ROLE DETECTADO]', this.userRole);
    this.isInstructor = this.userRole === 'INSTRUCTOR';
  }

  public Seleccionar(tipo: string) {
    if (tipo === 'MANUALES') {
      if (this.isInstructor) {
        // Imprime cuando el INSTRUCTOR hace click en MANUALES
        console.log('[INSTRUCTOR][EVENTO][MANUALES] Click Capturado');
        // this.navCtrl.navigateForward(`/add-document/${tipo}`, { animated: true });
        //this.navCtrl.navigateForward(`/document-page/MANUALES/0`, { animated: true });
        this.navCtrl.navigateForward(`/add-document/MANUALES/0`, { animated: true });
      } else {
        this.navCtrl.navigateForward(`/documento-completo/${tipo}`, { animated: true });
      }
    } else if (tipo === 'APUNTES' || tipo === 'AGENDAS') {
      this.navCtrl.navigateForward(`/solo-datos/${tipo}`, { animated: true });
    } else {
      console.warn('Tipo no reconocido:', tipo);
    }
  }

  public addDocument(tipo: string) {
    this.navCtrl.navigateForward(`/add-document/${tipo}/0`, { animated: true });
  }

  public perfil() {
    // lógica del perfil si es necesario
  }
}