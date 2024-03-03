package com.backend.backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.backend.backend.Entity.Alerts;
import com.backend.backend.Service.AlertsService;
import com.backend.backend.Constants.Constants;
import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
public class AlertsController {

    @Autowired
    private AlertsService alertsService;
    ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping(Constants.GET_ALERTS_ROUTE)
    @CrossOrigin(origins = Constants.CORS_ORIGIN)
    public ResponseEntity<?> getAlertsByUserId(@PathVariable Long userId) {
        try {
            List<Map<String, Object>> result = alertsService.getAlertsByUserId(userId);
            if (result.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Constants.ALERTS_NOT_FOUND + userId);
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Constants.FETCHING_ALERTS_ERROR + e.getMessage());
        }
    }
    
    @PutMapping(Constants.CREATE_ALERTS_ROUTE)
    @CrossOrigin(origins = Constants.CORS_ORIGIN)
    public List<Alerts> createAlerts(@RequestBody List<Alerts> alerts) {
        return alertsService.createAlerts(alerts);
    }
}
