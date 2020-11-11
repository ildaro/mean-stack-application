import { Component, EventEmitter, Output } from '@angular/core';

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
  onAddPost() {
    const post: Post = { title: this.enteredTitle, content: this.enteredContent };
    this.postCreated.emit(post);
  }

}
