import { Component } from '@angular/core';

import { Post } from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  storedPosts: Post[] = [];  //using Post model so that only posts are stored in this variable

  //add created posts to storedPosts array
  onPostAdded(post){
    this.storedPosts.push(post);
  }
}
