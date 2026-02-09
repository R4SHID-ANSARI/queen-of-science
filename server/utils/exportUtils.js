const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow } = require('docx');

// Ensure exports directory exists
const exportsDir = path.join(__dirname, '..', 'exports');
if (!fs.existsSync(exportsDir)) {
  fs.mkdirSync(exportsDir);
}

// Export articles to PDF
async function exportArticlesToPDF(articles, filename) {
  const filePath = path.join(exportsDir, filename);
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(filePath));

  // Title
  doc.fontSize(20).text('Queen of Science - Articles Export', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
  doc.moveDown(2);

  articles.forEach((article, index) => {
    doc.fontSize(16).text(`Article ${index + 1}: ${article.title}`, { underline: true });
    doc.moveDown();
    doc.fontSize(10).text(`Author: ${article.author} | Date: ${new Date(article.date).toLocaleDateString()}`);
    doc.moveDown();
    doc.fontSize(12).text(article.content);
    doc.moveDown();

    if (article.replies && article.replies.length > 0) {
      doc.fontSize(14).text('Replies:', { underline: true });
      article.replies.forEach((reply, replyIndex) => {
        doc.fontSize(10).text(`${replyIndex + 1}. ${reply.author}: ${reply.text}`);
        doc.moveDown(0.5);
      });
    }

    doc.moveDown(2);
    if (index < articles.length - 1) {
      doc.addPage();
    }
  });

  doc.end();
  return filePath;
}

// Export articles to Excel
async function exportArticlesToExcel(articles, filename) {
  const filePath = path.join(exportsDir, filename);
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Articles');

  // Add headers
  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Title', key: 'title', width: 30 },
    { header: 'Author', key: 'author', width: 20 },
    { header: 'Content', key: 'content', width: 50 },
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Replies Count', key: 'repliesCount', width: 15 }
  ];

  // Style headers
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE6E6FA' }
  };

  // Add data
  articles.forEach(article => {
    worksheet.addRow({
      id: article.id,
      title: article.title,
      author: article.author,
      content: article.content.substring(0, 500) + (article.content.length > 500 ? '...' : ''),
      date: new Date(article.date).toLocaleDateString(),
      repliesCount: article.replies ? article.replies.length : 0
    });
  });

  // Add replies sheet if needed
  if (articles.some(a => a.replies && a.replies.length > 0)) {
    const repliesSheet = workbook.addWorksheet('Replies');
    repliesSheet.columns = [
      { header: 'Article ID', key: 'articleId', width: 15 },
      { header: 'Article Title', key: 'articleTitle', width: 30 },
      { header: 'Reply Author', key: 'author', width: 20 },
      { header: 'Reply Text', key: 'text', width: 50 },
      { header: 'Reply Date', key: 'date', width: 15 }
    ];

    repliesSheet.getRow(1).font = { bold: true };
    repliesSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6E6FA' }
    };

    articles.forEach(article => {
      if (article.replies) {
        article.replies.forEach(reply => {
          repliesSheet.addRow({
            articleId: article.id,
            articleTitle: article.title,
            author: reply.author,
            text: reply.text,
            date: new Date(reply.date).toLocaleDateString()
          });
        });
      }
    });
  }

  await workbook.xlsx.writeFile(filePath);
  return filePath;
}

// Export articles to Word
async function exportArticlesToWord(articles, filename) {
  const filePath = path.join(exportsDir, filename);

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: "Queen of Science - Articles Export",
              bold: true,
              size: 32
            })
          ],
          alignment: 'center'
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Generated on: ${new Date().toLocaleString()}`,
              size: 20
            })
          ],
          alignment: 'center'
        }),
        new Paragraph({ text: "" })
      ].concat(
        articles.flatMap((article, index) => [
          new Paragraph({
            children: [
              new TextRun({
                text: `Article ${index + 1}: ${article.title}`,
                bold: true,
                size: 24
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Author: ${article.author} | Date: ${new Date(article.date).toLocaleDateString()}`,
                size: 18
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: article.content,
                size: 22
              })
            ]
          }),
          ...(article.replies && article.replies.length > 0 ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Replies:",
                  bold: true,
                  size: 20
                })
              ]
            }),
            ...article.replies.map(reply =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${reply.author}: ${reply.text}`,
                    size: 18
                  })
                ],
                indent: { left: 720 }
              })
            )
          ] : []),
          new Paragraph({ text: "" })
        ])
      )
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

// Export questions to PDF
async function exportQuestionsToPDF(questions, filename) {
  const filePath = path.join(exportsDir, filename);
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text('Queen of Science - Questions Export', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
  doc.moveDown(2);

  questions.forEach((question, index) => {
    doc.fontSize(16).text(`Question ${index + 1}: ${question.title}`, { underline: true });
    doc.moveDown();
    doc.fontSize(10).text(`Author: ${question.author} | Date: ${new Date(question.date).toLocaleDateString()}`);
    doc.moveDown();
    doc.fontSize(12).text(question.content);
    doc.moveDown();

    if (question.replies && question.replies.length > 0) {
      doc.fontSize(14).text('Replies:', { underline: true });
      question.replies.forEach((reply, replyIndex) => {
        doc.fontSize(10).text(`${replyIndex + 1}. ${reply.author}: ${reply.text}`);
        doc.moveDown(0.5);
      });
    }

    doc.moveDown(2);
    if (index < questions.length - 1) {
      doc.addPage();
    }
  });

  doc.end();
  return filePath;
}

// Export questions to Excel
async function exportQuestionsToExcel(questions, filename) {
  const filePath = path.join(exportsDir, filename);
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Questions');

  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Title', key: 'title', width: 30 },
    { header: 'Author', key: 'author', width: 20 },
    { header: 'Content', key: 'content', width: 50 },
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Replies Count', key: 'repliesCount', width: 15 }
  ];

  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE6E6FA' }
  };

  questions.forEach(question => {
    worksheet.addRow({
      id: question.id,
      title: question.title,
      author: question.author,
      content: question.content.substring(0, 500) + (question.content.length > 500 ? '...' : ''),
      date: new Date(question.date).toLocaleDateString(),
      repliesCount: question.replies ? question.replies.length : 0
    });
  });

  if (questions.some(q => q.replies && q.replies.length > 0)) {
    const repliesSheet = workbook.addWorksheet('Replies');
    repliesSheet.columns = [
      { header: 'Question ID', key: 'questionId', width: 15 },
      { header: 'Question Title', key: 'questionTitle', width: 30 },
      { header: 'Reply Author', key: 'author', width: 20 },
      { header: 'Reply Text', key: 'text', width: 50 },
      { header: 'Reply Date', key: 'date', width: 15 }
    ];

    repliesSheet.getRow(1).font = { bold: true };
    repliesSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6E6FA' }
    };

    questions.forEach(question => {
      if (question.replies) {
        question.replies.forEach(reply => {
          repliesSheet.addRow({
            questionId: question.id,
            questionTitle: question.title,
            author: reply.author,
            text: reply.text,
            date: new Date(reply.date).toLocaleDateString()
          });
        });
      }
    });
  }

  await workbook.xlsx.writeFile(filePath);
  return filePath;
}

// Export users to Excel
async function exportUsersToExcel(users, filename) {
  const filePath = path.join(exportsDir, filename);
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Users');

  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Unique ID Name', key: 'uniqueId', width: 20 },
    { header: 'Email/Phone', key: 'emailOrPhone', width: 25 },
    { header: 'User Type', key: 'userType', width: 15 },
    { header: 'Name', key: 'name', width: 20 },
    { header: 'Age', key: 'age', width: 10 },
    { header: 'College', key: 'college', width: 25 },
    { header: 'Articles Count', key: 'articlesCount', width: 15 },
    { header: 'Questions Count', key: 'questionsCount', width: 15 },
    { header: 'Registration Date', key: 'registrationDate', width: 20 }
  ];

  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE6E6FA' }
  };

  users.forEach(user => {
    worksheet.addRow({
      id: user.id,
      uniqueId: user.uniqueId,
      emailOrPhone: user.email || user.phone,
      userType: user.userType,
      name: user.name || '',
      age: user.age || '',
      college: user.college || '',
      articlesCount: user.articlesCount || 0,
      questionsCount: user.questionsCount || 0,
      registrationDate: new Date(user.registrationDate).toLocaleDateString()
    });
  });

  await workbook.xlsx.writeFile(filePath);
  return filePath;
}

module.exports = {
  exportArticlesToPDF,
  exportArticlesToExcel,
  exportArticlesToWord,
  exportQuestionsToPDF,
  exportQuestionsToExcel,
  exportUsersToExcel
};
