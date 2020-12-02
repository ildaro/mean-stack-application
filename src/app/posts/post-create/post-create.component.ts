import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';


import { PostsService } from '../posts.service';


@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent {
  enteredTitle = '';
  enteredContent = '';


  constructor(public postsService: PostsService){}

  //emit the post to post-list component via event binding
  onAddPost(form: NgForm) {
    if(form.invalid){ //if the entered values are invalid dont create the post
      return;
    }

    this.postsService.addPost(form.value.title, form.value.content);
    form.resetForm();
  }

}
