package com.vishwa.twitter.utils;

import java.util.Map;

public class ResObj {
    public static Map<String,String> get(String msg){
        return Map.of("status",msg);
    }
}
