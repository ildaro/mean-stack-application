import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Post } from '../post.model';


@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent {
  enteredTitle = '';
  enteredContent = '';
  @Output() postCreated = new EventEmitter<Post>(); //EventEmitter is a generic type so I can define what it emits, <Post> in this case

  //emit the post to post-list component via event binding
  onAddPost(form: NgForm) {
    if(form.invalid){ //if the entered values are invalid dont create the post
      return;
    }
    const post: Post = { title: form.value.title, content: form.value.content };
    this.postCreated.emit(post);
  }

}
