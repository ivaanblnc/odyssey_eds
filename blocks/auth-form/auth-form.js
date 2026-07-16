import { login, register, setAuthToken } from '../../scripts/api.js';

/**
 * loads and decorates the auth-form block
 * @param {Element} block The auth-form block element
 */
export default async function decorate(block) {
  // Config: if the author put "register" in the block, it defaults to sign up. Otherwise login.
  const isRegister = block.classList.contains('register');

  block.innerHTML = `
    <div class="auth-card">
      <h2 class="auth-title">${isRegister ? 'Solicitar Acceso VIP' : 'Iniciar Sesión'}</h2>
      <p class="auth-subtitle">
        ${isRegister ? 'Únete al club exclusivo de Odyssey para gestionar tus reservas.' : 'Bienvenido de nuevo a tu portal privado.'}
      </p>
      
      <form id="auth-form" class="auth-form-container">
        <div id="auth-error" class="auth-error hidden"></div>
        
        ${isRegister ? `
          <div class="input-group">
            <label for="auth-name">Nombre Completo</label>
            <input type="text" id="auth-name" name="name" required placeholder="Ej: Bruce Wayne" />
          </div>
        ` : ''}
        
        <div class="input-group">
          <label for="auth-email">Correo Electrónico</label>
          <input type="email" id="auth-email" name="email" required placeholder="correo@ejemplo.com" />
        </div>
        
        <div class="input-group">
          <label for="auth-password">Contraseña</label>
          <input type="password" id="auth-password" name="password" required placeholder="••••••••" minlength="${isRegister ? '8' : '1'}" />
        </div>
        
        <button type="submit" class="auth-submit-btn" id="auth-submit-btn">
          ${isRegister ? 'Crear Cuenta' : 'Acceder'}
        </button>
      </form>
      
      <div class="auth-footer">
        ${isRegister ? `
          ¿Ya tienes cuenta? <a href="/login" class="auth-link">Inicia sesión</a>
        ` : `
          ¿No tienes cuenta? <a href="/register" class="auth-link">Regístrate ahora</a>
        `}
      </div>
    </div>
  `;

  const form = block.querySelector('#auth-form');
  const errorDiv = block.querySelector('#auth-error');
  const submitBtn = block.querySelector('#auth-submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.classList.add('hidden');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Procesando...';

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      let result;
      if (isRegister) {
        result = await register(payload);
      } else {
        result = await login(payload);
      }

      if (result && result.data && result.data.token) {
        // Success: Save token
        setAuthToken(result.data.token);
        // Redirect to profile
        window.location.href = '/profile';
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (error) {
      errorDiv.textContent = error.message || 'Credenciales incorrectas o error de servidor.';
      errorDiv.classList.remove('hidden');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = isRegister ? 'Crear Cuenta' : 'Acceder';
    }
  });
}
