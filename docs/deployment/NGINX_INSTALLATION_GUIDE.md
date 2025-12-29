# Nginx Installation Guide
## Domain: websitedesigningcompetition.com

---

## Step 1: Upload Nginx Configuration to VPS

### From Your Local Machine (Windows PowerShell):

```powershell
# Navigate to your project folder
cd C:\Users\eshaa\Downloads\kids_web_competition

# Upload nginx config to VPS
scp nginx-kids-competition.conf root@YOUR_VPS_IP:~/
```

Replace `YOUR_VPS_IP` with your actual VPS IP address.

**What to expect:**
```
nginx-kids-competition.conf                100%  3421    45.2KB/s   00:00
```

---

## Step 2: Install on VPS

### SSH into your VPS:
```bash
ssh root@YOUR_VPS_IP
```

### Move config to Nginx directory:
```bash
sudo mv ~/nginx-kids-competition.conf /etc/nginx/sites-available/kids-competition
```

### Remove default Nginx config (if exists):
```bash
sudo rm /etc/nginx/sites-enabled/default
```

### Create symbolic link to enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/kids-competition /etc/nginx/sites-enabled/
```

### Verify the link was created:
```bash
ls -la /etc/nginx/sites-enabled/
```

**Expected output:**
```
lrwxrwxrwx 1 root root 42 Dec 21 11:15 website-design -> /etc/nginx/sites-available/website-design
```

---

## Step 3: Test Nginx Configuration

```bash
sudo nginx -t
```

**Expected output if successful:**
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

**If you see errors:**
- Check that `/var/www/kids-competition/dist` directory exists
- Verify backend is running on port 3000: `pm2 status`

---

## Step 4: Reload Nginx

```bash
sudo systemctl reload nginx
```

**Verify Nginx is running:**
```bash
sudo systemctl status nginx
```

**Expected output:**
```
● nginx.service - A high performance web server
   Active: active (running) since ...
```

Press `q` to exit.

---

## Step 5: Test Your Website

### Test HTTP (before SSL):

**In your browser, visit:**
```
http://websitedesigningcompetition.com
```

**Should show:** Your Kids Web Competition website!

**Test API:**
```
http://websitedesigningcompetition.com/api/health
```

**Should return:**
```json
{"status":"healthy","timestamp":"...","environment":"production"}
```

### From VPS command line:

```bash
# Test homepage
curl -I http://websitedesigningcompetition.com

# Test API
curl http://websitedesigningcompetition.com/api/health
```

---

## Step 6: Setup SSL Certificate (HTTPS)

**Important:** Make sure your DNS is configured first!

### Check DNS is propagated:
```bash
ping websitedesigningcompetition.com
```

Should return your VPS IP address.

### Install Certbot (if not already installed):
```bash
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx
```

### Obtain SSL Certificate:
```bash
sudo certbot --nginx -d websitedesigningcompetition.com -d www.websitedesigningcompetition.com
```

**Interactive prompts:**
1. **Email address:** Enter your email
2. **Terms of Service:** Type `A` to agree
3. **Share email:** Type `N` (or `Y` if you want)
4. **Redirect HTTP to HTTPS:** Type `2` (recommended)

**Expected output:**
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/websitedesigningcompetition.com/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/websitedesigningcompetition.com/privkey.pem
Congratulations! You have successfully enabled HTTPS!
```

### Test SSL auto-renewal:
```bash
sudo certbot renew --dry-run
```

**Expected output:**
```
Congratulations, all simulated renewals succeeded
```

---

## Step 7: Verify HTTPS is Working

### In browser:
```
https://websitedesigningcompetition.com
```

**Should show:**
- 🔒 Padlock in address bar
- Website loads over HTTPS

### Test HTTP redirect:
```
http://websitedesigningcompetition.com
```

**Should automatically redirect to:** `https://websitedesigningcompetition.com`

### From VPS:
```bash
# Test HTTPS
curl -I https://websitedesigningcompetition.com

# Should show: HTTP/2 200
```

---

## Troubleshooting

### Issue: "Connection refused"
**Solution:**
```bash
# Check if Nginx is running
sudo systemctl status nginx

# If not running:
sudo systemctl start nginx
```

### Issue: "502 Bad Gateway"
**Solution:**
```bash
# Check if backend is running
pm2 status

# If not running:
cd /var/www/kids-competition/backend
pm2 start ecosystem.config.js
```

### Issue: "404 Not Found"
**Solution:**
```bash
# Check if dist folder exists
ls -la /var/www/kids-competition/dist/

# If not, rebuild frontend:
cd /var/www/kids-competition
npm install
npm run build
```

### Issue: "nginx: [emerg] could not build server_names_hash"
**Solution:**
```bash
# Edit nginx.conf
sudo nano /etc/nginx/nginx.conf

# Add this line in the http block:
server_names_hash_bucket_size 64;

# Save and test
sudo nginx -t
sudo systemctl reload nginx
```

### Issue: Certbot fails with "DNS problem"
**Solution:**
- Verify DNS is pointing to VPS IP
- Wait 30-60 minutes for DNS propagation
- Check: `dig websitedesigningcompetition.com`

---

## Quick Commands Reference

```bash
# Test Nginx config
sudo nginx -t

# Reload Nginx (no downtime)
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# View Nginx error logs
sudo tail -f /var/log/nginx/kids-competition-error.log

# View Nginx access logs
sudo tail -f /var/log/nginx/kids-competition-access.log

# Check SSL certificate
sudo certbot certificates

# Renew SSL certificate
sudo certbot renew
```

---

## Configuration Summary

**Domain:** websitedesigningcompetition.com (and www subdomain)
**Backend Port:** 3000 (proxied from Nginx)
**Frontend Path:** /var/www/kids-competition/dist
**SSL Certificate:** /etc/letsencrypt/live/websitedesigningcompetition.com/
**Nginx Config:** /etc/nginx/sites-available/kids-competition
**Logs:** /var/log/nginx/kids-competition-*.log

---

## Next Steps After Nginx Setup

1. ✅ Nginx configured and running
2. ✅ Website accessible via HTTP
3. ✅ SSL certificate installed
4. ✅ HTTPS working with auto-redirect

**Now proceed with:**
- Testing registration form
- Testing file uploads
- Testing email sending
- Configuring SPF/DKIM records

See: **HOSTINGER_VPS_DEPLOYMENT.md** Phase 8 for complete testing procedures.

---

**Installation Complete! Your website is live at https://websitedesigningcompetition.com 🎉**
