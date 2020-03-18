import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService, UserService } from '../_services';
import { User, Tweet } from '../_models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first } from 'rxjs/operators';
import { error } from 'protractor';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: User;
  postForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private router: Router, 
    private authenticationService: AuthenticationService, 
    private snackBar: MatSnackBar,
    private userService: UserService,
    private formBuilder: FormBuilder,) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    // console.log(this.currentUser);
  
    // this.snackBar.open("Welcome " + this.currentUser["_username"], "", {duration: 3000});
  }

  ngOnInit(): void {
    this.postForm = this.formBuilder.group({
      action: ['tweet'],
      tweet: ['']
    })
  }

  onPostTweet(tweet) {
    this.submitted = true;
    // this.alertService.clear();

    if (tweet.length <= 0) {
        return;
    }

    this.loading = true;
    this.postForm.value["tweet"] = tweet.value;
    this.userService.postTweet(this.postForm.value)
        .subscribe((res) => {
          console.dir(res);
          this.snackBar.open("Nice! Tweeted.", "", {duration: 2000})
          tweet.value="";
        }, err => {
          // console.log(err);
          this.snackBar.open("Could not tweet. Try again later.", "", {duration: 2000})
        });
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
  goToProfile(){
    this.router.navigate(['/profile']);
  }
}
