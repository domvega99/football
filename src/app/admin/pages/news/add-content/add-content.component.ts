import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { CoreService } from '../../../../core/core.service';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../../services/api.service';
import { ContentsService } from '../../../../services/contents.service';
import { ClubService } from '../../clubs/clubs.service';

@Component({
  selector: 'app-add-content',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule, 
    CommonModule, 
    MatSelectModule,
    QuillModule,
    FormsModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './add-content.component.html',
  styleUrl: './add-content.component.sass'
})
export class AddContentComponent {
  selectedImage: File | null = null;
  imagePath: string | null = null;
  clubData: any[] | null = null;
  contentForm: FormGroup;
  contentId: number | null = null;
  showTeamSelect = false;
  quillEditorRef: any;

  constructor(
    private _fb: FormBuilder,
    private route: ActivatedRoute,
    private _contService: ContentsService,
    private _configService: ApiService,
    private _coreService: CoreService,
    private _router: Router,
    private clubService: ClubService,
    private cdr: ChangeDetectorRef,
  ) {
    this.contentForm = this._fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      content: '',
      team_id: [0, this.teamIdValidator()],
      status: ['', [Validators.required, Validators.minLength(3)]],
      block: ['', [Validators.required, Validators.minLength(3)]],
      file_name: '',
    });
  }

  ngOnInit(): void {
    this.getTeams()
    this.route.params.subscribe(params => {
      this.contentId = +params['id'];
      if (this.contentId) {
        this.loadContent(this.contentId);
      }
    });
  }

  getEditorInstance(editorInstance: any) {
    this.quillEditorRef = editorInstance;
    const toolbar = this.quillEditorRef.getModule('toolbar');
    toolbar.addHandler('image', this.uploadImageHandler);
  }

  uploadImageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const files = input.files;
      if (files && files.length > 0) {
        Array.from(files).forEach(file => {
          const range = this.quillEditorRef.getSelection();
          const randomFileName = this.generateRandomString(10) + this.getFileExtension(file.name);
          this._contService.uploadFile(file, randomFileName).subscribe({
            next: (res) => {
              if (res?.imagePath) {
                this.quillEditorRef.insertEmbed(range.index, 'image', environment.apiUrl + res?.imagePath);
              }
            },
            error: (err) => {
              console.error('Upload failed:', err);
            }
          });
        });
      }
    };
  }

  getTeams() {
    this.clubService.getClubs().subscribe({
      next: (res) => {
        this.clubData = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  onBlockChange(block: string) {
    this.showTeamSelect = block === 'Club';
    if (!this.showTeamSelect) {
      this.contentForm.get('team_id')?.setValue(0);
    }
  }

  teamIdValidator() {
    return (control: AbstractControl) => {
      if (this.showTeamSelect && !control.value) {
        return { required: true };
      }
      return null;
    };
  }

  loadContent(contentId: number) {
    this._contService.getContentById(contentId).subscribe({
      next: (res: any) => {
        this.contentForm.patchValue(res);
        if (res.file_name) {
          this.imagePath = `${this._configService.URL_CONTENT_IMAGE}${res.file_name}`;
        }
        this.showTeamSelect = res.block === 'Club';
        this.contentForm.get('team_id')?.updateValueAndValidity();
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const randomFileName = this.generateRandomString(10) + this.getFileExtension(file.name);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePath = e.target.result;
        this.contentForm.patchValue({
          file_name: randomFileName
        });
        this.cdr.markForCheck(); 
      };
      reader.readAsDataURL(file);
    }
  }

  getFileExtension(fileName: string): string {
    return fileName.substring(fileName.lastIndexOf('.'));
  }

  onUpload() {
    if (this.selectedImage) {
      const fileName = this.contentForm.get('file_name')?.value;
      this._contService.uploadImage(this.selectedImage, fileName).subscribe({
        next: (res) => {
          this.imagePath = `${this._configService.URL_IMAGE}${res.imagePath}`;
          this.contentForm.patchValue({
            file_name: res.imagePath 
          });
        },
        error: (err) => {
          console.error(err);
        }
      })
    }
  }

  onSubmit() {
    const editorContent = this.quillEditorRef.root.innerHTML;
    this.contentForm.patchValue({ content: editorContent });
    if (this.contentForm.valid) {
      this.contentForm.markAllAsTouched();
      if (this.contentId) {
        this._contService.updateContent(this.contentId, this.contentForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Content updated successfully')
            this.onUpload(); 
            this._router.navigate(['/admin/contents']);
          },
          error: (err: any) => {
            console.error(err);
          }
        })
      } else {
        this.contentForm.markAllAsTouched();
        this._contService.addContent(this.contentForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Content added successfully')
            this.onUpload()
            this._router.navigate(['/admin/contents']);
          },
          error: (err: any) => {
            console.error(err);
          }
        })
      }
    }
  }
  


  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
  
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction
  
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
  
      ['clean'],                                         // remove formatting button
  
      ['link', 'image', 'video']                         // link and image, video
    ]
  };
}
