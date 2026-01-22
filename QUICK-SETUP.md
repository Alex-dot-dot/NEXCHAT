# ⚡ QUICK SETUP GUIDE
## Get Image Vision Working in 5 Minutes

---

## 🎯 Goal
Get Chronex AI image upload and vision analysis running locally.

---

## ⏱️ 5-Minute Setup

### Step 1: Install (1 minute)
```bash
pip install pillow openai
```

### Step 2: Get API Key (1 minute)
1. Go to https://platform.openai.com/api-keys
2. Create API key
3. Copy your key

### Step 3: Configure (1 minute)
Create `.env` file in `NEXCHAT` folder:
```
OPENAI_API_KEY=sk-paste-your-key-here
ENABLE_VISION=true
AI_PROVIDER=openai
```

### Step 4: Start (1 minute)
```bash
python chronex-ai-python-backend.py
```

### Step 5: Test (1 minute)
Open `image-vision-tester.html` in your browser!

---

## ✅ Verify It Works

### Check 1: Upload Image
1. Click "Select Image File"
2. Choose any image (PNG, JPG, GIF, WEBP)
3. Click "Scan Image"
4. Wait 2-10 seconds
5. See AI analysis! ✅

### Check 2: Ask Questions
1. Image path auto-filled from upload
2. Type a question: "What colors are in this image?"
3. Click "Ask AI"
4. Get AI response! ✅

### Check 3: List Images
1. Click "Load Images"
2. See all uploaded images ✅

---

## 🚀 You're Done!

Everything is working. Start uploading and analyzing images!

---

## 📚 Learn More

- **Full Guide**: `IMAGE-PROCESSING-GUIDE.md`
- **Quick Ref**: `IMAGE-VISION-QUICK-REFERENCE.md`
- **API Docs**: `CHRONEX-API-ENDPOINTS.md`

---

## 🆘 If Something Doesn't Work

### Error: "File type not allowed"
→ Use PNG, JPG, GIF, WEBP, or BMP

### Error: "OpenAI not available"
→ Check OPENAI_API_KEY in .env file

### Error: "No image file provided"
→ Make sure you selected a file before clicking

### Server won't start
→ Make sure Python 3.8+ is installed
→ Run `pip install flask flask-cors pillow openai`

---

## 💡 Pro Tips

1. **Compress images** for faster uploads
2. **Use JPEG** for photos (best quality)
3. **Ask specific questions** for better answers
4. **Check uploads/images/** to see saved files

---

## 🎯 Example Workflow

```
1. Upload vacation photo
2. AI describes everything it sees
3. Ask: "What people are in this photo?"
4. Get detailed response
5. Ask: "What is the weather like?"
6. Get weather analysis
```

---

## ✨ That's It!

You now have a working image vision system!

**Next Steps:**
- [ ] Upload your first image
- [ ] Ask it a question
- [ ] Read IMAGE-PROCESSING-GUIDE.md for details
- [ ] Build something cool!

---

🚀 **Enjoy Chronex AI Image Vision!**

*For help: demonalexander526@gmail.com*
