package com.vishwa.twitter.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vishwa.twitter.Entities.FollowingEntity;

import jakarta.transaction.Transactional;

@Repository
public interface FollowingRepo extends JpaRepository<FollowingEntity,Long>{
    boolean existsByFollowingAndUserId(String following, String userId);
    long countByUserId(String userId);

    @Transactional
    @Modifying
    @Query("delete from FollowingEntity f where f.userId = :val or f.following = :val")
    void deleteByUserIdOrFollowing(@Param("val") String val);

    @Transactional
    @Modifying
    @Query("delete from FollowingEntity f where f.userId = ?1 and f.following = ?2")
    void deleteByUserIdAndFollowing(String userId, String following);
}
