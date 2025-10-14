package com.vishwa.twitter.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class TimeStamp {
        public static String getTStamp(){
        LocalDateTime lDateTime = LocalDateTime.now();
        DateTimeFormatter dtformat = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String formatedDate = lDateTime.format(dtformat);
        return formatedDate;
    }
}
