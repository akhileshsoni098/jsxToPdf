/*  const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const pdf = require('html-pdf'); 
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to convert HTML/CSS to PDF
app.get('/', async (req, res) => {
  try {
    // Read the content of index.html synchronously
    const htmlTemplate = fs.readFileSync(__dirname + '/demo/demo/index.html', 'utf8'); 

    const { cssStyles } = req.body;  

    const options = {
      format: 'Letter', 
      border: '10mm',
      
    };

    // Combine HTML template and CSS styles
    const finalHtml = `<style>${cssStyles}</style>${htmlTemplate}`;

    // Generate PDF from the HTML template
    pdf.create(finalHtml, options).toStream((err, pdfStream) => {
      if (err) {
        console.error('Error generating PDF:', err);
        res.status(500).send('Error generating PDF');
        return;
      }

      // Set response headers for PDF content
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="generated.pdf"');

      // Pipe the PDF stream to the response
      pdfStream.pipe(res);

      pdfStream.on('end', () => {
        console.log('PDF created and sent successfully');
        res.end();
      });
    });
  } catch (err) {
    console.error('Error generating PDF:', err);
    res.status(500).send('Error generating PDF');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
 







 */


const express = require('express');
const fs = require('fs');

const bodyParser = require('body-parser');
const pdf = require('html-pdf');
const multer = require('multer');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint to upload HTML file and convert to PDF

app.get("/", async (req, res) => {
  try {
      const filePath = path.join(__dirname, "htmlToPdf.html");
      res.sendFile(filePath);
  } catch (error) {
      console.error("Error sending file:", error);
      res.status(500).send("Error sending the file");
  }
});


app.post('/upload', upload.single('htmlFile'), async (req, res) => {
  try {
    const htmlBuffer = req.file.buffer.toString('utf-8');
    const { cssStyles } = req.body;

    const options = {
      format: 'Letter',
      border: '10mm',
    };

    const finalHtml = `<style>${cssStyles}</style>${htmlBuffer}`;

    pdf.create(finalHtml, options).toStream((err, pdfStream) => {
      if (err) {
        console.error('Error generating PDF:', err);
        res.status(500).send('Error generating PDF');
        return;
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="generated.pdf"');

      pdfStream.pipe(res);

      pdfStream.on('end', () => {
        console.log('PDF created and sent successfully');
        res.end();
      });
    });
  } catch (err) {
    console.error('Error generating PDF:', err);
    res.status(500).send('Error generating PDF');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
