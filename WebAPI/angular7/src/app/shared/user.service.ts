import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly BaseURL = 'http://localhost:56475/api';

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  formModel = this.fb.group({
    UserName: ['', Validators.required],
    Email: ['', Validators.email],
    FullName: [''],
    Passwords: this.fb.group({
      Password: ['', [Validators.required, Validators.minLength(4)]],
      ConfirmPassword: ['', Validators.required]
    }, { validators: this.comparePasswords })
  });

  comparePasswords(fb: FormGroup) {
    let confirmPswrdCtl = fb.get('ConfirmPassword');
    // passwordMismatch
    // ConfirmPswrdCtrl.errors = (passwordMismatch:true)
    if (confirmPswrdCtl.errors == null || 'passwordMismatch' in confirmPswrdCtl.errors) {
      if (fb.get('Password').value !== confirmPswrdCtl.value) {
        confirmPswrdCtl.setErrors({ passwordMismatch: true });
      } else {
        confirmPswrdCtl.setErrors(null);
      }
    }
  }

  register() {
    const body = {
      UserName: this.formModel.value.UserName,
      Email: this.formModel.value.Email,
      FullName: this.formModel.value.FullName,
      Password: this.formModel.value.Passwords.Password
    };
    const result = this.http.post(this.BaseURL + '/ApplicationUser/Register', body);
    return result;
  }

  login(formData) {

    return this.http.post(this.BaseURL + '/ApplicationUser/Login', formData);
  }

  getUserProfile() {

    return this.http.get(this.BaseURL + '/UserProfile');
  }

  roleMatch(allowedRoles): boolean {
    let isMatch = false;
    const payload = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    const userRole = payload.role;

    allowedRoles.forEach(element => {
      if (userRole === element) {
        isMatch = true;
      }
      return false;
    });

    return isMatch;
  }

}
