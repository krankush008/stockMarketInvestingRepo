package com.backend.backend.Constants;

public class Constants {
    public static final String CORS_ORIGIN = "http://localhost:3000";    
    public static final String BOND_API = "https://www.icicidirect.com/bonds/exchange-traded-bonds-ncds";   
    public static final String USERS_BACKEND_ROUTE = "/api/users"; 
    public static final String GET_ALERTS_ROUTE = "/api/getAlertsByUserId/{userId}";
    public static final String CREATE_ALERTS_ROUTE = "api/createAlerts";
    public static final String USER_ROUTE = "/getUser/{userId}";
    public static final String BONDS_ROUTE = "/api/bonds";
    public static final String ALERTS_NOT_FOUND = "No alerts found for userId: ";
    public static final String FETCHING_ALERTS_ERROR = "Error occurred while fetching alerts: ";
    public static final String BOND_ID = "bondId";
    public static final String XIRR = "xirr";
    public static final String FUND_NAME_ID = "td.fund_name";
    public static final String PARA_KEY = "p";
    public static final String OLD_DATE_FORMAT = "MMM dd,yyyy";
    public static final String NEW_DATE_FORMAT = "dd-MMM-yyyy";
    public static final String TABLE_DATA_ID = "td.text-center";
    public static final String GET_OPERATION_STRING = "GET";
    public static final String TABLE_ROW_STRING = "tr";
    public static final String TABLE_DATA_STRING = "td";
    public static final String NCDBODY_ELEMENT_ID = "NCDBondTbody";
    public static final String FUND_NAME_ANCHOR_TAG = "td.fund_name a";
    public static final String BOND_DETAILS_API_TAG = "href";
    public static final String ISIN_PATTERN_STRING = "/([^/]+)$";
    public static final long INITIAL_DELAY = 0L;
    public static final long FIXED_RATE_INTERVAL = 1000L;
}
