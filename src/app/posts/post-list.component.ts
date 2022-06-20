import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import {Post} from "./post.model"
import { PostsService } from "./post.service";
import {Subject, Subscription} from 'rxjs';
import { PageEvent } from "@angular/material/paginator";

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
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1,2, 5, 10];

  private postsSub: Subscription = new Subscription;

  // angular will try to give the PostsService to the constructor
  // public keyword will create an instance called postsService
  constructor(public postsService: PostsService) {}

  // we can call the PostsService inside constructor but it's better to use angular lifecycle methods
  // which is similar to react lifecycle methods like onComponentMount, onComponentUnmount etc
  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, 1);
    //on an Observable subscribe is available to take action on the emitted data, emitted error and there is 3rd argument
    //the subscription does not tear down on it's own
    //later there might be not part of the dom and we need to ensure that when component is not part of dom the data is cleaned
    this.postsSub = this.postsService.getPostUpdateListener().subscribe((postData: {posts: Post[], postCount: number}) => {
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    })
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    console.log(pageData)
  }

  onDelete(postId: String) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(()=> {
      // what happens if there are no more elements in the page ?
      let modifiedPage = this.currentPage;
      if (this.postsPerPage*this.currentPage > this.totalPosts - 1)
        modifiedPage = this.currentPage - 1;
      //this.postsPerPage, this.currentPage, this.totalPosts
      //if this.postsPerPage * this.currentPage > this.totalPosts - 1
      this.postsService.getPosts(this.postsPerPage, modifiedPage);
    });
  }

  ngOnDestroy() {
      this.postsSub.unsubscribe();
  }
}
