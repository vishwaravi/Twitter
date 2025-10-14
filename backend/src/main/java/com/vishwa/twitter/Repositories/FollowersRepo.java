package com.vishwa.twitter.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vishwa.twitter.Entities.FollowersEntity;

import jakarta.transaction.Transactional;

@Repository
public interface FollowersRepo extends JpaRepository<FollowersEntity,Long>{
    long countByUserId(String userId);

    @Transactional
    @Modifying
    @Query("delete from FollowersEntity f where f.userId = :val or f.followedBy = :val")
    void deleteByUserIdOrFollowedBy(@Param("val") String userId);

    @Transactional
    @Modifying
    @Query("delete from FollowersEntity f where f.userId = ?1 and f.followedBy = ?2")
    void deleteByUserIdAndFollowedBy(String userId, String followedBy);
}
