package com.vishwa.twitter.Services;

import java.io.IOException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vishwa.twitter.Config.Time.TimeStamp;
import com.vishwa.twitter.Entities.UserEntity;
import com.vishwa.twitter.Repositories.FollowersRepo;
import com.vishwa.twitter.Repositories.FollowingRepo;
import com.vishwa.twitter.Repositories.TweetRepo;
import com.vishwa.twitter.Repositories.UserRepo;

@Service
public class UserService implements UserDetailsService{
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private TweetService tweetService;
    @Autowired
    private TweetRepo tweetRepo;
    @Autowired
    private FollowingRepo followingRepo;
    @Autowired
    private FollowersRepo followersRepo;

    //For Register the User
    public UserEntity saveUserData(UserEntity user){
        user.setTimeStamp(TimeStamp.getTStamp());
        user.setCreatedAt(TimeStamp.getTStamp());
        return userRepo.save(user);
    }

    //for update user
    public UserEntity updateUser(UserEntity user){
        Optional<UserEntity> existing = userRepo.findByUserId(auth().getName());
        if(existing.isPresent()){
           UserEntity existingUser = existing.get();

            if(user.getUserId() != null)
                existingUser.setUserId(user.getUserId());
            if(user.getUserName() != null)
                existingUser.setUserName(user.getUserName());
            if(user.getUserEmail() != null)
                existingUser.setUserEmail(user.getUserEmail());
            if(user.getUserDob() != null)
                existingUser.setUserDob(user.getUserDob());
            if(user.getProfileUrl() != null)
                existingUser.setProfileUrl(user.getProfileUrl());
            if(user.getBannerUrl() != null)
                existingUser.setBannerUrl(user.getBannerUrl());
            existingUser.setTimeStamp(TimeStamp.getTStamp());
            return userRepo.save(existingUser);
        }
        else return null;

    }

    //To get the User details
    @Transactional
    public UserEntity getUserData(String userid){
        Optional<UserEntity> user = userRepo.findByUserId(userid);
        if(user.isPresent()){
            UserEntity userData = user.get();
            userData.setFollowers(followersRepo.countByUserId(userid));
            userData.setFollowing(followingRepo.countByUserId(userid));
            userRepo.save(userData);
            return userData;
        } 
        else return null;
    }

    //User details for Authentictaion
    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        Optional<UserEntity> user = userRepo.findByUserId(userId);
        if(user.isPresent()){
            var userobj = user.get();
            return User.builder()
                        .username(userobj.getUserId())
                        .password(userobj.getUserPasswd())
                        .build();
        } else{
            throw new UsernameNotFoundException(userId);
        }
    }

    //For delete the User
    @Transactional
    public Boolean deleteUser(String userid) throws IOException{
        if(getUserData(userid)!=null){
            long[] arr = tweetRepo.findIdByUserId(userid);
            for(long i:arr){
                tweetService.deleteTweet(i);
            }
            followersRepo.deleteByUserIdOrFollowedBy(userid);
            followingRepo.deleteByUserIdOrFollowing(userid);
            userRepo.delete(getUserData(userid));
            return true;
        }
        else return false;
    }

    //function for get the user name form the Security Context
    static public Authentication auth(){
        return SecurityContextHolder.getContext().getAuthentication();
    }
}