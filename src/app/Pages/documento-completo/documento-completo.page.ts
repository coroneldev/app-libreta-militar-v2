import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonList,
  IonItem,
  IonButtons,
  IonBackButton,
  IonSearchbar,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonFab,
  IonFabButton,
  IonIcon,
  IonButton,
  IonCard,
  IonCardContent
} from '@ionic/angular/standalone';

import { ActivatedRoute, Router } from '@angular/router';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';

import { DocumentService } from '../../services/document.service';  // Importa el servicio real

interface Documento {
  id: number;
  title: string;
  type: string;
  content: string;
  event_datetime?: string;
  created_at: string;
  pdfFile?: string;
  imageFile?: string;
}

@Component({
  selector: 'app-documento-completo',
  templateUrl: './documento-completo.page.html',
  styleUrls: ['./documento-completo.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonLabel,
    IonList,
    IonItem,
    IonButtons,
    IonBackButton,
    IonSearchbar,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonFab,
    IonFabButton,
    IonIcon,
    IonButton,
    IonCard,
    IonCardContent,
    CommonModule,
    FormsModule,
    SafeUrlPipe
  ]
})
export class DocumentoCompletoPage implements OnInit {
  tipo: string = '';
  searchQuery: string = '';
  listData: Documento[] = [];
  filteredListData: Documento[] = [];

  constructor(
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.tipo = params['tipo'] ?? '';
      this.cargarDatos();
    });
  }

  async cargarDatos() {
    try {
      // Obtiene todos los documentos desde el servicio
      const allDocs = await this.documentService.getAllDocuments();
      // Filtra por tipo
      this.listData = allDocs.filter(doc => doc.type === this.tipo);
      this.filteredListData = [...this.listData];
    } catch (error) {
      console.error('Error cargando documentos:', error);
      this.listData = [];
      this.filteredListData = [];
    }
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

  addDocument() {
    this.router.navigate(['/add-document', { tipo: this.tipo, data: '0' }]);
  }

  editDocument(item: Documento) {
    this.router.navigate(['/add-document', { tipo: this.tipo, data: item.id.toString() }]);
  }

  async deleteDocument(id: number) {
    if (confirm('¿Está seguro de eliminar este documento?')) {
      try {
        await this.documentService.deleteDocument(id);
        await this.cargarDatos(); // recarga la lista después de eliminar
      } catch (error) {
        console.error('Error al eliminar documento:', error);
      }
    }
  }

  trackById(index: number, item: Documento): number {
    return item.id;
  }
}
