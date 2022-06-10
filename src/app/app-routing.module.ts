import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostCreateComponent } from './posts/post-create.component';
import { PostListComponent } from './posts/post-list.component';


// array of javascript objects
// these routes are defined on client side and the server is not aware of all these routes
const routes: Routes = [
  //root page
  { path: '', component: PostListComponent },
  { path: 'create', component: PostCreateComponent },
  { path: 'edit/:postId', component: PostCreateComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
