import { Injectable } from '@angular/core';

// Decorador que define este servicio como inyectable y disponible en toda la app
@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  // Clave usada para guardar y recuperar documentos del localStorage
  private storageKey = 'documentx';

  constructor() {
    // Constructor vacío, no necesitas inicializar nada aquí por ahora
  }

  // Obtiene todos los documentos guardados en localStorage
  getAllDocuments(): Promise<any[]> {
    return new Promise((resolve) => {
      // Lee los documentos en formato JSON desde localStorage
      const documents = localStorage.getItem(this.storageKey);
      // Devuelve el arreglo de documentos o un arreglo vacío si no existe
      resolve(documents ? JSON.parse(documents) : []);
    });
  }

  // Agrega un documento nuevo a la lista y lo guarda en localStorage
  addDocument(document: any, base64File?: string): Promise<void> {
    return new Promise((resolve) => {
      // Primero recupera todos los documentos existentes
      this.getAllDocuments().then((documents) => {
        // Genera un nuevo id: si hay documentos, toma el máximo id + 1, si no, inicia en 1
        document.id = documents.length ? Math.max(...documents.map(doc => doc.id)) + 1 : 1;
        // Agrega timestamps de creación y actualización
        document.created_at = new Date().toISOString();
        document.updated_at = new Date().toISOString();
        if (base64File) {
          document.fileData = base64File; // Guardas el archivo en base64 aquí
        }
        // Añade el documento al arreglo
        documents.push(document);
        // Guarda el arreglo actualizado en localStorage
        localStorage.setItem(this.storageKey, JSON.stringify(documents));

        // Imprime en consola los documentos guardados actualizados
        console.log('Documentos guardados actualizados:', documents);
        resolve();
      });
    });
  }

  // Elimina un documento por su id
  deleteDocument(id: number): Promise<void> {
    return new Promise((resolve) => {
      // Recupera todos los documentos
      this.getAllDocuments().then((documents) => {
        // Filtra y elimina el documento cuyo id coincida
        const updatedDocuments = documents.filter(doc => doc.id !== id);
        // Guarda la lista actualizada en localStorage
        localStorage.setItem(this.storageKey, JSON.stringify(updatedDocuments));
        resolve();
      });
    });
  }

  // Actualiza un documento existente con nuevos datos
  updateDocument(updatedDocument: any): Promise<void> {
    return new Promise((resolve) => {
      this.getAllDocuments().then((documents) => {
        // Busca el índice del documento que se quiere actualizar
        const index = documents.findIndex(doc => doc.id === updatedDocument.id);
        if (index !== -1) {
          // Sobrescribe el documento manteniendo lo que no cambia, actualiza fecha
          documents[index] = { ...documents[index], ...updatedDocument, updated_at: new Date().toISOString() };
          // Guarda el arreglo modificado en localStorage
          localStorage.setItem(this.storageKey, JSON.stringify(documents));
          resolve();
        } else {
          // Si no encuentra el documento, simplemente resuelve sin cambios
          resolve();
        }
      });
    });
  }

  // Obtiene un documento específico por id
  getDocumentById(id: number): Promise<any> {
    return new Promise((resolve) => {
      this.getAllDocuments().then((documents) => {
        // Busca el documento que coincida con el id
        const document = documents.find(doc => doc.id === id);
        resolve(document);
      });
    });
  }

  // Filtra documentos por un tipo específico
  filterDocumentsByType(type: string): Promise<any[]> {
    return new Promise((resolve) => {
      this.getAllDocuments().then((documents) => {
        // Filtra solo los documentos cuyo campo 'type' coincida con el tipo dado
        const filteredDocuments = documents.filter(doc => doc.type === type);
        resolve(filteredDocuments);
      });
    });
  }
}
