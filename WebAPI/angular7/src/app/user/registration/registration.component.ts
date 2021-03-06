import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor(public service: UserService, private toastr: ToastrService) { }

  ngOnInit() {
    this.service.formModel.reset();
  }

  OnSubmit() {
    this.service.register().subscribe(
      (res: any) => {
        if(res.succeeded) {
          this.service.formModel.reset();
          this.toastr.success('New user created!', 'Registration successfull');
        } else {
          res.errors.forEach(element => {
            switch (element.code) {
              case 'DuplicateUserName':
                // Username is already taken
                this.toastr.error('Username is already taken', 'Registration failed.');
                break;

              default:
                // registragion faild
                this.toastr.error(element.description, 'Registration failed.');
                break;
            }
          });
        }
      },
      error => {
        console.log(error);
      }
    );
  }

}
