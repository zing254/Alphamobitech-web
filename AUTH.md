# Authentication Documentation

## Admin Portal

The admin portal is accessible via the "Admin" navigation link or by visiting the application root.

### Default Login

- **URL**: / (navigate to Admin page)
- **Email**: `admin@alphamobitech.com`
- **Password**: `AlphaTech2024!`

## Security Features

### 1. Environment-Based Credentials

Admin credentials are stored in environment variables:

```bash
# .env file
VITE_ADMIN_EMAIL=admin@alphamobitech.com
VITE_ADMIN_PASSWORD=AlphaTech2024!
```

### 2. Session Management

- **Session Duration**: 24 hours (default)
- **Remember Me**: Extends session to 7 days
- **Auto Logout**: Session expires automatically

### 3. LocalStorage Keys

| Key | Description |
| --- | --- |
| `adminAuth` | Authentication status (`true`/`false`) |
| `adminAuthTime` | Timestamp of login |
| `adminSessionExpiry` | Session expiration timestamp |

## Customization

### Change Admin Credentials

1. Create a `.env` file in the project root:
```bash
cp .env.example .env
```

2. Update the credentials:
```bash
VITE_ADMIN_EMAIL=your-email@example.com
VITE_ADMIN_PASSWORD=YourSecurePassword123!
```

3. Restart the development server

### Session Duration

Modify in `AdminDashboard.tsx`:

```typescript
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const REMEMBER_ME_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
```

## Production Recommendations

1. **Never commit credentials** - Use environment variables
2. **Use HTTPS** - Always serve over HTTPS in production
3. **Implement rate limiting** - Prevent brute force attacks
4. **Add email service** - Connect password reset to email API
5. **Consider JWT** - For more robust session management
6. **Add 2FA** - Two-factor authentication

## Troubleshooting

### Cannot Login

1. Check browser console for errors
2. Verify credentials in `.env`
3. Clear localStorage and retry
4. Check network requests

### Session Expires Too Quickly

1. Check system clock is accurate
2. Verify localStorage not cleared
3. Increase `SESSION_DURATION` in code

### Remember Me Not Working

1. Check browser allows localStorage
2. Verify cookies not cleared
3. Check localStorage `adminAuthTime` updated on login