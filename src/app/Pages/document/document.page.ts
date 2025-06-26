import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ActionSheetController,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  NavController
} from '@ionic/angular/standalone';
import { addIcons } from "ionicons";
import {
  addSharp,
  createOutline,
  trashOutline,
  trashSharp,
} from "ionicons/icons";
import { DocumentService } from "../../services/document.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-documento-completo',
  templateUrl: './documento-completo.page.html',
  styleUrls: ['./documento-completo.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    CommonModule, FormsModule,
    IonButtons, IonBackButton, IonButton,
    IonList, IonItem, IonLabel,
    IonFab, IonFabButton, IonIcon,
    IonItemSliding, IonItemOptions, IonItemOption,
    IonSearchbar
  ]
})
export class DocumentoCompletoPage implements OnInit {
  public listData: any[] = [];
  public filteredListData: any[] = [];
  public tipo: string = "";
  public searchQuery: string = '';

  constructor(
    private navCtrl: NavController,
    private documentService: DocumentService,
    private activatedRoute: ActivatedRoute,
    private actionSheetCtrl: ActionSheetController
  ) {
    addIcons({
      trashOutline,
      trashSharp,
      addSharp,
      createOutline
    });
  }

  ngOnInit() {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') as string;
    console.log('ngOnInit - tipo:', this.tipo);
    this.listar();
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter - tipo:', this.tipo);
    this.listar();
  }

  public editDocument(item: any) {
    this.navCtrl.navigateForward(`/add-document/${this.tipo}/${item.id}`, { animated: true });
  }

  public async deleteDocument(id: number): Promise<void> {
    const actionSheet = await this.actionSheetCtrl.create({
      header: '¿Está seguro de eliminar este documento?',
      mode: 'ios',
      buttons: [
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.documentService.deleteDocument(id);
            this.listar();
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          },
        },
      ],
    });
    await actionSheet.present();
  }

  public async listar() {
    // Usamos filtro insensible a mayúsculas/minúsculas en el servicio
    this.listData = await this.documentService.filterDocumentsByType(this.tipo);
    console.log('listar() - tipo:', this.tipo);
    console.log('listar() - documentos recuperados:', this.listData);
    this.listData.sort((a, b) => b.id - a.id);
    this.filteredListData = [...this.listData];
    console.log('listar() - documentos filtrados:', this.filteredListData);
  }

  public addDocument() {
    this.navCtrl.navigateForward(`/add-document/${this.tipo}/0`, { animated: true });
  }

  filterDocuments(event: any) {
    const query = event.target.value?.toLowerCase() || '';
    if (!query) {
      this.filteredListData = [...this.listData];
      return;
    }
    this.filteredListData = this.listData.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.content.toLowerCase().includes(query)
    );
  }

  trackById(index: number, item: any): number {
    return item.id;
  }
}