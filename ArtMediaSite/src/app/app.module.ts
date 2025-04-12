import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { WebService } from './web.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';
import { PostsComponent } from './posts.component';
// import { NavComponent } from './nav.component';

const routes = [
  { path: 'login', component: LoginComponent },
  { path: 'posts', component: PostsComponent },
];

@NgModule({
  declarations: [
    AppComponent, LoginComponent, PostsComponent,
  ],
  imports: [
    BrowserModule, HttpClientModule, RouterModule,
    RouterModule.forRoot(routes), ReactiveFormsModule
  ],
  providers: [WebService],
  bootstrap: [AppComponent]
})
export class AppModule { }