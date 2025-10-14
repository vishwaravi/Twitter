package com.vishwa.twitter.Controllers;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vishwa.twitter.Dto.TweetDto;
import com.vishwa.twitter.Entities.CommentEntity;
import com.vishwa.twitter.Entities.TweetEntity;
import com.vishwa.twitter.Repositories.LikeRepo;
import com.vishwa.twitter.Repositories.UserRepo;
import com.vishwa.twitter.Services.TweetService;
import com.vishwa.twitter.utils.ResObj;

@RestController
@RequestMapping("/feed")
public class TweetController {

    private TweetService tweetService;
    private LikeRepo likeRepo;
    private UserRepo userRepo;
    TweetController(TweetService tweetService,
            LikeRepo likeRepo,
            UserRepo userRepo) {

        this.likeRepo = likeRepo;
        this.tweetService = tweetService;
        this.userRepo = userRepo;
    }

    @GetMapping
    List<TweetEntity> getTweets() {
        return tweetService.getTweets();
    }

    @GetMapping("/myposts")
    List<TweetEntity> myTweets() {
        List<TweetEntity> tweets = tweetService.getMyTweets();
        for (TweetEntity i : tweets) {

            if (likeRepo.existsByTweetIdAndLikedBy(i.getId(), auth().getName()))
                i.setIsLiked(true);
            
            String profilePathtmp = userRepo.getProfileImgByUserId(i.getUserId());
            i.setUserProfile(profilePathtmp);

        }
        return tweets;
    }

    @GetMapping("/{tweetId}")
    TweetEntity getTweets(@PathVariable int tweetId) {
        return tweetService.getTweet(tweetId).get();
    }

    @PostMapping
    ResponseEntity<?> postTweet(@RequestBody TweetDto tweet) {
        if (tweet.getTweetContent() != null) {
            return new ResponseEntity<>(tweetService.postTweet(tweet), HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(ResObj.get("tweet Cannot be empty"), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{tweetId}")
    ResponseEntity<?> deleteTweet(@PathVariable int tweetId) throws IOException {
        if (tweetService.deleteTweet(tweetId)) {
            return new ResponseEntity<>(ResObj.get("Tweet Deleted."), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(ResObj.get("Something went Wrong."), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/{tweetId}/comment")
    ResponseEntity<?> postComment(@RequestBody CommentEntity comment, @PathVariable long tweetId) {
        if (tweetService.postComment(comment, tweetId) != null)
            return new ResponseEntity<>(tweetService.postComment(comment, tweetId), HttpStatus.OK);
        else {
            return new ResponseEntity<>(ResObj.get("Something went Wrong. Comment not posted"), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{tweetId}/comment")
    ResponseEntity<?> deleteComment(@RequestBody CommentEntity comment, @PathVariable long tweetId) {
        if (tweetService.deleteComment(comment.getId(), tweetId)) {
            return new ResponseEntity<>(ResObj.get("comment deleted."), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(ResObj.get("Something went Wrong."), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{tweetId}/comments")
    ResponseEntity<?> getCommentsByTweet(@PathVariable long tweetId) throws IOException {
        List<CommentEntity> comments = tweetService.getComments(tweetId);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @PutMapping("/{tweetId}/like")
    ResponseEntity<?> postLike(@PathVariable long tweetId) {
        if (tweetService.postLike(tweetId) != null) {
            return new ResponseEntity<>(ResObj.get("post Liked"), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(ResObj.get("Something went Wrong."), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{tweetId}/dislike")
    ResponseEntity<?> dislike(@PathVariable long tweetId) {
        if (tweetService.dislikePost(tweetId)) {
            return new ResponseEntity<>(ResObj.get("post Disliked"), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(ResObj.get("Something went Wrong."), HttpStatus.BAD_REQUEST);
        }
    }

    static public Authentication auth() {
        return SecurityContextHolder.getContext().getAuthentication();
    }
}
