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

import { DocumentService } from '../../services/document.service';

interface Documento {
  id: number;
  title: string;
  type: string;
  content: string;
  event_datetime?: string;
  created_at: string;
  pdfFile?: string;
  imageFile?: string;
  ownerRole?: string;  // <-- Propiedad agregada para saber quién lo creó
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
  rutaRetorno: string = '/documento-completo';
  searchQuery: string = '';
  listData: Documento[] = [];
  filteredListData: Documento[] = [];

  rolUsuario: string = '';

  constructor(
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private router: Router
  ) { }

  ngOnInit() {
    this.rolUsuario = localStorage.getItem('tipo_usuario') ?? '';
    console.log('Rol del usuario:', this.rolUsuario);

    this.route.params.subscribe(params => {
      this.tipo = params['tipo'] ?? '';
      this.rutaRetorno = `/documento-completo/${this.tipo}`; // para back-button con fallback
      this.cargarDatos();
    });
  }

async cargarDatos() {
  try {
    const allDocs = await this.documentService.getAllDocuments();

    if (this.rolUsuario === 'ESTUDIANTE') {
      // Mostrar solo los documentos tipo MANUALES
     // this.listData = allDocs.filter(doc => doc.type === 'MANUALES');
      this.listData = allDocs.filter(doc => doc.type === this.tipo);
    } else {
      // Para otros roles, mostrar todos los documentos del tipo actual
      this.listData = allDocs.filter(doc => doc.type === this.tipo);
    }

    this.filteredListData = [...this.listData];
    console.log('Documentos cargados (filtrados):', this.listData);
  } catch (error) {
    console.error('Error cargando documentos:', error);
    this.listData = [];
    this.filteredListData = [];
  }
}


  filterDocuments(event: any) {
    const query = event.target.value?.toLowerCase() || '';
    this.filteredListData = query
      ? this.listData.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query)
      )
      : [...this.listData];
  }

  addDocument() {
    if (this.rolUsuario !== 'ESTUDIANTE') {
      this.router.navigate(['/add-document', this.tipo, '0']);
    }
    // No navega ni hace nada si es estudiante
  }

  editDocument(item: Documento) {
    if (this.rolUsuario !== 'ESTUDIANTE') {
      this.router.navigate(['/add-document', { tipo: this.tipo, data: item.id.toString() }]);
    }
  }

  async deleteDocument(id: number) {
    if (this.rolUsuario !== 'ESTUDIANTE') {
      if (confirm('¿Está seguro de eliminar este documento?')) {
        try {
          await this.documentService.deleteDocument(id);
          await this.cargarDatos();
        } catch (error) {
          console.error('Error al eliminar documento:', error);
        }
      }
    }
  }

  trackById(index: number, item: Documento): number {
    return item.id;
  }
}
