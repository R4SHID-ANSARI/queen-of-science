# Queen of Science

A modern, contemporary web application for academic collaboration and knowledge sharing.

## 🌟 Features

### Authentication System
- **Two User Types**: Member and Student login portals
- **Flexible Login**: Via Unique ID, Email, or Phone + Password
- **Secure Signup**: Email/Phone, Unique ID Name, Password
- **Data Security**: Server-side JSON storage accessible only by admin

### Main Interface
- **4 Horizontal Tabs** with distinct bold colors:
  - **Latest Articles**: Open upload/edit with reply threads
  - **Question of the Day**: Members upload, public view/reply
  - **Champions of Sociology**: Leaderboard sorted by article count, top 10 highlighted
  - **About Site**: Member-only admin dashboard with editable rules/regulations/ownership

### Interactive Elements
- **Circular Image Slider**: Members can upload images with italic descriptions
- **Top Picks Section**: 5-6 bold article headings with 2-sentence previews
- **Reply System**: Threaded responses for articles and questions

### Modern Design
- **Book Texture Background**: Creme/parchment subtle grain on landing page
- **Elegant Typography**: Serif headings, Sans-serif body text
- **Smooth Animations**: Hover effects, transitions, sliding gallery
- **Responsive Layout**: Flexbox/Grid contemporary design

### Admin Features
- **Data Export System**: PDF, Excel, Word export for articles, questions, users
- **Content Management**: Editable rules, regulations, and ownership
- **File Management**: Download/delete exported files

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/queen-of-science.git
   cd queen-of-science
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Start the application**

   **Terminal 1 - Backend:**
   ```bash
   cd server
   npm start
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd client
   npm start
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

### Default Login Credentials
- **Unique ID**: `admin`
- **Password**: `admin123`
- **User Type**: Member

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling with Flexbox/Grid

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Express Session** - Session management
- **CORS** - Cross-origin resource sharing
- **JSON Files** - Data storage (development)

### Additional Libraries
- **PDFKit** - PDF generation
- **ExcelJS** - Excel file creation
- **Docx** - Word document creation
- **Multer** - File upload handling
- **UUID** - Unique identifier generation

## 📁 Project Structure

```
queen-of-science/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── styles/         # CSS files
│   │   └── App.js
│   └── package.json
├── server/                 # Express backend
│   ├── data/               # JSON data files
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   ├── server.js           # Main server file
│   └── package.json
├── .gitignore
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Articles
- `GET /api/articles` - Get all articles
- `POST /api/articles` - Create new article
- `PUT /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article
- `POST /api/articles/:id/reply` - Add reply to article

### Questions
- `GET /api/questions` - Get question of the day
- `POST /api/questions` - Create question (Members only)
- `POST /api/questions/:id/reply` - Add reply to question

### Leaderboard
- `GET /api/leaderboard` - Get champions leaderboard

### Admin
- `GET /api/admin/data` - Get admin data
- `PUT /api/admin/data` - Update admin data

### Images
- `GET /api/images` - Get all images
- `POST /api/images` - Upload image (Members only)

### Export
- `POST /api/export/articles/pdf` - Export articles to PDF
- `POST /api/export/articles/excel` - Export articles to Excel
- `POST /api/export/articles/word` - Export articles to Word
- `POST /api/export/questions/pdf` - Export questions to PDF
- `POST /api/export/questions/excel` - Export questions to Excel
- `POST /api/export/users/excel` - Export users to Excel
- `GET /api/export/files` - Get exported files list
- `GET /api/export/download/:filename` - Download exported file
- `DELETE /api/export/files/:filename` - Delete exported file

## 🎨 Design Philosophy

The application embraces a "Scholar's Archive" aesthetic with:
- **Book-like texture** backgrounds
- **Elegant serif typography** for headings
- **Clean sans-serif** for body text
- **Contemporary color schemes** with distinct tab colors
- **Smooth animations** and micro-interactions
- **Responsive design** that works on all devices

## 🔒 Security Features

- **Session-based authentication**
- **CORS protection**
- **Input validation**
- **Permission-based access control**
- **Secure file upload handling**

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [Your GitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Inspired by academic collaboration platforms
- Built with modern web technologies
- Designed for educational excellence

---

**Visit the live site at: [queen-of-science.com](https://queen-of-science.com)**
