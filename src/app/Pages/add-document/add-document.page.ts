import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonContent,
  IonDatetime, IonDatetimeButton, IonHeader, IonInput, IonItem, IonLabel,
  IonModal, IonTextarea, IonTitle, IonToolbar, NavController, ToastController
} from '@ionic/angular/standalone';

import { DocumentService } from '../../services/document.service';
import { ActivatedRoute, Params } from '@angular/router';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.page.html',
  styleUrls: ['./add-document.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonButtons, IonBackButton, IonCard, IonCardContent,
    IonItem, IonLabel, IonInput, IonTextarea, IonButton,
    IonDatetimeButton, IonModal, IonDatetime,
    SafeUrlPipe
  ]
})
export class AddDocumentPage implements OnInit, OnDestroy {
  public documentForm!: FormGroup;
  public tipo = '';
  public data: any;

  filePreview: string | null = null;
  fileUri: string | null = null;
  imageFilePath: string | null = null;
  pdfFilePath: string | null = null;

  private routeSub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private documentService: DocumentService,
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    // Nos suscribimos a params para reactualizar si cambian
    this.routeSub = this.activatedRoute.params.subscribe(async (params: Params) => {
      this.tipo = params['id'];
      this.data = params['data'];
      if (this.data !== '0') {
        await this.loadDocumentData();
      } else {
        this.initForm();
      }
    });
  }

  ngOnDestroy() {
    // Evitar fugas de memoria
    this.routeSub?.unsubscribe();
  }

  private initForm(data: any = null) {
    this.documentForm = this.fb.group({
      title: [data?.title || '', Validators.required],
      type: [this.tipo, Validators.required],
      content: [data?.content || '', Validators.required],
      event_datetime: [data?.event_datetime || ''],
      imageFile: [data?.imageFile || ''],
      pdfFile: [data?.pdfFile || '']
    });

    this.filePreview = data?.imageFile?.startsWith('data:image') ? data.imageFile : null;
    this.imageFilePath = data?.imageFile || null;
    this.pdfFilePath = data?.pdfFile || null;
    this.fileUri = null;
  }

  private async loadDocumentData() {
    try {
      const data = await this.documentService.getDocumentById(Number(this.data));
      if (data) {
        this.initForm(data);
      } else {
        console.warn('No se encontraron datos para el ID:', this.data);
        this.initForm(); // inicializamos vacío para evitar null refs
      }
    } catch (error) {
      console.error('Error al cargar el documento:', error);
      this.initForm(); // inicializamos vacío para evitar errores
    }
  }

  public async saveDocument() {
    if (!this.documentForm.valid) return;

    this.documentForm.patchValue({
      imageFile: this.imageFilePath,
      pdfFile: this.pdfFilePath
    });

    try {
      const payload = this.documentForm.value;
      if (this.data === '0') {
        await this.documentService.addDocument(payload);
      } else {
        await this.documentService.updateDocument({ ...payload, id: Number(this.data) });
      }

      await this.presentToast(`Documento ${this.data === '0' ? 'registrado' : 'actualizado'} correctamente`);

      if (this.tipo === 'AGENDAS') {
        await this.scheduleNotification();
      }

      this.navCtrl.back();
    } catch (error) {
      console.error('Error al guardar el documento:', error);
      await this.presentToast('Ocurrió un error al guardar el documento.');
    }
  }

  private async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom'
    });
    await toast.present();
  }

  private async checkPermissions() {
    const permission = await LocalNotifications.requestPermissions();
    if (permission.display !== 'granted') {
      throw new Error('Permiso para notificaciones denegado');
    }
  }

  private async scheduleNotification() {
    const title = this.documentForm.get('title')?.value;
    const body = this.documentForm.get('content')?.value;
    const datetime = this.documentForm.get('event_datetime')?.value;

    if (!datetime) return;

    const scheduleDate = new Date(datetime);
    if (scheduleDate <= new Date()) {
      console.warn('La fecha de la notificación debe ser en el futuro');
      return;
    }

    try {
      await this.checkPermissions();

      await LocalNotifications.schedule({
        notifications: [{
          id: Date.now(),
          title,
          body,
          schedule: { at: scheduleDate },
          actionTypeId: '',
          extra: {}
        }]
      });
    } catch (error) {
      console.error('Error al programar notificación:', error);
    }
  }

  imagePreview: string | null = null;
  pdfUri: string | null = null;

  async onFileSelected(event: any, type: 'image' | 'pdf') {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const base64 = await this.readFileAsBase64(file);

      if (type === 'image') {
        this.imagePreview = base64;
        this.imageFilePath = base64;  // Opcional, para mantenerlo en el form
      } else if (type === 'pdf') {
        this.pdfUri = base64;
        this.pdfFilePath = base64; // Igual, si quieres guardar la ruta base64 en el form
      }
    } catch (error) {
      console.error('Error leyendo archivo:', error);
    }
  }

  private readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }



}
