import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  private storageKey = 'User';

  constructor() {
  }

  getAllDocuments(): Promise<any[]> {
    return new Promise((resolve) => {
      const documents = localStorage.getItem(this.storageKey);
      resolve(documents ? JSON.parse(documents) : []);
    });
  }

  addDocument(document: any): Promise<void> {
    return new Promise((resolve) => {
      this.getAllDocuments().then((documents) => {
        document.id = documents.length ? Math.max(...documents.map(doc => doc.id)) + 1 : 1;
        document.created_at = new Date().toISOString();
        document.updated_at = new Date().toISOString();
        documents.push(document);
        localStorage.setItem(this.storageKey, JSON.stringify(documents));
        resolve();
      });
    });
  }

  deleteDocument(id: number): Promise<void> {
    return new Promise((resolve) => {
      this.getAllDocuments().then((documents) => {
        const updatedDocuments = documents.filter(doc => doc.id !== id);
        localStorage.setItem(this.storageKey, JSON.stringify(updatedDocuments));
        resolve();
      });
    });
  }

  updateDocument(updatedDocument: any): Promise<void> {
    return new Promise((resolve) => {
      this.getAllDocuments().then((documents) => {
        const index = documents.findIndex(doc => doc.id === updatedDocument.id);
        if (index !== -1) {
          documents[index] = {...documents[index], ...updatedDocument, updated_at: new Date().toISOString()};
          localStorage.setItem(this.storageKey, JSON.stringify(documents));
          resolve();
        } else {
          resolve();
        }
      });
    });
  }

  getDocumentById(id: number): Promise<any> {
    return new Promise((resolve) => {
      this.getAllDocuments().then((documents) => {
        const document = documents.find(doc => doc.id === id);
        resolve(document);
      });
    });
  }

  filterDocumentsByType(type: string): Promise<any[]> {
    return new Promise((resolve) => {
      this.getAllDocuments().then((documents) => {
        const filteredDocuments = documents.filter(doc => doc.type === type);
        resolve(filteredDocuments);
      });
    });
  }

}
