# Fix Both Websites to Run Simultaneously

## Goal
Fix the `kidrove` config error so both websites run at the same time on the same VPS.

---

## Step 1: Check the Kidrove Config Error

```bash
# View the kidrove config to see line 2
sudo nano /etc/nginx/sites-available/kidrove

# Or view just the first few lines
sudo head -n 10 /etc/nginx/sites-available/kidrove
```

**Look at line 2** - the error says: `unknown directive " Frontend"`

**Common causes:**
- Line 2 might have: ` Frontend` (with a leading space, not a comment)
- Should be: `# Frontend` (with # for comment)
- Or it could be malformed text

---

## Step 2: Fix the Kidrove Config

**Option A: If line 2 is a malformed comment**

```bash
sudo nano /etc/nginx/sites-available/kidrove

# Find line 2 that has " Frontend" or similar
# Change it to:
# Frontend

# Or delete the line if it's not needed

# Save: Ctrl+O, Enter, Ctrl+X
```

**Option B: View and send me the first 20 lines**

If you're not sure what to fix, show me the first 20 lines:

```bash
sudo head -n 20 /etc/nginx/sites-available/kidrove
```

Copy the output and I'll tell you exactly what to fix.

---

## Step 3: Test Nginx Config

```bash
# After fixing, test
sudo nginx -t
```

**Expected output:**
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

---

## Step 4: Ensure Both Sites Have Different Domains

For both sites to run, they need different `server_name` values.

**Check kidrove domain:**
```bash
sudo grep "server_name" /etc/nginx/sites-available/kidrove
```

**Check website-design domain:**
```bash
sudo grep "server_name" /etc/nginx/sites-available/website-design
```

**They should be DIFFERENT:**
- kidrove: `server_name kidrove.com www.kidrove.com;` (example)
- website-design: `server_name websitedesigningcompetition.com www.websitedesigningcompetition.com;`

**If they're the same domain**, you'll have a conflict. Let me know what domains you want for each site.

---

## Step 5: Enable Both Configs

```bash
# Make sure both are enabled
sudo ln -s /etc/nginx/sites-available/kidrove /etc/nginx/sites-enabled/kidrove
sudo ln -s /etc/nginx/sites-available/website-design /etc/nginx/sites-enabled/website-design

# Verify both are enabled
ls -la /etc/nginx/sites-enabled/
# Should show: kidrove and website-design
```

---

## Step 6: Reload Nginx

```bash
sudo systemctl reload nginx

# Verify nginx is running
sudo systemctl status nginx
```

---

## Step 7: Test Both Websites

```bash
# Test kidrove (replace with actual domain)
curl -I http://kidrove-domain.com

# Test website-design
curl -I http://websitedesigningcompetition.com
```

---

## Common Scenarios

### Scenario 1: Different Domains (Recommended)
```
kidrove.com          → /var/www/kidrove
websitedesigningcompetition.com → /var/www/websitedesigncompetition
```

Both sites work on port 80/443, different domains.

### Scenario 2: Same Domain, Different Paths
If you only have one domain, you can serve both on different paths:
```
yourdomain.com/         → website-design
yourdomain.com/kidrove/ → kidrove
```

This requires modifying both configs.

### Scenario 3: Different Ports
```
yourdomain.com:80    → website-design
yourdomain.com:8080  → kidrove
```

Not recommended (requires firewall changes).

---

## Quick Diagnostic Commands

Run these to help me understand your setup:

```bash
# 1. Show kidrove config (first 30 lines)
echo "=== KIDROVE CONFIG ===" && sudo head -n 30 /etc/nginx/sites-available/kidrove

# 2. Show website-design config (first 30 lines)
echo "=== WEBSITE-DESIGN CONFIG ===" && sudo head -n 30 /etc/nginx/sites-available/website-design

# 3. Show enabled sites
echo "=== ENABLED SITES ===" && ls -la /etc/nginx/sites-enabled/

# 4. Test nginx
echo "=== NGINX TEST ===" && sudo nginx -t
```

---

## What I Need from You

To fix both sites, please run these commands and send me the output:

```bash
# Show the error in kidrove config
sudo head -n 10 /etc/nginx/sites-available/kidrove
```

Then I can tell you exactly what to change on line 2!

**Also tell me:**
1. What domain does `kidrove` use? (e.g., kidrove.com)
2. What domain does `website-design` use? (websitedesigningcompetition.com)
3. Are they different domains or the same?

Once I know this, I can give you the exact fix! 🎯
