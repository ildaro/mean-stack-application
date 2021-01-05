import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';


import { PostsService } from '../posts.service';


@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create'; //variable to differentiate between editing post or creating post for paramMap
  private postId: string;
  post: Post;

  constructor(public postsService: PostsService, public route: ActivatedRoute){}

  ngOnInit(){
    //using FormGroup for reactive approach to forms, validators are done here instead of html file.
    this.form = new FormGroup({
      'title': new FormControl(null,
        {validators: [Validators.required, Validators.minLength(3)]
      }),
      'content': new FormControl(null, {validators: [Validators.required]}),
      'image' : new FormControl(null, {validators :[Validators.required]})
    });

    //no need to unsubscribe from built-in observables
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true; //isLoading used to control showing loading spinner

        this.postsService.getPost(this.postId).subscribe(postData => { // this code executes asynchronously
          this.isLoading = false;
          this.post = {id: postData._id, title: postData.title, content: postData.content}
          this.form.setValue({
            'title': this.post.title,
            'content': this.post.content});
        });
      } else {
        this.mode = 'create';
        this.postId = null; //no postId if we are in create mode
       }
    });
  }

  //event that is triggered when an image is picked
  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  //emit the post to post-list component via event binding
  onSavePost() {
    if(this.form.invalid){ //if the entered values are invalid dont create the post
      return;
    }
    this.isLoading = true;
    if(this.mode === 'create'){
      this.postsService.addPost(this.form.value.title, this.form.value.content);
    } else {
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content)
    }
    this.form.reset();
  }
}
