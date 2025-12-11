/**
 * HRMS Configuration File
 * Update these values according to your setup
 */

const HRMS_CONFIG = {
    // Google Apps Script Web App URL
    // After deploying your Code.gs, paste the web app URL here
    API_URL: 'https://script.google.com/macros/s/AKfycbxvlOR7Q69vZuJAAEaJ4gsB3X2HQpgVS_iY8M_9jEaGKzA_KgvrnsBcFkpaJz7EkaoCDQ/exec',
    
    // Google OAuth Client ID
    // Get this from Google Cloud Console
    GOOGLE_CLIENT_ID: '1029752642188-ku0k9krbdbsttj9br238glq8h4k5loj3.apps.googleusercontent.com',
    
    // Application Settings
    APP_NAME: 'HRMS - N.T Woods Pvt. Ltd.',
    COMPANY_NAME: 'N.T Woods Pvt. Ltd.',
    
    // Interview Location
    INTERVIEW_LOCATION: 'Near Dr. Gyan Prakash, Kalai Compound, NT Woods, Gandhi Park, Aligarh (202 001)',
    
    // Job Portals
    JOB_PORTALS: [
        'Naukri.com',
        'Indeed',
        'Work India',
        'Apna',
        'LinkedIn',
        'Direct'
    ],
    
    // Job Roles
    JOB_ROLES: [
        'CRM',
        'CCE',
        'PC',
        'MIS',
        'Jr. Accountant',
        'Sr. Accountant',
        'Team Leader',
        'Manager'
    ],
    
    // User Roles
    USER_ROLES: {
        ADMIN: 'Admin',
        EA: 'EA',
        HR: 'HR'
    },
    
    // Requirement Statuses
    REQUIREMENT_STATUS: {
        PENDING: 'Pending Review',
        VALID: 'Valid',
        SEND_BACK: 'Send Back'
    },
    
    // Candidate Statuses
    CANDIDATE_STATUS: {
        CV_UPLOADED: 'CV Uploaded',
        SHORTLISTED: 'Shortlisted',
        RECOMMENDED: 'Recommended for Owners',
        APPROVED_WALKIN: 'Approved for Walk-in',
        INTERVIEW_SCHEDULED: 'Interview Scheduled',
        APPEARED: 'Appeared',
        FORM_SUBMITTED: 'Form Submitted',
        PASSED_HR: 'Passed HR Interview',
        REJECTED: 'Rejected',
        HOLD: 'Hold'
    },
    
    // Test Types
    TEST_TYPES: {
        EXCEL: 'excel',
        TALLY: 'tally',
        VOICE: 'voice'
    }
};

// Helper function to check if config is set up
function isConfigured() {
    return HRMS_CONFIG.API_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE' &&
           HRMS_CONFIG.GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com';
}

