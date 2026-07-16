import { getClientProfile, clearAuthToken } from '../../scripts/api.js';

/**
 * loads and decorates the client-profile block
 * @param {Element} block The client-profile block element
 */
export default async function decorate(block) {
  block.innerHTML = `
    <div class="profile-skeleton">
      <div class="skeleton-header"></div>
      <div class="skeleton-details"></div>
    </div>
  `;

  try {
    const profileData = await getClientProfile();

    if (!profileData || !profileData.data || !profileData.data.user) {
      throw new Error('Invalid profile data');
    }

    const { user } = profileData.data;

    block.innerHTML = `
      <div class="profile-card">
        <div class="profile-header">
          <div class="profile-avatar">
            ${user.name.charAt(0).toUpperCase()}
          </div>
          <div class="profile-info">
            <h2 class="profile-name">${user.name}</h2>
            <p class="profile-email">${user.email}</p>
            <span class="profile-role badge">${user.role === 'client' ? 'Cliente VIP' : user.role}</span>
          </div>
        </div>
        
        <div class="profile-actions">
          <button id="logout-btn" class="logout-btn">Cerrar Sesión</button>
        </div>
      </div>
    `;

    block.querySelector('#logout-btn').addEventListener('click', () => {
      clearAuthToken();
      window.location.href = '/login';
    });
  } catch (error) {
    // If unauthorized or network error, clear token and kick to login
    console.error('Profile load failed:', error);
    clearAuthToken();
    window.location.href = '/login';
  }
}
