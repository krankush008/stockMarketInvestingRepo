package com.backend.backend.Service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import com.backend.backend.Entity.Alerts;
import com.backend.backend.Entity.Bonds;
import com.backend.backend.Repository.AlertsRepository;
import com.backend.backend.Repository.BondsRepository;
import com.backend.backend.Constants.Constants;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;
import java.util.List;
import java.util.regex.Matcher;
import java.text.ParseException;
import java.util.Date;

@Component
public class NotifyUsers implements CommandLineRunner {
    private final BondsRepository bondsRepository;
    private final AlertsRepository alertsRepository;
    private final int SECOND_ELEMENT = 2;
    private final int THIRD_ELEMENT = 3;
    private final int MIN_NO_OF_CELLS_IN_ROW = 1;
    private final int FIRST_CELL_INDEX = 0;
    private final int ISIN_INDEX = 1;
    private final int THREAD_POOL_SIZE = 1;

    public NotifyUsers(BondsRepository bondsRepository, AlertsRepository alertsRepository) {
        this.bondsRepository = bondsRepository;
        this.alertsRepository = alertsRepository;
    }

    private String getCreditScore(Document doc){
        String creditScore="";
        Element tableDataElement = doc.select(Constants.FUND_NAME_ID).first();
        if (tableDataElement != null) {
            // Select the creditScore element within the <td> element
            Element creditScoreParaElement = tableDataElement.select(Constants.PARA_KEY).first();
            // Check if the <p> element exists
            if (creditScoreParaElement != null) {
                // Extract the text content of the <p> element
                creditScore = creditScoreParaElement.text();
                System.out.println("creditScore: " + creditScore);
            } else {
                System.out.println("creditScore not found within <td>.");
            }
        } else {
            System.out.println("<td> element with class 'fund_name' not found.");
        }
        return creditScore;                           
    }

    private String getISIN(String bondUrl, Pattern pattern){
        String isinNo="";
        Matcher matcher = pattern.matcher(bondUrl);
        if (matcher.find()) {
            // Extract the ISIN
            String ISIN=matcher.group(ISIN_INDEX);
            isinNo=ISIN;
            System.out.println("ISIN No: " + isinNo);
        } else {
            System.out.println("ISIN not found in the link.");
        }
        return isinNo;                      
    }

    private String convertDateFormat(String inputDate) {
        try {
            // Parse the input date
            SimpleDateFormat inputFormat = new SimpleDateFormat(Constants.OLD_DATE_FORMAT);
            Date date = inputFormat.parse(inputDate);
            // Format the date in the desired output format
            SimpleDateFormat outputFormat = new SimpleDateFormat(Constants.NEW_DATE_FORMAT);
            return outputFormat.format(date);
        } catch (ParseException e) {
            // Handle the parsing exception
            e.printStackTrace();
        }
        return null;
    }  

    private String getMaturityDate(Element trElement) {
        String maturityDate = "";
        try {
            if (trElement != null) {
                Element tdElement = trElement.select(Constants.TABLE_DATA_ID).get(SECOND_ELEMENT);
                if (tdElement != null) {
                    maturityDate = convertDateFormat(tdElement.text());
                    System.out.println("Maturity Date: " + maturityDate);
                } else {
                    System.out.println("maturity date not found in the row.");
                }
            }
        } catch (Exception e) {
            // Handle or log the exception
            e.printStackTrace();
        }
        return maturityDate;
    }

    private String getXirrBonds(Element tableRow) {
        String xirr = "";
        try {
            if (tableRow != null) {
                Element tdElement = tableRow.select(Constants.TABLE_DATA_ID).get(THIRD_ELEMENT);
                if (tdElement != null) {
                    xirr = tdElement.text();
                    System.out.println("Xirr Value: " + xirr);
                } else {
                    System.out.println("Xirr not found in the row.");
                }
            }
        } catch (Exception e) {
            // Handle or log the exception
            e.printStackTrace();
        }
        return xirr;
    }

    private void parseHtmlToBonds() {
        try {
            String url = Constants.BOND_API;
            URL apiUrl = new URL(url);
            // Open a connection to the URL
            HttpURLConnection connection = (HttpURLConnection) apiUrl.openConnection();
            connection.setRequestMethod(Constants.GET_OPERATION_STRING);
            int responseCode = connection.getResponseCode();
            // Check if the request was successful (status code 200)
            if (responseCode == HttpURLConnection.HTTP_OK) {
                // Read the response from the server
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
                    String line;
                    StringBuilder response = new StringBuilder();
                    while ((line = reader.readLine()) != null) {
                        response.append(line);
                    }
                    String htmlContent = response.toString();
                    // Parse the HTML content with Jsoup
                    Document responseDoc = Jsoup.parse(htmlContent);
                    // Get the table row by its ID
                    Element tableRow = responseDoc.getElementById(Constants.NCDBODY_ELEMENT_ID);
                    if (tableRow != null) {
                        // Get all rows in the table
                        Elements rows = tableRow.select(Constants.TABLE_ROW_STRING);
                        // Iterate over each row
                        for (Element row : rows) {
                            String maturityValue="";
                            String isinNo="";
                            String creditScore="";
                            String xirrValue="";
                            Elements cells = row.select(Constants.TABLE_DATA_STRING);
                            // Check if the row has at least 1 cells
                            if (cells.size() >= MIN_NO_OF_CELLS_IN_ROW) {
                                // Get the 1st value (index 0, as indexing starts from 0)
                                String firstVal = cells.get(FIRST_CELL_INDEX).toString();
                                Document firstValDoc = Jsoup.parse(firstVal);
                                creditScore=getCreditScore(firstValDoc);
                                Element aTag = firstValDoc.select(Constants.FUND_NAME_ANCHOR_TAG).first();
                                    // Check if the <a> tag exists
                                    if (aTag != null) {
                                        // Get the value of the 'href' attribute
                                        String bondDetailsApi = aTag.attr(Constants.BOND_DETAILS_API_TAG);
                                        String bondUrl = bondDetailsApi;
                                        Pattern pattern = Pattern.compile(Constants.ISIN_PATTERN_STRING);
                                        // Check if the pattern matches and extract the ISIN
                                        isinNo=getISIN(bondUrl, pattern);
                                        maturityValue=getMaturityDate(row);
                                        xirrValue=getXirrBonds(row);
                                        Bonds bonds=new Bonds(isinNo, maturityValue, creditScore);
                                        bondsRepository.save(bonds);
                                        getUsersByXIRR(isinNo, xirrValue);
                                    } else {
                                        System.out.println("No <a> tag found.");
                                    }
                            } else {
                                System.out.println("Row doesn't have enough cells.");
                            }   
                        }
                    } else {
                        System.out.println("Table not found.");
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            } else {
                System.out.println("GET request failed. Response Code: " + responseCode);
            }
            // Close the connection
            connection.disconnect();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public ResponseEntity<List<Alerts>> getUsersByXIRR(String bondsId, String xirr) {
        if (xirr != null) {
            // Query to get Alerts where User set XIRR on bond < Bonds.xirr
            BigDecimal xirrValue = getXirr(xirr);
            List<Alerts> alerts = alertsRepository.findByBondsIdAndXirrLessThan(bondsId, xirrValue);
            if (!alerts.isEmpty()) {
                return ResponseEntity.ok(alerts);
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            // Handle the case when Bonds.xirr is not available
            return ResponseEntity.badRequest().build();
        }
    }

    // Method to simulate getting xirr
    private BigDecimal getXirr(String xirrString) {
        try {
            // Handle the case where the String is a valid number
            return new BigDecimal(xirrString);
        } catch (NumberFormatException e) {
            // Handle the case where the String is not a valid number
            e.printStackTrace();
            return BigDecimal.ZERO;
        }
    }
    
    @Override
    public void run(String... args) {
        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(THREAD_POOL_SIZE);
        scheduler.scheduleAtFixedRate(()-> parseHtmlToBonds(), Constants.INITIAL_DELAY, Constants.FIXED_RATE_INTERVAL, TimeUnit.MILLISECONDS); 
    }
}
