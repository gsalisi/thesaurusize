const express = require('express');
const q = require('q');
const request = require('request-promise');
const app = express();

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

app.get('/convert', (req, res) => {
    if (!req.query.q) {
        res.send(`Needs 'q' query parameter.`);
    }

    const words = req.query.q.split(' ').map(input => {
      return input.replace(/[^a-zA-Z]/gi, '');
    })
    // console.log(words);
    const promises = words.map(word => {
      if (NOT_TO_THESAURIZE_SET.has(word.toUpperCase())) {
        // console.log(word);
        return q.when(word);
      }
      const requestOptions = {
        url: `https://wordsapiv1.p.mashape.com/words/${word}`,
        headers: {
          'X-Mashape-Key': 'bLSnOP5JqXmshpIPnzCEUuqDHvMcp17TGREjsnir5BVQs9k6vg',
          'Accept': 'application/json'
        }
      };
      // console.log('promise');
      return request(requestOptions).then((b) => {
        const wordResults = JSON.parse(b).results;
        for (var i = 0; i < wordResults.length; i++) {
          const wordRes = wordResults[i];
          if (wordRes.partOfSpeech === 'adjective' || 
            wordRes.partOfSpeech === 'verb' || 
            wordRes.partOfSpeech === 'adverb') {
            // console.log(wordRes);
            const synonyms = wordRes.synonyms;
            const r = getRandomArbitrary(0, synonyms.length);
            return synonyms[r] || word;
          }
        }
        return word;
      })
    })
    
    q.all(promises).then((bodies) => {
      res.send(bodies.join(' ')+'.');
    }).catch(err => console.log(err));


});

app.listen(app.get('port'),() => {
  console.log('Node app is running on port', app.get('port'));
});

