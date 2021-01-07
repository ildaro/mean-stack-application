import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector:'app-post-list',
  templateUrl:'./post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{

  posts: Post[] = [];
  isLoading = false; //for the spinner
  totalPosts = 10; //for paginator
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  private postsSub: Subscription;

  constructor(public postsService: PostsService) {}

  ngOnInit(){
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
  }

  onDelete(postId: string){
    this.postsService.deletePost(postId);
  }

  //to handle pages being changed
  onChangedPage(pageData: PageEvent){
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy(){
    this.postsSub.unsubscribe(); //unsubscribe when this component is not in use
  }

}
