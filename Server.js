var express = require('express');
var app = express();
var fs = require('fs');

app.get('/index.html', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
});
app.get('/updateCount', function(request, response) {
	fs.readFile('counter.csv', function(err, data) {
		if(data == null || data.toString() == '') {
			let lines = [];
			updateCountInFile(lines, -1, request.query.keyName, 1);
		}
		else {
			let lines = data.toString().replace(/ /g,'').split("\n");
			let obj = getIndexAndCountForKey(lines, request.query.keyName);
			updateCountInFile(lines, obj.index, request.query.keyName, (obj.count+1));
		}
		response.send(request.query.keyName);
  });
});
app.listen(8082);
function getIndexAndCountForKey(lines, keyName) {
	var front = 0;
	var back = lines.length -1;
	while(front <= back) {
		if(lines[front].split(',')[0] == keyName)
			return {index : front, count : parseInt(lines[front].split(',')[1])};
		if(lines[back].split(',')[0] == keyName)
			return {index : back, count : parseInt(lines[back].split(',')[1])};
		front++;
		back--;
	}
	return {index : -1, count : 0};
}
 function updateCountInFile(lines, index, keyName, updatedCount) {
	 let str = '';
	 if(index == -1) {
		 str = keyName+','+updatedCount;
		 lines.push(str);
	 }
	 else {
		 str = keyName+','+updatedCount;
		 lines[index] = str;
	 }
	 let fileData = lines.join('\n');
	 console.log(index +" "+ fileData);
	 if(fileData.substring(fileData.length-1, fileData.length) == '\n')
		 fileData = fileData.substring(0, fileData.length-1);
	 fs.writeFile('counter.csv', fileData, function (err) {
		 if (err) throw err;
		 //console.log('Saved! '+ fileData);
	});
}
