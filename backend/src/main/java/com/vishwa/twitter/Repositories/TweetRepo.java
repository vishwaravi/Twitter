package com.vishwa.twitter.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vishwa.twitter.Entities.TweetEntity;
import java.util.List;
import java.util.Optional;

@Repository
public interface TweetRepo extends JpaRepository<TweetEntity,Long>{
    
    List<TweetEntity> findByUserId(String UserId);

    Optional<TweetEntity> findById(int tweetId);

    @Query("SELECT tweet.Id from TweetEntity tweet WHERE tweet.userId = :userId")
    long[] findIdByUserId(@Param("userId") String userId);
}
