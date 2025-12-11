// HR Common Functions
// This file contains shared functions for HR portal pages

// Check authentication and permissions
function checkAuth() {
    const session = sessionStorage.getItem('hrms_session');
    if (!session) {
        window.location.href = '../index.html';
        return;
    }

    const userData = JSON.parse(session);
    if (userData.role !== 'HR' && userData.role !== 'Admin') {
        alert('Access denied. You do not have permission to access this page.');
        window.location.href = '../index.html';
        return;
    }

    // Set user info in header
    const userNameEl = document.getElementById('userName');
    if (userNameEl) {
        userNameEl.textContent = userData.name;
    }

    const roleEl = document.getElementById('userRole');
    if (roleEl) {
        roleEl.textContent = userData.role;
    }

    return userData;
}

// Get current user data
function getCurrentUser() {
    const session = sessionStorage.getItem('hrms_session');
    return session ? JSON.parse(session) : null;
}

// Logout function
function logout() {
    sessionStorage.removeItem('hrms_session');
    window.location.href = '../index.html';
}

// Toggle sidebar
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');
    
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }
});

// Generate WhatsApp message for interview
function generateWhatsAppMessage(candidate, interview) {
    const message = `
Dear ${candidate.name},

Congratulations! You have been shortlisted for the ${candidate.currentRole} position at ${CONFIG.COMPANY_NAME}.

Interview Details:
📅 Date: ${formatDate(interview.date)}
🕒 Time: ${interview.time}
📍 Location: ${CONFIG.INTERVIEW_LOCATION}

Please bring:
✓ Updated CV
✓ Original ID Proof
✓ Educational Certificates

For any queries, please contact HR.

Best regards,
${CONFIG.COMPANY_NAME} HR Team
    `.trim();

    return message;
}

// Generate candidate assessment link
function generateAssessmentURL(token) {
    const baseURL = window.location.origin + window.location.pathname.replace(/[^/]*$/, '');
    return `${baseURL}../candidate/assessment.html?token=${token}`;
}

// Parse CV filename (Name_Mobile_Source.pdf)
function parseFilename(filename) {
    // Remove extension
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    
    // Split by underscore
    const parts = nameWithoutExt.split('_');
    
    if (parts.length >= 3) {
        return {
            name: parts[0].trim(),
            mobile: parts[1].trim(),
            source: parts.slice(2).join('_').trim()
        };
    } else if (parts.length === 2) {
        return {
            name: parts[0].trim(),
            mobile: parts[1].trim(),
            source: 'Unknown'
        };
    } else {
        return {
            name: nameWithoutExt.trim(),
            mobile: '',
            source: 'Unknown'
        };
    }
}

// Validate mobile number
function isValidMobile(mobile) {
    const re = /^[6-9]\d{9}$/;
    return re.test(mobile);
}

// Upload single CV file
async function uploadSingleCV(file, jobId) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = async function(e) {
            const base64Data = e.target.result.split(',')[1];
            const parsedData = parseFilename(file.name);
            
            try {
                const response = await apiCall('uploadCV', {
                    jobId: jobId,
                    filename: file.name,
                    fileData: base64Data,
                    name: parsedData.name,
                    mobile: parsedData.mobile,
                    source: parsedData.source
                });
                
                resolve({
                    success: true,
                    filename: file.name,
                    data: parsedData
                });
            } catch (error) {
                reject({
                    success: false,
                    filename: file.name,
                    error: error.message
                });
            }
        };
        
        reader.onerror = function() {
            reject({
                success: false,
                filename: file.name,
                error: 'Failed to read file'
            });
        };
        
        reader.readAsDataURL(file);
    });
}

// Upload multiple CVs with progress
async function uploadMultipleCVs(files, jobId, progressCallback) {
    const results = [];
    const total = files.length;
    
    for (let i = 0; i < files.length; i++) {
        try {
            const result = await uploadSingleCV(files[i], jobId);
            results.push(result);
            
            if (progressCallback) {
                progressCallback(i + 1, total, result);
            }
        } catch (error) {
            results.push(error);
            
            if (progressCallback) {
                progressCallback(i + 1, total, error);
            }
        }
    }
    
    return results;
}

// Get candidate status badge class
function getCandidateStatusClass(status) {
    const statusClasses = {
        'Uploaded': 'badge-info',
        'Shortlisted': 'badge-primary',
        'Called': 'badge-warning',
        'Recommended': 'badge-success',
        'Owner Approved': 'badge-success',
        'Scheduled': 'badge-info',
        'Appeared': 'badge-primary',
        'Test Completed': 'badge-warning',
        'HR Interview Done': 'badge-success',
        'Rejected': 'badge-danger',
        'On Hold': 'badge-secondary',
        'Selected': 'badge-success'
    };
    return statusClasses[status] || 'badge-secondary';
}

// Get rejection stage badge class
function getRejectionStageBadgeClass(stage) {
    return 'badge-danger';
}

// Populate job portals checkboxes
function populateJobPortals(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = CONFIG.JOB_PORTALS.map(portal => `
        <label class="checkbox-label">
            <input type="checkbox" name="jobPortal" value="${portal}">
            <span>${portal}</span>
        </label>
    `).join('');
}

// Get selected job portals
function getSelectedPortals() {
    const checkboxes = document.querySelectorAll('input[name="jobPortal"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

// Validate rating (1-10)
function isValidRating(rating) {
    const num = parseInt(rating);
    return num >= 1 && num <= 10;
}

// Calculate average rating
function calculateAverageRating(ratings) {
    const validRatings = ratings.filter(r => !isNaN(r) && r > 0);
    if (validRatings.length === 0) return 0;
    return (validRatings.reduce((sum, r) => sum + r, 0) / validRatings.length).toFixed(2);
}

// Format interview date for display
function formatInterviewDate(date, time) {
    return `${formatDate(date)} at ${time}`;
}

// Get candidate profile completion percentage
function getProfileCompletionPercentage(candidate) {
    const fields = [
        'name', 'mobile', 'source', 'currentRole',
        'communicationSkills', 'professionalExperience',
        'hrInterviewMarks', 'excelMarks'
    ];
    
    const filledFields = fields.filter(field => candidate[field] && candidate[field] !== '');
    return Math.round((filledFields.length / fields.length) * 100);
}

// Filter candidates by status
function filterCandidatesByStatus(candidates, status) {
    return candidates.filter(c => c.status === status);
}

// Filter candidates by job role
function filterCandidatesByRole(candidates, role) {
    return candidates.filter(c => c.currentRole === role);
}

// Filter candidates by date range
function filterCandidatesByDateRange(candidates, startDate, endDate) {
    return candidates.filter(c => {
        const candidateDate = new Date(c.uploadedDate || c.createdDate);
        return candidateDate >= startDate && candidateDate <= endDate;
    });
}

// Get candidates statistics
function getCandidatesStatistics(candidates) {
    return {
        total: candidates.length,
        uploaded: filterCandidatesByStatus(candidates, 'Uploaded').length,
        shortlisted: filterCandidatesByStatus(candidates, 'Shortlisted').length,
        called: filterCandidatesByStatus(candidates, 'Called').length,
        recommended: filterCandidatesByStatus(candidates, 'Recommended').length,
        approved: filterCandidatesByStatus(candidates, 'Owner Approved').length,
        scheduled: filterCandidatesByStatus(candidates, 'Scheduled').length,
        appeared: filterCandidatesByStatus(candidates, 'Appeared').length,
        rejected: candidates.filter(c => c.rejectionStage).length,
        onHold: filterCandidatesByStatus(candidates, 'On Hold').length
    };
}

// Export candidates to CSV
function exportCandidatesCSV(candidates, filename = 'candidates.csv') {
    const headers = [
        'ID', 'Name', 'Mobile', 'Source', 'Role', 'Status',
        'Uploaded Date', 'Communication Skills', 'Professional Experience',
        'HR Interview Marks', 'Excel Marks', 'Rejection Stage', 'Rejection Remark'
    ];
    
    const rows = candidates.map(c => [
        c.candidateId,
        c.name,
        c.mobile,
        c.source,
        c.currentRole,
        c.status,
        formatDate(c.uploadedDate),
        c.communicationSkills || '',
        c.professionalExperience || '',
        c.hrInterviewMarks || '',
        c.excelMarks || '',
        c.rejectionStage || '',
        c.rejectionRemark || ''
    ]);

    downloadCSV([headers, ...rows], filename);
}

// Generate job description
function generateJobDescription(requirement) {
    return `
🎯 Job Title: ${requirement.jobTitle}

🏢 Company: ${CONFIG.COMPANY_NAME}
📍 Location: ${CONFIG.INTERVIEW_LOCATION}

📋 Responsibilities:
${requirement.responsibilities}

✅ Must Have:
${requirement.mustHave}

🕐 Shift: ${requirement.shift}
💰 Pay Scale: ${requirement.payScale}

🎁 Perks & Benefits:
${requirement.perks}

📧 Interested candidates can apply with their updated CV.
    `.trim();
}

// Copy job description to clipboard
function copyJobDescription(requirement) {
    const jd = generateJobDescription(requirement);
    copyToClipboard(jd, 'Job Description copied!');
}

// Validate interview scheduling form
function validateInterviewForm(formData) {
    if (!formData.candidateId) {
        showToast('Please select a candidate', 'error');
        return false;
    }
    
    if (!formData.date) {
        showToast('Please select interview date', 'error');
        return false;
    }
    
    if (!formData.time) {
        showToast('Please select interview time', 'error');
        return false;
    }
    
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showToast('Interview date cannot be in the past', 'error');
        return false;
    }
    
    return true;
}

// Validate call status form
function validateCallStatusForm(formData) {
    if (!formData.communicationSkills || !isValidRating(formData.communicationSkills)) {
        showToast('Please provide valid Communication Skills rating (1-10)', 'error');
        return false;
    }
    
    if (!formData.professionalExperience || !isValidRating(formData.professionalExperience)) {
        showToast('Please provide valid Professional Experience rating (1-10)', 'error');
        return false;
    }
    
    if (!formData.decision) {
        showToast('Please select a decision', 'error');
        return false;
    }
    
    if (formData.decision === 'Reject' && !formData.remark) {
        showToast('Please provide rejection reason', 'error');
        return false;
    }
    
    return true;
}

// Get today's date in YYYY-MM-DD format
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Get date after N days
function getDateAfterDays(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

// Check if date is today
function isToday(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

// Check if date is upcoming (today or future)
function isUpcoming(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date >= today;
}

// Copy text to clipboard
function copyToClipboard(text, message = 'Copied to clipboard!') {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(message, 'success');
        }).catch(err => {
            console.error('Failed to copy:', err);
            showToast('Failed to copy', 'error');
        });
    } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast(message, 'success');
        } catch (err) {
            showToast('Failed to copy', 'error');
        }
        document.body.removeChild(textarea);
    }
}

// Show confirmation dialog
function showConfirmDialog(message, onConfirm) {
    if (confirm(message)) {
        onConfirm();
    }
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Get file extension
function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

// Validate file type
function isValidFileType(filename, allowedTypes = ['pdf']) {
    const ext = getFileExtension(filename).toLowerCase();
    return allowedTypes.includes(ext);
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

console.log('HR Common JS loaded');

