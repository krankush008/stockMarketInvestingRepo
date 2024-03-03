package com.backend.backend.Service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.backend.backend.Entity.Alerts;
import com.backend.backend.Repository.AlertsRepository;
import com.backend.backend.Constants.Constants;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AlertsService {

    @Autowired
    private AlertsRepository alertsRepository;
    int FIRST_ALERT_ID = 0;

    public List<Map<String, Object>> getAlertsByUserId(Long userId) {
        List<Alerts> alerts = alertsRepository.findByUserId(userId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Alerts alert : alerts) {
            Map<String, Object> alertInfo = new HashMap<>();
            alertInfo.put(Constants.BOND_ID, alert.getBondsId());
            alertInfo.put(Constants.XIRR, alert.getXirr());
            result.add(alertInfo);
        }
        return result;
    }

    public List<Alerts> createAlerts(List<Alerts> alerts) {
        List<Alerts> savedAlerts = new ArrayList<>();
        for (Alerts alert : alerts) {
            Optional<Alerts> existingAlert = alertsRepository.findByBondsIdAndUserId(alert.getBondsId(), alert.getUserId());
            if (existingAlert.isPresent()) {
                // Update the existing record
                Alerts existing = existingAlert.get();
                existing.setXirr(alert.getXirr());
                savedAlerts.add(alertsRepository.save(existing));
            } else {
                // Insert a new record
                savedAlerts.add(alertsRepository.save(alert));
            }
        }

        // Remove alerts that are not in the updated list
        List<Alerts> existingAlerts = alertsRepository.findByUserId(savedAlerts.get(FIRST_ALERT_ID).getUserId());
        existingAlerts.stream()
                .filter(existingAlert -> !savedAlerts.contains(existingAlert))
                .forEach(alertsRepository::delete);

        return savedAlerts;
    }
}
