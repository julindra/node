const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
	const html = `
	<a href="/all">All Files</a>
	<form action="/" method="POST" enctype="multipart/form-data">
	<input type="file" name="image">
	<input type="submit">
	</form>`;

	res.send(html);
});

app.post('/', (req, res) => {
	const storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, 'public/images/')
		},
		filename: function (req, file, cb) {
			cb(null, Date.now() + path.extname(file.originalname))
		}
	});

	const upload = multer({ storage: storage }).single('image');

	upload(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			res.send(err);
		} else if (err) {
			res.send(err);
		} else {
			res.redirect('/all');
		}
	});
});

app.get('/all', (req, res) => {
	let html = '<ul>';
	fs.readdirSync('./public/images').forEach(file => {
		html += `<li><a href="/images/${file}">${file}</a></li>`;
	});
	html += '</ul>';

	res.send(html);
});

app.listen(PORT, () => {
	console.log(`Listening on PORT ${PORT}`);
});