package com.vishwa.twitter.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.vishwa.twitter.Dto.RegisterDto;

@Service
public class AuthService {
    @Autowired
    AuthenticationManager authManager;
    @Autowired
    JWTService jwtService;

    public String verify(RegisterDto user){
        Authentication authentication = 
            authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUserId(), user.getUserPasswd()));
            if(authentication.isAuthenticated()){
                return jwtService.generateToken(user.getUserId());
            }
            else return "fail";
    }
}
