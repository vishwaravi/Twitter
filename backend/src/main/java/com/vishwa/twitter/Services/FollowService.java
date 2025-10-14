package com.vishwa.twitter.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vishwa.twitter.Entities.FollowersEntity;
import com.vishwa.twitter.Entities.FollowingEntity;
import com.vishwa.twitter.Entities.UserEntity;
import com.vishwa.twitter.Repositories.FollowersRepo;
import com.vishwa.twitter.Repositories.FollowingRepo;
import com.vishwa.twitter.Repositories.UserRepo;
import com.vishwa.twitter.utils.TimeStamp;

@Service
public class FollowService {

    @Autowired
    FollowingRepo followingRepo;
    @Autowired
    FollowersRepo followersRepo;
    @Autowired
    UserRepo userRepo;
    
    // function for Follow the User
    @Modifying
    @Transactional
    public FollowingEntity followUser(String userId){
        if(!followingRepo.existsByFollowingAndUserId(userId,auth().getName()) && userRepo.existsByUserId(userId) && !userId.equals(auth().getName())){
            
            FollowingEntity following = new FollowingEntity(null,auth().getName(),userId,TimeStamp.getTStamp());
            FollowersEntity follower = new FollowersEntity(null,userId,auth().getName(),TimeStamp.getTStamp());
            
            UserEntity otherUser = userRepo.findByUserId(userId).get();
            UserEntity me = userRepo.findByUserId(auth().getName()).get();

            otherUser.setFollowers(followersRepo.countByUserId(userId)+1);
            me.setFollowing(followingRepo.countByUserId(auth().getName())+1);

            userRepo.save(otherUser);
            userRepo.save(me);
            followersRepo.save(follower);
            
            return followingRepo.save(following);
        }
        else return null;
    }

    public boolean unfollowUser(String userId){
        if(followingRepo.existsByFollowingAndUserId(userId,auth().getName())){

            UserEntity otherUser = userRepo.findByUserId(userId).get();
            UserEntity me = userRepo.findByUserId(auth().getName()).get();

            me.setFollowing(followingRepo.countByUserId(auth().getName()) - 1);
            otherUser.setFollowers(followersRepo.countByUserId(userId) - 1);

            followersRepo.deleteByUserIdAndFollowedBy(userId,auth().getName());
            followingRepo.deleteByUserIdAndFollowing(auth().getName(), userId);

            userRepo.save(otherUser);
            userRepo.save(me);
            return true;
        }
        else return false;
    }

    static public Authentication auth(){
        return SecurityContextHolder.getContext().getAuthentication();
    }
}
