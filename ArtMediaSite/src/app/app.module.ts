import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { WebService } from './web.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NavComponent } from './nav.component';

import { LoginComponent } from './login.component';
import { SignUpComponent } from './signUp.component';
import { UserComponent } from './user.component';
import { EditUserComponent } from './editUser.component';
import { PostsComponent } from './posts.component';
import { PostComponent } from './post.component';
import { AddPostComponent } from './addPost.component';
import { EditPostComponent } from './editPost.component';
import { SearchPostsComponent } from './searchPosts.component';
import { AddCommentComponent } from './addComment.component';
import { EditCommentComponent } from './editComment.component';

const routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: SignUpComponent },
  { path: 'user/:userID', component: UserComponent },
  { path: 'user/:userID/edit', component: EditUserComponent },
  { path: 'posts', component: PostsComponent },
  { path: 'posts/:postID', component: PostComponent },
  { path: 'addPost', component: AddPostComponent },
  { path: 'posts/:postID/edit', component: EditPostComponent },
  { path: 'posts/search/:search', component: SearchPostsComponent },
  { path: 'posts/:postID/addComment', component: AddCommentComponent },
  { path: 'posts/:postID/comments/:commentID/editComment', component: EditCommentComponent },
];

@NgModule({
  declarations: [
    AppComponent, NavComponent, LoginComponent, UserComponent, EditUserComponent, SignUpComponent, PostsComponent, PostComponent, AddPostComponent, EditPostComponent, SearchPostsComponent, AddCommentComponent, EditCommentComponent,
  ],
  imports: [
    BrowserModule, HttpClientModule, RouterModule,
    RouterModule.forRoot(routes), ReactiveFormsModule, NgbModule,
  ],
  providers: [WebService],
  bootstrap: [AppComponent]
})
export class AppModule { }