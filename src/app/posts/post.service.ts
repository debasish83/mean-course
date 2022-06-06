// passing data within different angular components is painful
// there we design a service that hold all the data and passes it in different angular components
import { Injectable } from '@angular/core';
import {Post} from './post.model'
import {Subject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
//rxjs provides operators that can work on top of data streams
import {map} from 'rxjs/operators';
import { Router } from '@angular/router';

// Injectable guarantees that there is only one instance of the PostsService through the app. It's quite similar
// to the redux idea in react
@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];

  //Theory on observables
  //An Observer subscribe to Observable
  //When the observable is invoked there is next(), error() and complete() callback hooks
  //We use it to manage http request and which returns the data from the API
  //Subject is a special type of passive subscriber
  private postsUpdated = new Subject<Post[]>();

  // we can inject modules inside typescript classes
  // to navigate users we can use angular router
  constructor(private http: HttpClient, private router: Router) {}

  // if we send this.posts it does not copy the data and send the reference
  // if we want to create a new copy of it
  // [...this.posts] will open up elements of this.posts and create a new array
  // we can return the original copy but then other components can change the data, that's why we prefer to
  // create a copy before we move the object
  // We don't want to use EventEmitter since that's used more with Input and Output decorator
  // We use a package called rxjs which is the equivalent of redux
  getPosts() {
    // this is where we would to get the posts from express backend
    // here we will send a http request and save the posts in our list
    // due to database _id Post[] data is not valid and we will use any
    this.http.get<{message: string, posts: {title: String, content: String, _id: String, imagePath: String}[]}>('http://localhost:3000/api/posts')
    .pipe(map(postData => {
      return postData.posts.map(post => {
        console.log(post.imagePath);
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath
        };
      });
    }))
    .subscribe((transformedPosts) => {
      // no need to duplicate, this data is coming from server
      this.posts = transformedPosts;
      // we need to inform other part of our app about this update, sending a copy of the post so that
      // we don't edit the copy of the data that's in the service
      this.postsUpdated.next([...this.posts]);
    })
  }

  addPost(title: string, content: string, image: File) {
    //const post: Post = {id: '', title: title, content: content}
    const postData = new FormData(); // it help combine json data and blobs
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image);

    //from the service/redux store we can send the data
    this.http.post<{message:string, post: Post}>('http://localhost:3000/api/posts', postData)
    .subscribe(responseData => {
      const post: Post = {
        id: responseData.post.id,
        title: title,
        content: content,
        imagePath: responseData.post.imagePath
      }
      this.posts.push(post);
      //after we update the post we would like to emit a value that other component can access
      this.postsUpdated.next([...this.posts])
      this.router.navigate(["/"]);
    })
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = {id:id, title:title, content:content, imagePath: null!};
    this.http
    .put("http://localhost:3000/api/posts/" + id, post)
    .subscribe(response => {
      const updatedPosts = [...this.posts];
      //search for the old post Id
      const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      //once the posts is updated, I tell my app about it by sending an event via postsUpdated
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    })
  }

  deletePost(postId: String) {
    console.log('delete post ' + postId);
    this.http.delete("http://localhost:3000/api/posts/" + postId)
    .subscribe(() => {
      //Instead of just logging it we need to update the post in our UI
      //pull all the posts from angular UI and then filter the post that was deleted
      const updatedPosts = this.posts.filter(post => post.id != postId);
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts])
    })
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  //array.find can give undefined, using ! operator we are ensuring that find will return a valid object
  getPost(id: string) {
    //this now return observable inplace of returning back exact post, return from a http api is async call to the database
    return this.http.get<{_id: string, title:  string, content: string, imagePath: string}>("http://localhost:3000/api/posts/" + id);
    //in place of returning the post from the local array of this.posts but do a API call to retrieve the post
    //return {...this.posts.find(post => post.id === id)!};
  }
}
