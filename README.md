# 🎯 Certi-Batch

**Modern Bulk Certificate Generator**

> A clean, professional tool for generating personalized certificates in bulk.

---

## 📖 Overview

Certi-Batch is a 100% client-side web application that allows you to generate multiple personalized certificates from a template image and a CSV list of names. Built with a modern, minimalist design inspired by professional SaaS platforms.

### ✨ Key Features

- 🎨 **Modern Clean Design**: Professional interface with soft shadows and rounded corners
- 🖱️ **Drag-and-Drop**: Easy file uploads and visual text positioning
- 📊 **CSV Batch Processing**: Generate hundreds of certificates in seconds
- 💾 **Client-Side Only**: No server required, all processing in your browser
- 📦 **ZIP Export**: Download all certificates in a single file
- 🎯 **Customizable**: Adjust font size, color, and style

---

## 🚀 Quick Start

### 1. Open the Application
Open `index.html` in any modern web browser.

### 2. Upload Template
Click or drag-and-drop your certificate template (JPG or PNG).

### 3. Upload CSV
Prepare a CSV file with a `name` column:

```csv
name
Ahmad Wijaya
Siti Nurhaliza
Budi Santoso
```

### 4. Position Text
Drag the text overlay to position where names should appear.

### 5. Customize
Adjust font size, color, and style to match your template.

### 6. Generate
Click "Generate Certificates" and download the ZIP file.

---

## 🎨 Design System

### Color Palette
- **Primary**: Modern Indigo (#6366f1)
- **Background**: Clean White (#ffffff)
- **Text**: Dark Gray (#1f2937)
- **Borders**: Light Gray (#e5e7eb)

### Typography
- **Font Family**: Inter
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

---

## 📁 Project Structure

```
SertifGenarator/
├── index.html          # Main application
├── style.css           # Modern styling
├── script.js           # Core functionality
├── sample_names.csv    # Sample data
└── README.md           # This file
```

---

## 🛠️ Technical Details

### Technologies
- **HTML5 Canvas**: Image manipulation
- **Vanilla JavaScript**: Core logic
- **Modern CSS**: Clean styling with shadows and animations
- **PapaParse** (CDN): CSV parsing
- **JSZip** (CDN): ZIP file generation

### Browser Requirements
- Modern browser with HTML5 Canvas support
- JavaScript enabled
- Recommended: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+

### Features
- ✅ 100% client-side processing
- ✅ No server required
- ✅ Privacy-friendly (data stays on your device)
- ✅ Responsive design
- ✅ Drag-and-drop file uploads
- ✅ Real-time preview

---

## 💡 Usage Tips

1. **High-Quality Templates**: Use high-resolution images for best results
2. **Font Size**: Start with 40px and adjust based on your template
3. **Positioning**: Drag the text precisely where you want names to appear
4. **CSV Format**: Ensure your CSV has a `name` column (or `nama`)
5. **Batch Size**: Can efficiently handle hundreds of names

---

## 🎯 Use Cases

- 📜 Educational certificates
- 🏆 Competition awards  
- 🎓 Course completion certificates
- 🎉 Event participation certificates
- 🏅 Achievement recognitions
- 🎁 Personalized vouchers

---

## 📱 Responsive Design

The application works seamlessly across:
- 🖥️ Desktop computers
- 💻 Laptops
- 📱 Tablets
- 📲 Mobile devices (portrait/landscape)

---

## 🔧 Customization

Want to modify the design? Edit `style.css`:

```css
:root {
    --primary: #6366f1;         /* Primary accent color */
    --bg-white: #ffffff;        /* Background color */
    --text-dark: #1f2937;       /* Text color */
    --radius: 12px;             /* Border radius */
}
```

---

## ⚡ Performance

- Lightweight CSS (no heavy frameworks)
- Minimal JavaScript overhead
- Efficient canvas rendering
- Client-side processing (no server delays)

---

## 📝 License

This project is provided for educational and personal use.

---

## 🌟 Credits

- **Design**: Modern minimalist inspired by Vercel, Stripe, Notion
- **Fonts**: Google Fonts (Inter)
- **Icons**: Heroicons (SVG)
- **Libraries**: PapaParse, JSZip

---

## 🤝 Support

For issues or questions:
1. Review the inline instructions in the application
2. Check the code comments for technical details
3. Ensure your CSV format is correct

---

**Made with ❤️ for efficient certificate generation**
