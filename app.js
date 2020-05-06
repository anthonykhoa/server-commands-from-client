const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { exec } = require('child_process')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))


//split by spaces, then check first index to see if match
//if arr.length ===3 itx bad
//make req.command property

const validCommand = (command) => {
	if (command === 'ls' || command === 'pwd' || command === 'cat') {
		return true;
	}
	return false;
}

const gottaSanitize = (req, res, next) => {
	//turns command string into arr, then filter out spaces
	req.command = req.body.command.split(' ').filter(e => e !== '')
	//we dont want crazy commands, just simple ones
	if (req.command.length > 2 || !validCommand(req.command[0])) {
		return res.json('I WONT LET U DO DAT COMMAND >:D');
	}
	//turn back into string
	req.command = req.command.join(' ');
	next()
}

app.post('/commands', gottaSanitize, (req, res) => {
	console.log(req.body.command)
	exec(req.body.command, { timeout: 2000 }, (err, stdout, stderr) => {
		console.log(stdout)
		res.json(err ? err.message : stdout);
	})
	
});

app.get('/commands', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(process.env.PORT || 8123);
