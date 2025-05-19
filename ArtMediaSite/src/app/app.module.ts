import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { WebService } from './web.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';
import { PostsComponent } from './posts.component';
import { AddPostComponent } from './addPost.component';
import { EditPostComponent } from './editPost.component';
import { AddCommentComponent } from './addComment.component';
// import { NavComponent } from './nav.component';

const routes = [
  { path: 'login', component: LoginComponent },
  { path: 'posts', component: PostsComponent },
  { path: 'addPost', component: AddPostComponent },
  { path: 'posts/:id/edit', component: EditPostComponent },
  { path: 'posts/:id/addComment', component: AddCommentComponent },
];

@NgModule({
  declarations: [
    AppComponent, LoginComponent, PostsComponent, AddPostComponent, EditPostComponent, AddCommentComponent,
  ],
  imports: [
    BrowserModule, HttpClientModule, RouterModule,
    RouterModule.forRoot(routes), ReactiveFormsModule
  ],
  providers: [WebService],
  bootstrap: [AppComponent]
})
export class AppModule { }