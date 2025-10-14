package com.vishwa.twitter.Dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterDto {
    private String userId;
    private String userName;
    private String userEmail;
    private LocalDate userDob;
    private String userPasswd;
    private String profilePath;
    private String bannerPath;
}
