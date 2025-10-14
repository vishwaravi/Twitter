package com.vishwa.twitter.Dto;

import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Component
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
//This DTO class for Response
public class UserDto {

    private String userId;
    private String userName;
    private String profileUrl;
    private String bannerUrl;
    private Long followers;
    private Long following;
}
