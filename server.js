require('dotenv').config();
const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const cors = require("cors"); 
const path = require("path");
const fs = require("fs");
const app = express();
const port = 3000;
const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);


app.use(express.json());
app.use(cors());
const root = path.join(__dirname, 'dist', 'chatbot-app');
app.get('*' ,function(req, res) {
  fs.stat(root + req.path, function(err){
    if(err){
        res.sendFile("index.html", { root });
    }else{
        res.sendFile(req.path, { root });
    }
  })
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [ { role: "user", content: message }],
  });
  
  const Data = completion.data;
  console.log('Server Data', Data);
  const reply = Data.choices[0].message.content;
  console.log('content', Data.choices[0].message.content);
  res.json({ reply });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
