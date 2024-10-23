import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule, AbstractControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { QuillModule } from 'ngx-quill';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CoreService } from '../../../../core/core.service';
import { ContentsService } from '../../../../services/contents.service';
import { ApiService } from '../../../../services/api.service';
import { TeamService } from '../../../../services/team.service';
import { environment } from '../../../../environments/environment';
import { PageService } from '../../../../services/page.service';
import { MatTabsModule } from '@angular/material/tabs';
import { ClubDetailsComponent } from "../club-details/club-details.component";

@Component({
  selector: 'app-club-form',
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
    RouterLink,
    MatTabsModule,
    ClubDetailsComponent,
],
  templateUrl: './club-form.component.html',
  styleUrl: './club-form.component.sass'
})
export class ClubFormComponent {
  selectedImage: File | null = null;
  imagePath: string | null = null;
  teamData: any[] | null = null;
  contentForm: FormGroup;
  pageId: number | null = null;
  showTeamSelect = false;
  quillEditorRef: any;

  constructor(
    private _fb: FormBuilder,
    private route: ActivatedRoute,
    private _contService: ContentsService,
    private pageService: PageService,
    private _configService: ApiService,
    private _coreService: CoreService,
    private _router: Router,
    private teamService: TeamService,
    private cdr: ChangeDetectorRef,
  ) {
    this.contentForm = this._fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      slug: ['', [Validators.required, Validators.minLength(3)]],
      content: '',
      meta_title: '',
      meta_description: '',
      status: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    this.contentForm.get('name')?.valueChanges.subscribe(value => {
      const slug = value?.toLowerCase().replace(/ /g, '-');
      this.contentForm.get('slug')?.setValue(slug, { emitEvent: false });
    });

    this.route.params.subscribe(params => {
      this.pageId = +params['id'];
      if (this.pageId) {
        this.loadContent(this.pageId);
      }
    });
  }

  loadContent(contentId: number) {
    this.pageService.getPageById(contentId).subscribe({
      next: (res: any) => {
        this.contentForm.patchValue(res);
      },
      error: (err: any) => {
        console.error(err);
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


  onSubmit() {
    const editorContent = this.quillEditorRef.root.innerHTML;
    this.contentForm.patchValue({ content: editorContent });
    if (this.contentForm.valid) {
      this.contentForm.markAllAsTouched();
      if (this.pageId) {
        this.pageService.updatePage(this.pageId, this.contentForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Page updated successfully')
            this._router.navigate(['/admin/pages']);
          },
          error: (err: any) => {
            console.error(err);
          }
        })
      } else {
        this.contentForm.markAllAsTouched();
        this.pageService.addPage(this.contentForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Page added successfully')
            this._router.navigate(['/admin/pages']);
          },
          error: (err: any) => {
            console.error(err);
          }
        })
      }
    }
  }
}
