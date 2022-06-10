import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import {Post} from "./post.model"
import { PostsService } from "./post.service";
import {Subject, Subscription} from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: 'First Post', content: 'First post content'},
  //   {title: 'Second Post', content: 'Second post content'},
  //   {title: 'Third Post', content: 'Third post content'},
  // ];
  posts: Post[] = [];
  isLoading = false;
  private postsSub: Subscription = new Subscription;

  // angular will try to give the PostsService to the constructor
  // public keyword will create an instance called postsService
  constructor(public postsService: PostsService) {}

  // we can call the PostsService inside constructor but it's better to use angular lifecycle methods
  // which is similar to react lifecycle methods like onComponentMount, onComponentUnmount etc
  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();
    //on an Observable subscribe is available to take action on the emitted data, emitted error and there is 3rd argument
    //the subscription does not tear down on it's own
    //later there might be not part of the dom and we need to ensure that when component is not part of dom the data is cleaned
    this.postsSub = this.postsService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.isLoading = false;
      this.posts = posts;
    })
  }

  onDelete(postId: String) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
      this.postsSub.unsubscribe();
  }
}

