# Debugging Authentication Issues

## Quick Checks:

1. **Check if you're logged in:**
   - Open browser console (F12)
   - Type: `localStorage.getItem('token')`
   - Should return a long string (JWT token)
   - If it returns `null`, you need to login first

2. **Check browser console for errors:**
   - Press F12 → Console tab
   - Look for:
     - "startCrawl called with:" - shows the request data
     - "Token exists: true/false" - shows if token is present
     - Any CORS errors
     - Network errors

3. **Check Network tab:**
   - Press F12 → Network tab
   - Try starting a crawl
   - Look for the request to `/api/crawl/start`
   - Check:
     - Status code (should be 200, not 401/403)
     - Request Headers → should have `Authorization: Bearer <token>`
     - Response → see the error message

4. **If not logged in:**
   - Go to `/login` page
   - Login or create an account
   - Then try starting a crawl again

## Common Issues:

- **401 Unauthorized**: Token expired or invalid → Login again
- **403 Forbidden**: Token not valid → Login again  
- **CORS Error**: Backend CORS config issue
- **Failed to fetch**: Backend not running or network issue

