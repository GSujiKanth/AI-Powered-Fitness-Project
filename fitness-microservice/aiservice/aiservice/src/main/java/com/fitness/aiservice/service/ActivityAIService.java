package com.fitness.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;


// work with Gemini, Generate the recommendation
@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityAIService {
    private final GeminiService geminiService;

    public Recommendation generateRecommendation(Activity activity) {
        String prompt = createPromptForActivity(activity);
        String aiResponse = geminiService.getAnswer(prompt);
        log.info("RESPONSE FROM AI: {} ", aiResponse);
        return processAiResponse(activity, aiResponse);
    }

    private Recommendation processAiResponse(Activity activity, String aiResponse) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(aiResponse);

            JsonNode textNode = rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");

            String jsonContent = textNode.asText()
                    .replaceAll("```json\\n", "")
                    .replaceAll("\\n```", "")
                    .trim();

            //log.info("PARSED RESPONSE FROM AI: {} ", jsonContent);
            JsonNode analysisJson = mapper.readTree(jsonContent);

            //extract analysis part
            JsonNode analysisNode = analysisJson.path("analysis");
            StringBuilder fullAnalysis = new StringBuilder();
            addAnalysisSection(fullAnalysis, analysisNode, "overall", "Overall:");
            addAnalysisSection(fullAnalysis, analysisNode, "pace", "Pace:");
            addAnalysisSection(fullAnalysis, analysisNode, "heartRate", "Heart Rate:");
            addAnalysisSection(fullAnalysis, analysisNode, "caloriesBurned", "Calories:");

            List<String> improvements = extractImprovements(analysisJson.path("improvements")); //extract improvements part
            List<String> suggestions = extractSuggestions(analysisJson.path("suggestions")); //extract suggestions part
            List<String> safety = extractSafetyGuidlines(analysisJson.path("safety")); //extract safety part

            return Recommendation.builder()
                    .activityId(activity.getId())
                    .userId(activity.getUserId())
                    .activityType(activity.getType())
                    .recommendation(fullAnalysis.toString().trim())
                    .improvements(improvements)
                    .suggestions(suggestions)
                    .safety(safety)
                    .createdAt(LocalDateTime.now())
                    .build();
        } catch (Exception e) {
            e.printStackTrace();
            return createDefaultRecommendation(activity);
        }
    }

    //in case recommendation generation fails
    private Recommendation createDefaultRecommendation(Activity activity) {
        return Recommendation.builder()
                .activityId(activity.getId())
                .userId(activity.getUserId())
                .activityType(activity.getType())
                .recommendation("Unable to generate detailed analysis")
                .improvements(Collections.singletonList("Continue with your current routine"))
                .suggestions(Collections.singletonList("Consider consulting a fitness professional"))
                .safety(Arrays.asList(
                        "Always warm up before exercise",
                        "Stay hydrated",
                        "Listen to your body"
                ))
                .createdAt(LocalDateTime.now())
                .build();
    }

    // take a key and format analysis part
    private void addAnalysisSection(StringBuilder fullAnalysis, JsonNode analysisNode, String key, String prefix) {
        if (!analysisNode.path(key).isMissingNode()) {
            fullAnalysis.append(prefix)
                    .append(analysisNode.path(key).asText())
                    .append("\n\n");
        }
    }

    //improvements extraction part
    private List<String> extractImprovements(JsonNode improvementsNode) {
        List<String> improvements = new ArrayList<>();
        if (improvementsNode.isArray()) {
            improvementsNode.forEach(improvement -> {
                String area = improvement.path("area").asText();
                String detail = improvement.path("recommendation").asText();
                improvements.add(String.format("%s : %s", area, detail));
            });
        }
        return improvements.isEmpty()?
                Collections.singletonList("No specific improvements specified"):
                improvements;
    }

    //suggestions extraction part
    private List<String> extractSuggestions(JsonNode suggestionsNode) {
        List<String> suggestions = new ArrayList<>();
        if(suggestionsNode.isArray()) {
            suggestionsNode.forEach(improvement -> {
                String workout = improvement.path("workout").asText();
                String description = improvement.path("description").asText();
                suggestions.add(String.format("%s : %s", workout, description));
            });
        }
        return suggestions.isEmpty()?
                Collections.singletonList("No specific suggestions specified"):
                suggestions;
    }

    //safety guidlines extraction part
    private List<String> extractSafetyGuidlines(JsonNode safetyNode) {
        List<String> safety = new ArrayList<>();
        if (safetyNode.isArray()) {
            safetyNode.forEach(item -> safety.add(item.asText()));
        }
        return safety.isEmpty()?
                Collections.singletonList("Follow general safety guidelines"):
                safety;
    }

    // creating a prompt and ask the AI model to give us a data
    // in a particular format.
    private String createPromptForActivity(Activity activity) {
        return String.format(""" 

                  Analyze this fitness activity and provide detailed recommendations in the following format

                  {

                      "analysis" : {

                          "overall": "Overall analysis here",

                          "pace": "Pace analysis here",

                          "heartRate": "Heart rate analysis here",

                          "caloriesBurned": "Calories Burned here"

                      },

                      "improvements": [

                          {

                              "area": "Area name",

                              "recommendation": "Detailed Recommendation"

                          }

                      ],

                      "suggestions" : [

                          {

                              "workout": "Workout name",

                              "description": "Detailed workout description"

                          }

                      ],

                      "safety": [

                          "Safety point 1",

                          "Safety point 2"

                      ]

                  }

                

                  Analyze this activity:

                  Activity Type: %s

                  Duration: %d minutes

                  calories Burned: %d

                  Additional Metrics: %s

                

                  provide detailed analysis focusing on performance, improvements, next workout suggestions, and safety guidelines

                  Ensure the response follows the EXACT JSON format shown above.

                """,
                activity.getType(),
                activity.getDuration(),
                activity.getCaloriesBurned(),
                activity.getAdditionalMetrics()

        );
    }
}
