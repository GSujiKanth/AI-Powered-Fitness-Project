package com.fitness.aiservice.model;


import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

//Data transfer purpose only
@Data
public class Activity {
    private String id;
    private String userId;
    private Integer duration;
    private Integer caloriesBurned;
    private LocalDateTime startTime;
    private Map<String, Object> additionalMetrics;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
