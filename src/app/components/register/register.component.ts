import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../user/user.interface';
import { CommonModule } from '@angular/common';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatInputModule, MatFormField, MatButtonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.sass'
})
export class RegisterComponent {

  registerForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      given_name: ['', Validators.required],
      family_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', Validators.required]
    }, {
      validator: this.mustMatch('password', 'confirm_password')
    });
  }

  get f() { return this.registerForm.controls; }

  // src/app/register/register.component.ts
  onSubmit() {
    this.submitted = true;
  
    console.log('Form submitted');  // Add this line
  
    if (this.registerForm.invalid) {
      console.log('Form is invalid');  // Add this line
      return;
    }
  
    const user: User = this.registerForm.value;
    console.log('User data:', user);  // Add this line
  
    this.userService.registerUser(user).subscribe(
      response => {
        console.log('User registered successfully:', response);
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Registration error:', error);

        if (error.status === 400 && error.error.message === 'Email already exists') {
          this.registerForm.controls['email'].setErrors({ emailExists: true });
        }
      }
    );
  }
  


  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

}
