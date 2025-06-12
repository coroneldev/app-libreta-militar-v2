import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
<<<<<<< HEAD

export class DocumentPage implements OnInit {
=======
export class DocumentoCompletoPage implements OnInit {
>>>>>>> f9864ea (Correccionde bugs)
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
    this.listar();
  }

  ionViewWillEnter() {
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
    this.listData = await this.documentService.filterDocumentsByType(this.tipo);
    this.listData.sort((a, b) => b.id - a.id);
    this.filteredListData = [...this.listData];
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
<<<<<<< HEAD

  public selectedFile: string | null = null;

  public viewDocument(filePath: string): void {
    const extension = filePath.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') {
      this.selectedFile = filePath;
    } else {
      this.openFile(filePath);
    }
  }

  public closeViewer(): void {
    this.selectedFile = null;
  }

}
=======
}
>>>>>>> f9864ea (Correccionde bugs)
