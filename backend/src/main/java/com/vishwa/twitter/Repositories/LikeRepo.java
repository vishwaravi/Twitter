package com.vishwa.twitter.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.vishwa.twitter.Entities.LikeEntity;

@Repository
public interface LikeRepo extends JpaRepository<LikeEntity,Long>{
    boolean existsByTweetIdAndLikedBy(long tweetId, String likedBy);
    long countByTweetId(long tweetId);
    @Transactional
    @Modifying
    void deleteByTweetId(long tweetId);

    @Transactional
    @Modifying
    void deleteByTweetIdAndLikedBy(long tweetId, String likedBy);
}
