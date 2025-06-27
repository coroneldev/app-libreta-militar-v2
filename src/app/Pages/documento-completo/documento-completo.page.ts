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
  IonButton
} from '@ionic/angular/standalone';

import { ActivatedRoute } from '@angular/router';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';

interface Documento {
  id: number;
  title: string;
  type: string;
  content: string;
  event_datetime?: string;
  created_at: string;
  pdfFile?: string; // si usas pdf
  imageFile?: string; // si usas imagen
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

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.tipo = this.route.snapshot.paramMap.get('tipo') ?? '';
    this.cargarDatos();
  }

  cargarDatos() {
    this.listData = [
      { id: 1, title: 'Apunte de clase', type: 'APUNTE', content: 'Contenido del apunte...', created_at: new Date().toISOString() },
      { id: 2, title: 'Agenda semanal', type: 'AGENDAS', content: 'Reunión de equipo...', event_datetime: new Date().toISOString(), created_at: new Date().toISOString() },
      { id: 3, title: 'Manual de usuario', type: 'MANUALES', content: 'Contenido del manual...', created_at: new Date().toISOString() }
    ];

    // Filtramos solo los documentos que coincidan con el tipo de la ruta
    this.filteredListData = this.listData.filter(doc => doc.type === this.tipo);
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
    alert('Agregar nuevo documento (implementa la lógica real aquí)');
  }

  editDocument(item: Documento) {
    alert(`Editar documento ${item.id} (implementa la lógica real aquí)`);
  }

  deleteDocument(id: number) {
    if (confirm('¿Está seguro de eliminar este documento?')) {
      this.listData = this.listData.filter(item => item.id !== id);
      this.filteredListData = this.filteredListData.filter(item => item.id !== id);
    }
  }

  trackById(index: number, item: Documento): number {
    return item.id;
  }
}