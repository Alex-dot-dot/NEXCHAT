# 🖼️ Chronex AI Image Vision - Quick Reference

## 🔗 API Endpoints

### Upload & Analyze
```bash
# Just upload
POST /ai/upload-image
Form: image (binary file)

# Upload + AI Analysis
POST /ai/scan-image
Form: image (binary file)

# Analyze existing
POST /ai/analyze-image
JSON: { "filepath": "...", "use_ai": true }
```

### Vision Queries
```bash
# Ask custom questions
POST /ai/image-vision
JSON: { "filepath": "...", "question": "..." }

# List all images
GET /ai/image-list

# Delete image
DELETE /ai/image-delete/<filename>
```

---

## 📦 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Image scanned and analyzed",
  "analysis": "Detailed AI analysis...",
  "filepath": "uploads/images/timestamp_filename.jpg",
  "method": "OpenAI Vision (GPT-4V)",
  "timestamp": "2024-01-15T12:05:30.123456"
}
```

### Error Response
```json
{
  "error": "Error message",
  "success": false
}
```

---

## 🎯 Message Type Keywords

Say any of these to trigger image handler:
- "image", "photo", "picture"
- "scan", "analyze image"
- "vision", "ocr"
- "text recognition"

---

## 💻 Code Examples

### JavaScript (Upload & Scan)
```javascript
const form = new FormData();
form.append('image', fileInput.files[0]);

fetch('/ai/scan-image', { method: 'POST', body: form })
  .then(r => r.json())
  .then(data => console.log(data.analysis));
```

### JavaScript (Vision Query)
```javascript
fetch('/ai/image-vision', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    filepath: 'uploads/images/photo.jpg',
    question: 'What is in this image?'
  })
}).then(r => r.json()).then(data => console.log(data.response));
```

### Python
```python
import requests

# Upload & scan
with open('photo.jpg', 'rb') as f:
    r = requests.post('http://localhost:5000/ai/scan-image', 
                      files={'image': f})
    print(r.json()['analysis'])

# Vision query
r = requests.post('http://localhost:5000/ai/image-vision', json={
    'filepath': 'uploads/images/photo.jpg',
    'question': 'Describe this image'
})
print(r.json()['response'])
```

### cURL
```bash
# Upload & analyze
curl -X POST -F "image=@photo.jpg" \
  http://localhost:5000/ai/scan-image

# Vision query
curl -X POST -H "Content-Type: application/json" \
  -d '{"filepath":"uploads/images/photo.jpg","question":"What is this?"}' \
  http://localhost:5000/ai/image-vision

# List images
curl http://localhost:5000/ai/image-list

# Delete
curl -X DELETE http://localhost:5000/ai/image-delete/filename.jpg
```

---

## ⚙️ Configuration

### .env
```bash
ENABLE_VISION=true
OPENAI_API_KEY=sk-your-key
OPENAI_MODEL=gpt-4-vision-preview
```

### Storage
- Default: `uploads/images/`
- File limit: 10MB
- Formats: PNG, JPG, GIF, WEBP, BMP

---

## 🧪 Testing

1. Open `image-vision-tester.html` in browser
2. Upload an image
3. Click "Scan Image"
4. Ask questions in vision query section
5. View all uploaded images
6. Delete test images

---

## ✅ Features

| Feature | Support |
|---------|---------|
| Upload | ✅ Yes |
| AI Analysis | ✅ OpenAI GPT-4V |
| OCR | ✅ Yes (with AI) |
| Object Detection | ✅ Yes (with AI) |
| Custom Questions | ✅ Yes |
| Fallback | ✅ PIL Basic Analysis |

---

## 🚨 Error Solutions

| Problem | Solution |
|---------|----------|
| File type not allowed | Use PNG, JPG, GIF, WEBP, BMP |
| File too large | Compress to under 10MB |
| OpenAI error | Check API key in .env |
| Image not found | Copy filepath from upload response |

---

## 📊 Class Structure

```python
class ImageProcessor:
    def __init__(upload_dir="uploads/images")
    def allowed_file(filename) → bool
    def save_image(file) → (filepath, status)
    def get_image_base64(filepath) → str
    def analyze_image_openai(filepath) → str
    def analyze_image_basic(filepath) → str
```

---

## 🔄 Processing Flow

```
User Upload Image
    ↓
ImageProcessor.save_image()
    ↓
Validate format & size
    ↓
Store with timestamp
    ↓
analyze_image_openai() OR analyze_image_basic()
    ↓
Return analysis + filepath
    ↓
Display to user
```

---

## 🌟 Advanced Usage

### Batch Upload & Analyze
```python
import os
for img_file in os.listdir('images/'):
    with open(f'images/{img_file}', 'rb') as f:
        r = requests.post('/ai/scan-image', files={'image': f})
        print(f"{img_file}: {r.json()['analysis'][:100]}...")
```

### Custom Vision Questions
```javascript
const questions = [
  "What objects do you see?",
  "What colors are dominant?",
  "Is there text? What does it say?",
  "Describe the composition"
];

for (const q of questions) {
  const res = await fetch('/ai/image-vision', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filepath, question: q })
  });
  console.log(q + ": " + (await res.json()).response);
}
```

---

## 📁 Files Modified/Created

✅ **chronex-ai-python-backend.py** - Added ImageProcessor + endpoints
✅ **IMAGE-PROCESSING-GUIDE.md** - Complete documentation
✅ **image-vision-tester.html** - Interactive tester interface
✅ **CHRONEX-IMAGE-VISION-UPDATE.md** - Feature summary

---

## 🚀 Getting Started

1. Ensure dependencies: `pip install pillow openai`
2. Set OPENAI_API_KEY in .env
3. Run backend: `python chronex-ai-python-backend.py`
4. Open `image-vision-tester.html`
5. Upload and analyze images!

---

## 💪 Production Ready

✅ Error handling
✅ File validation
✅ Size limits
✅ Fallback support
✅ Security checks
✅ Logging
✅ Graceful degradation

---

**Created by:** DEMON ALEX
**Platform:** NEXCHAT - The Future is Initialized! 🚀
