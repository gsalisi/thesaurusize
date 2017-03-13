const DEBUG = 0;

$(document).ready(function() {
    const $input = $('.js-ths-input');
    const $btn = $('.js-ths-btn');
    const $result = $('.js-ths-result');

    function addToFinalResult(text) {
        const $finalResultBlock = $('.js-ths-finalresult-text');
        let str = $finalResultBlock.text();
        str += ' ' + text;
        $finalResultBlock.text(str);
    }

    function showFinalResultCard() {
        $result.append(`
            <div class="card-panel">
                <label>Final Phrase/Sentence:</label> 
                <blockquote class="js-ths-finalresult-text">

                </blockquote>
            </div>
        `)
    }

    function generateWordCard(word, results) {
        results.push(word);
        const rMarkup = results.map(r => {
            return `
                <div class="collection-item ths-wordcard-synonym js-ths-wordcard-synonym">
                    ${r}
                </div>
            `;
        }).join('\n');
        
        $result.append(`
            <div class="card-panel hoverable js-ths-wordcard-${word}">
                <h5> ${word} </h5>
                <div class="collection">
                    ${rMarkup}
                </div>
            </div>
        `);

        $result.find(`.js-ths-wordcard-${word}`).click((elem) => {
            addToFinalResult($(elem.target).text());
            $(elem.target.parentElement.parentElement).remove();
        })
    }

    function launchRequests(words, i) {
        $.get(`/synonyms/${words[i]}`).then((data) => {
            i += 1;
            if (i < words.length) {
                launchRequests(words, i);
            }
            generateWordCard(words[i-1], data);
        });
    }

    $btn.click(() => {
        $result.empty();
        let input = $input.val();
        if(input.split(' ').length > 50) {
            $result.html('<h4> I don\'t know man, that\'s a bit too much for me... </h4>');        
        } else {
            const words = input.split(' ').map(input => {
              return input.replace(/[^a-zA-Z]+/g, '');
            }).filter(w => w.length);

            if (words && words.length) {
                showFinalResultCard();
                if (DEBUG) {
                    generateWordCard('Test', ['bad-mannered','ill-mannered','unmannered','unmannerly','natural','raw']);
                    generateWordCard('Lorem', ['uncivil','crude','primitive','bounderish','ill-bred','lowbred','underbred','yokelish']);
                } else {
                    launchRequests(words, 0);
                }
            }
        }
    });
});