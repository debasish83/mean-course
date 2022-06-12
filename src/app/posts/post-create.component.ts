import { Component, OnInit} from '@angular/core';
import { Post } from './post.model';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from './post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';
// we need to create a new event emitter and send the post from one component
// and listen to this event in another component
// to listen on a post, we have to make the EventEmitter by adding a decorate called output
// when we are using data, it's better to create a model for our posts so that we can use it in multiple places
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  post:Post = {id: '', content: '', title: '', imagePath: ''};

  private mode = 'create';
  private postId: string = '';
  isLoading = false;
  form!: FormGroup;
  imagePreview!: string;

  // we can define that we are emitting Post data from this EventEmitter
  // @Output() postCreated = new EventEmitter<Post>();
  // public postsService will automatically create an instance of PostsService in the class
  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      //formstate and form validation
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'content': new FormControl(null, {
        validators: [Validators.required]
      }),
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        console.log(paramMap)
        if (paramMap.has('postId')) {
          // in edit mode we should see the post data that's fetched from database
          console.log('inside edit mode');
          this.mode = 'edit';
          // use non-null assertion operator ! to ensure it is non-null value
          this.postId = paramMap.get('postId')!;
          //this.post = this.postsService.getPost(this.postId) make it a observable and subscribe on it
          this.isLoading = true;
          //start showing spinner
          this.postsService.getPost(this.postId).subscribe(postData => {
            console.log(postData);
            this.isLoading = false;
            // stop showing spinner
            this.post = {
              id: postData._id,
              title: postData.title,
              content: postData.content,
              imagePath: postData.imagePath
            };
            this.form.setValue({
              title: this.post.title,
              content: this.post.content,
              image: this.post.imagePath
            });
          })
         } else {
          console.log('inside create mode');
          this.mode = 'create';
          this.postId = '';
        }
      })
  }

  onImagePicked(event: Event) {
    console.log('onImagePicked' + this.mode);
    console.log((event.target as HTMLInputElement).files?.item(0));
    const file = (event.target as HTMLInputElement).files?.item(0) as Blob;
    this.form.patchValue({image: file});
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.readAsDataURL(file);
    //when reader is done reading the file it will call onload handle
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
  }

  onSavePost() {
    // validate the form
    // we can use angular material to add the form validation detials

    //comment it right now so that we can upload any file
    //if (this.form.invalid) return;

    // const post: Post = {
    //   title: form.value.title,
    //   content: form.value.content
    // }
    this.isLoading = true;

    if (this.mode === 'create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image);
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image);
    }
    //this.postCreated.emit(post);
    this.form.reset();
  }
}
