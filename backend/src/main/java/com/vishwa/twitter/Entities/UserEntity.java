package com.vishwa.twitter.Entities;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name= "users_table")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEntity {
    
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Column(name = "user_id" , unique = true)
    private String userId;

    @Column(name = "user_name", nullable = false)
    private String userName;

    @Column(name = "user_email")
    private String userEmail;
    
    @Column(name = "user_dob")
    private LocalDate userDob;

    @Column(name = "user_passwd", nullable = false)
    private String userPasswd;

    @Column(name = "user_pic")
    private String ProfileUrl;

    @Column(name = "banner_pic")
    private String bannerUrl;

    @Column(name = "followers")
    @Builder.Default
    private Long followers = 0L;

    @Column(name = "following")
    @Builder.Default
    private Long following = 0L;

    @Column(name = "created_at")
    private String createdAt;

    @Column(name = "time_stamp")
    private String timeStamp;
}
