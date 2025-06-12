import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonCardHeader,
  IonCard,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonLabel,
  IonItem,
  IonInput,
  IonButton,
  NavController, ToastController, IonFabButton, IonFab, IonIcon, IonFabList
} from '@ionic/angular/standalone';
import { SesionService } from "../services/sesion.service";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NativeBiometric } from 'capacitor-native-biometric';
import { addIcons } from "ionicons";
import {
  archiveOutline, archiveSharp, bookmarkOutline, bookmarkSharp,
  heartOutline,
  heartSharp, logoTableau,
  mailOutline,
  mailSharp,
  paperPlaneOutline,
  paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp
} from "ionicons/icons";

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
  imports: [IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonCardHeader,
    IonCard, IonCardSubtitle, IonCardTitle, IonCardContent, IonLabel, IonItem, IonInput,
    IonButton, ReactiveFormsModule, IonFabButton, IonFab, IonIcon, IonFabList],
  standalone: true
})
export class FolderPage implements OnInit {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  Login: FormGroup;
  public statusIntegrate: boolean;

  constructor(private navCtrl: NavController, private sesion: SesionService, private fb: FormBuilder, private toastController: ToastController) {
    this.statusIntegrate = false;
    this.Login = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

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
      logoTableau
    });
  }

  async ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
    let user = await this.sesion.getAllDocuments();
    if (user.length > 0) {
      this.statusIntegrate = true;
      this.checkBiometricAvailability();
    }
  }

  public register() {
    this.navCtrl.navigateForward(`/register`);
  }

  public async checkBiometricAvailability() {
    try {
      const result = await NativeBiometric.isAvailable();
      console.log('Biometría disponible:', result);
      this.authenticateWithBiometrics();
    } catch (error) {
      console.error('Error al verificar biometría:', error);
    }
  }

  async authenticateWithBiometrics() {
    try {
      await NativeBiometric.verifyIdentity({
        reason: 'Autenticación requerida',
        title: 'Iniciar sesión',
        subtitle: 'Libreta Militar',
        description: 'Confirma tu identidad para continuar',
      });
      this.navCtrl.navigateRoot(`/home`);
    } catch (error) {
      console.error('Error en autenticación:', error);
    }
  }

  public async login() {
    const { username, password } = this.Login.value;
    const success = await this.sesion.getAllDocuments();
    const encodedPassword = atob(success[0].password);
    let successresp: boolean = Boolean(encodedPassword == password && success[0].email == username)
    if (successresp) {
      this.navCtrl.navigateRoot(`/home`);
      const toast = await this.toastController.create({
        message: 'Bienvenid@',
        duration: 1500,
        position: 'bottom',
      });
      await toast.present();
    } else {
      const toast = await this.toastController.create({
        message: 'Credenciales invalidas',
        duration: 1500,
        position: 'bottom',
      });
      await toast.present();
    }
  }
}

