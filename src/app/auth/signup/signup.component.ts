import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { EditUserComponent } from 'src/app/users/edit-user/edit-user.component';


const THIRTY_ALPHABETS_PATTERN = "[a-zA-Z]{1,30}";
const THIRTY_ALPHABETS_DOT_PATTERN = "[a-zA-Z.]{1,30}";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{

  // @ViewChild('f') signupForm: NgForm;


  username:string = "";
  password:string = "";
  signupForm: FormGroup;


  constructor(private userService:UserService,
    public dialogRef: MatDialogRef<EditUserComponent>,
    private toastr:ToastrService,
    private fb: FormBuilder
    ) {
    
      // this.signupForm = new FormGroup({
      //   'firstname': new FormControl('',Validators.required),
      //   'lastname': new FormControl('',Validators.required),
      //   'username': new FormControl('',Validators.required),
      //   'email': new FormControl('',[Validators.required,Validators.email]),
      //   'password': new FormControl('',Validators.required),
      //   'confirm_password': new FormControl('',Validators.required),
      // });

      
      // this.signupForm = new FormGroup({
      this.signupForm = fb.group({
        'userData': new FormGroup({
          'firstname': new FormControl('',[Validators.required,Validators.pattern(THIRTY_ALPHABETS_PATTERN)]),
          'lastname': new FormControl('',[Validators.required,Validators.pattern(THIRTY_ALPHABETS_PATTERN)]),
          'username': new FormControl('',[Validators.required,Validators.pattern(THIRTY_ALPHABETS_DOT_PATTERN)]),
          'email': new FormControl('',[Validators.required,Validators.email,this.inputLimiter])
        }),
        'password': new FormControl('',Validators.required),
        'confirm_password': new FormControl('',[Validators.required
          // ,this.passwordConfirmer
        ]),
      }
      // ,this.passwordConfirmer
      ,{validator: this.checkIfMatchingPasswords('password', 'confirm_password')}
      );
  }

  inputLimiter(control: FormControl): {[s: string]: boolean} | null {
    if(control.value.length>60){
      return {'LimitIsOver': true};
    }
    return null;
  } 

  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
          passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({passwordMisMatch: true})
      }
      else {
          return null;
      }
    }
  }
  
  // passwordConfirmer(c: AbstractControl): ValidationErrors|null {
  //   console.log("Password: "+c.get('password')?.value);
  //   console.log("Confirm Password: "+c.get('confirm_password')?.value);
  //   return c.get('password')?.value === c.get('confirm_password')?.value ? null : {'passwordMisMatch': true};
  // }

  ngOnInit(): void {

    this.userService.usersEmitter.subscribe(users =>{
      this.userService.logUsers();
    });


    // this.signupForm.setValue({
    //   userData:{
    //     firstname:'zain',
    //     lastname:'shamshad',
    //     username:'zain.shamshad',
    //     email:'zain.shamshad@gmail.com',
    //   },
    //   password:'',
    //   confirm_password:''
    // })

    // this.signupForm.patchValue({
    //   userData:{
    //     firstname:'zain',
    //     lastname:'shamshad',
    //     username:'zain.shamshad',
    //     email:'zain.shamshad@gmail.com',
    //   }
    // })

    // console.log(this.signupForm);

  }

  
  // onSubmit(){
  //   console.log(this.signupForm);
  // }
  
  // onSubmit(form: NgForm){
  //   console.log(form);
  //   if(form.valid){
  //     form.reset();
  //   }
  // }

  onSubmit(){
    console.log(this.signupForm);
    this.signup();
  }



  signup(){

    console.log(this.signupForm.value);
    const user = 
    new User(
      (this.userService.getAllServiceUsers().length+11+(Math.random()*10*2+Math.random())),
      this.signupForm.value.userData.firstname,
      this.signupForm.get('userData.lastname')?.value,
      this.signupForm.get('userData.username')?.value,
      this.signupForm.get('userData.email')?.value,
      this.signupForm.get('password')?.value,
      'BLOGGER',
      'Junior Developer',
      '',
      false,
      0
    );
    console.log(user);
    debugger
      this.userService.addUser(
        user
      );
      this.toastr.success("user has been registered successfully","ACCOUNT CREATED!");
      // this.userService.logUsers();
      this.dialogRef.close();
  }

  create(){
    
    let userCheck = false, passCheck = false;

    // if(this.username !== undefined) {
    //   if(this.username !== null){
    //     if(this.username.length > 0){
    //       for(let user of this.userService.users){
    //         if(user.getUsername() === this.username){
    //           this.toastr.info("User with username: "+this.username+" already exists.","USERNAME NOT AVAILABLE!");
    //           return;
    //         }
    //       }
    //       userCheck = true;
    //     }
    //   }
    // }

    // if(!userCheck){
    //   this.toastr.error("Please enter valid username first.","USERNAME REQUIRED!");
    //   return;
    // }
    
    // if(this.password !== undefined) {
    //   if(this.password !== null){
    //     if(this.password.length > 0){
    //       passCheck = true;
    //     }
    //   }
    // }

    // // debugger
    // if(userCheck && passCheck) {
    //   this.userService.addUser(
    //     new User(
    //       (this.userService.users.length+1),
    //       this.username,
    //       this.username+"@gmail.com",
    //       this.password,
    //       "",
    //       undefined,
    //       false,
    //       0
    //     )
    //   );
    //   this.toastr.success("user has been registered successfully","ACCOUNT CREATED!");
    //   this.userService.logUsers();
    //   this.dialogRef.close();
    // }

    if(!passCheck) {
      this.toastr.error("Please type valid password","INVALID PASSWORD");
    }
  }
}
