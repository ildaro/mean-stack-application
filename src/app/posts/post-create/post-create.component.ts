import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  private mode = 'create'; //variable to differentiate between editing post or creating post for paramMap
  private postId: string;
  post: Post;

  constructor(public postsService: PostsService, public route: ActivatedRoute){}

  ngOnInit(){
    //no need to unsubscribe from built-in observables
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.post = this.postsService.getPost(this.postId);
      } else {
        this.mode = 'create';
        this.postId = null; //no postId if we are in create mode
       }
    });
  }

  //emit the post to post-list component via event binding
  onSavePost(form: NgForm) {
    if(form.invalid){ //if the entered values are invalid dont create the post
      return;
    }

    if(this.mode === 'create'){
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      this.postsService.updatePost(this.postId, form.value.title, form.value.content)
    }
    form.resetForm();
  }

}
