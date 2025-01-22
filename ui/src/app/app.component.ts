import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // For *ngIf
import { FormsModule } from '@angular/forms';   // For ngModel
import { QuillModule } from 'ngx-quill';        // For Quill Editor
import { NgxFileDropModule } from 'ngx-file-drop'; // For file drop
import { QuillEditorComponent } from 'ngx-quill'; // Import QuillEditorComponent
import { HttpClientModule, HttpClient } from '@angular/common/http'; // Import HttpClientModule here
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    QuillModule,
    NgxFileDropModule,
    HttpClientModule,  // Import HttpClientModule here
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  title = 'My Angular App';
  emailLayout: string = '';
  emailData = {
    title: '',
    content: '',
    imageUrls: []
  };

  // Define editorConfig here
  editorConfig = {
    theme: 'snow', // Set theme for Quill editor
    modules: {
      toolbar: [
        [{ 'header': '1' }, { 'header': '2' }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['bold', 'italic', 'underline'],
        [{ 'align': [] }],
        ['link', 'image'],
      ]
    }
  };

  @ViewChild(QuillEditorComponent) editorRef!: QuillEditorComponent;

  constructor(private http: HttpClient) {}  // Inject HttpClient directly in the component

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    if (this.editorRef && this.editorRef.quillEditor) {
      const quill = this.editorRef.quillEditor;
      console.log(quill);
    }
  }

  // Fetch email layout from backend
 /* getEmailLayout(): void {
    this.http.get<any>('http://localhost:5000/getEmailLayout').subscribe(
      (response) => {
        this.emailLayout = response.layout;  // Display fetched layout in the editor
      },
      (error) => {
        console.error('Error fetching email layout:', error);
      }
    );
  }
*/
  // Handle image upload
  imageHandler(): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.click();

    fileInput.onchange = async () => {
      const file = fileInput.files ? fileInput.files[0] : null;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);

      //  this.uploadImage(formData);
      }
    };
  }

  // Direct HTTP image upload without service
  /*uploadImage(formData: FormData): void {
    this.http.post<any>('http://localhost:5000/uploadImage', formData).subscribe(
      (response) => {
        const imageUrl = response.url;  // Get image URL after upload
        const quill = this.editorRef.quillEditor;
        const range = quill.getSelection();
        if (range) {
          quill.insertEmbed(range.index, 'image', imageUrl);
        } else {
          const cursorPosition = quill.getLength();
          quill.insertEmbed(cursorPosition, 'image', imageUrl);
        }
      },
      (error) => {
        console.error('Error uploading image:', error);
      }
    );
  }*/

  // Save the email template data directly via HTTP
  convertImage(imageUrl:any) {
    this.http.get(imageUrl, { responseType: 'blob' }).subscribe(blob => {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.base64Image = reader.result as string;
      };
     reader.readAsDataURL(blob);
    //  console.log(s);
    });
  }
    base64Image: string | null = null;
  saveTemplate(): void {
  
  console.log("working...")
    const templateData = {
      title: this.emailData.title,
      content: this.emailData.content,
      imageUrls: this.base64String
    };
    this.postData(templateData).subscribe(response => {
      //this.responseData = response;
      console.log('Response:', response);
    });
    
  }
  postData(data: any): Observable<any> {
    return this.http.post<any>("/renderAndDownloadTemplate", data);
  }
  // Render and download the final email template directly via HTTP
  renderTemplate(): void {
 /*   this.http.post<any>('http://localhost:5000', this.emailData).subscribe(
      (response) => {
        console.log('Rendered HTML:', response.html);
        // Handle the rendering logic, such as allowing the user to download the final HTML
      },
      (error) => {
        console.error('Error rendering template:', error);
      }
    );*/
  }

  // Define the onFileDrop method
  onFileDrop(event: any): void {
    console.log('Files dropped:', event.files);

    // You can process the files (upload them to your backend or show preview)
    event.files.forEach((file: any) => {
      console.log(file);  // Access file details like name, size, etc.
      // You can add further logic here to handle file uploads or other tasks
    });
  }

  base64String: string | ArrayBuffer | null = '';
 
changeLogo(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = () => {
      this.base64String = reader.result;
    };

    reader.readAsDataURL(file);
  }
}
}
