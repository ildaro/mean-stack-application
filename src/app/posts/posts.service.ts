import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model'
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'}) //this makes it usable throughout the app and there can only be one instance
export class PostsService{
  private posts: Post[] = []; //private so it cant be edited from outside
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient){}

  //retrieve posts
  getPosts(){
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return{
            title: post.title,
            content: post.content,
            id: post._id
          }; //map function to make 'id' to be '_id'
        });
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      }); //subscribe to http observable, no need to unsubscribe because httpclient is a built in angular thing which will handle it for me
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  //add posts
  addPost(title: string, content: string){
    const post: Post = {id: null, title: title, content: content};
    this.http.post<{message: string}>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        console.log(responseData.message);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });

  }
}
