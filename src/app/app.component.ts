import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {
  IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote,
  IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink,
  NavController, IonCardContent, IonCardTitle, IonCard, IonCardHeader
} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {
  mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline,
  heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp,
  warningOutline, warningSharp, bookmarkOutline, bookmarkSharp, personOutline, logOutOutline, homeOutline
} from 'ionicons/icons';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [RouterLink, RouterLinkActive, IonApp, IonSplitPane, IonMenu, IonContent, IonList,
    IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink,
    IonRouterOutlet, IonCardContent, IonCardTitle, IonCard, IonCardHeader],
  standalone: true
})
export class AppComponent {
  public colorMenu = '#003366';
  public showPerfil = false;

  constructor(private navCtrl: NavController) {
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
      personOutline,
      logOutOutline,
      homeOutline,
    });
  }

  public home() {
    this.navCtrl.navigateRoot(`/home`, {animated: true});
  }

  public salir() {
    App.exitApp();
  }

  public togglePerfil() {
    this.showPerfil = !this.showPerfil;
  }
}