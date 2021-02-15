import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model'
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'}) //this makes it usable throughout the app and there can only be one instance
export class PostsService{
  private posts: Post[] = []; //private so it cant be edited from outside
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router){}

  //retrieve posts
  getPosts(postsPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, posts: any, maxPosts:number }>('http://localhost:3000/api/posts' + queryParams)
      .pipe(map((postData) => {
        return { posts: postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator
          }; //map function to make 'id' to be '_id'
        }), maxPosts: postData.maxPosts};
      }))
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({ posts: [...this.posts], postCount: transformedPostData.maxPosts });
      }); //subscribe to http observable, no need to unsubscribe because httpclient is a built in angular thing which will handle it for me
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  //get post method for editing
  getPost(id: string){
    return this.http.get<{_id: string, title: string, content: string, imagePath: string, creator: string }>("http://localhost:3000/api/posts/" + id);
  }

  //add posts
  addPost(title: string, content: string, image: File){
    //using FormData instead of JSON data so I can send a file to server
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    this.http.post<{message: string, post: Post}>("http://localhost:3000/api/posts",
      postData
    )
      .subscribe((responseData) => {
        this.router.navigate(["/"]); //navigate back to home page
      });
    }

  updatePost(id: string, title: string, content: string, image: File | string){
    let postData: Post | FormData;
    if (typeof(image) === 'object'){ // its a file create FormData
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else { // else send JSON data
        postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      }

    }
    this.http.put("http://localhost:3000/api/posts/" + id, postData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string){
      return this.http.delete("http://localhost:3000/api/posts/" + postId)
  }
}
