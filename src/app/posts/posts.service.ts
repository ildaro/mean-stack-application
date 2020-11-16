import { Injectable } from '@angular/core';
import { Post } from './post.model'

@Injectable({providedIn: 'root'}) //this makes it usable throughout the app and there can only be one instance
export class PostsService{
  private posts: Post[] = []; //private so it cant be edited from outside

  //retrieve posts
  getPosts(){
    return [...this.posts]; //spread operator
  }

  //add posts
  addPost(title: string, content: string){
    const post: Post = {title: title, content: content};
    this.posts.push(post);
  }
}
