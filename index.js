const express = require('express');
const q = require('q');
const request = require('request-promise');
const app = express();
var counter = 20000;

function getRandomArbitrary(min, max) {
    const beta = Math.random();
    const beta_left = (beta < 0.5) ? 2*beta : 2*(1-beta);
    return Math.floor(beta_left * (max - min) + min);
}

app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/dist'));

// B both
// E eacheach othereithereverybodyeveryoneeverything
// F few
// H heherhersherselfhimhimselfhis
// I Iititsitself
// M manymeminemoremostmuchmyself
// N neitherno onenobodynonenothing
// O oneone anotherotherothersoursourselves
// S severalshesomesomebodysomeonesomething
// T thattheirtheirsthemthemselvesthesetheythisthose
// U us
// W wewhatwhateverwhichwhicheverwhowhoeverwhomwhomeverwhose
// Y youyouryoursyourselfyourselves
const NOT_TO_THESAURIZE_SET = new Set([
  'I', 'YOU', 'HE', 'SHE', 'HER', 'HIM', 'THEM', 'ME', 'US', 'THEY',
  'ALL', 'ANOTHER', 'ANY', 'ANYBODY', 'ANYONE', 'ANYTHING']);

app.get('/synonyms/:word', (req, res) => {
  if(counter < 0) {
    res.send([]);
  }
  counter--;
  const word = req.params.word;
  const requestOptions = {
    url: `https://wordsapiv1.p.mashape.com/words/${word}/synonyms`,
    headers: {
      'X-Mashape-Key': 'bLSnOP5JqXmshpIPnzCEUuqDHvMcp17TGREjsnir5BVQs9k6vg',
      'Accept': 'application/json'
    }
  };
  // console.log(word);
  request(requestOptions).then((b) => {
    // console.log(b);
    res.send(JSON.parse(b).synonyms)
  }).catch((err) => {
    res.status(500).send(err);
  });
});

app.listen(app.get('port'),() => {
  console.log('Node app is running on port', app.get('port'));
});

