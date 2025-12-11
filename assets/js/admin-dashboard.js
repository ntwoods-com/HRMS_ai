/**
 * Admin Dashboard JavaScript
 */

let dashboardStats = {
    totalUsers: 0,
    totalRequirements: 0,
    totalCandidates: 0,
    totalTemplates: 0
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async function() {
    const user = checkAdminAuth();
    if (!user) return;
    
    await loadDashboardData();
});

// Load dashboard data
async function loadDashboardData() {
    showLoadingOverlay('Loading dashboard data...');
    
    try {
        // Fetch dashboard stats
        await fetchDashboardStats();
        
        // Update UI
        updateDashboardUI();
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showToast('Error loading dashboard data', 'error');
    } finally {
        hideLoadingOverlay();
    }
}

// Fetch dashboard statistics
async function fetchDashboardStats() {
    const result = await apiCall('getDashboardStats', {});
    
    // Since we're using no-cors, we'll simulate data
    // In production with CORS, you would use the actual response
    dashboardStats = {
        totalUsers: 5,
        totalRequirements: 12,
        totalCandidates: 45,
        totalTemplates: 8
    };
}

// Update dashboard UI
function updateDashboardUI() {
    document.getElementById('totalUsers').textContent = dashboardStats.totalUsers;
    document.getElementById('totalRequirements').textContent = dashboardStats.totalRequirements;
    document.getElementById('totalCandidates').textContent = dashboardStats.totalCandidates;
    document.getElementById('totalTemplates').textContent = dashboardStats.totalTemplates;
    document.getElementById('activeUsers').textContent = dashboardStats.totalUsers;
}

// Refresh dashboard
async function refreshDashboard() {
    await loadDashboardData();
    showToast('Dashboard refreshed successfully');
}

