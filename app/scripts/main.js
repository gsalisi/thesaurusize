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

    function generateSynonymCardHeader() {
        $result.append(
            `<div class="js-ths-synonym-card-header">
                <h4>Synonym suggestions:</h4>
                <p>Click on the synonyms to add to thesaurus-ized result.</p>
            </div>`);
    }

    function generateFinalTextCard() {
        $result.append(`
            <div class="js-ths-finalcard-panel card-panel">
                <label class="js-ths-copy-label">Thesaurus-ize Phrase/Sentence:</label> 
                <blockquote class="js-ths-finalresult-text">
                </blockquote>
                <a class="btn-floating blue ths-copy js-ths-copy" title="Copy to clipboard"><i class="fa fa-clipboard" aria-hidden="true"></i></a>
            </div>
            </br>
        `)

        $('.js-ths-copy').click(() => {
            copyTextToClipboard($('.js-ths-finalresult-text').text().trim());
            $('.js-ths-finalcard-panel').append('<span class="js-ths-copied-badge">Copied</span>');
            window.setTimeout(() => {
                $('.js-ths-copied-badge').remove();
            }, 2000);
        });
    }

    function generateWordCard(word, results) {
        results.unshift(word);
        const rMarkup = results.map((r, i) => {
            const tmp = word.charAt(0);
            if (word[0] === word[0].toUpperCase()
                && word[0] !== word[0].toLowerCase()) {
                r = r.charAt(0).toUpperCase() + r.slice(1);;
            }
            return `
                <div class="collection-item ths-wordcard-synonym js-ths-wordcard-synonym">
                    <i class="tiny material-icons">add</i> <span class="synonym">${r}</span>
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

        // Attach listener
        $result.find(`.js-ths-wordcard-${word} .js-ths-wordcard-synonym`).click(function (elem) {
            const $targetElem = $(elem.target);
            if ($targetElem.hasClass('js-ths-wordcard-synonym')) {
                addToFinalResult($targetElem.find('.synonym').text().trim());
                const $parent = $(`.js-ths-wordcard-${word}`);
                $parent.remove();
            } else if($targetElem.hasClass('synonym')) {
                addToFinalResult($targetElem.text().trim());
                const $parent = $(`.js-ths-wordcard-${word}`);
                $parent.remove();
            }

            if(!$('.js-ths-wordcard-synonym').length) {
                $('.js-ths-synonym-card-header').remove();
            }
        });
    }

    function launchRequests(words, i) {
        $result.append(`<div class="js-ths-preloader-${i} progress">
            <div class="indeterminate"></div>
        </div>`);
        $.get(`/synonyms/${words[i]}`).then((data) => {
            i += 1;
            if (i < words.length) {
                launchRequests(words, i);
            }
            $(`.js-ths-preloader-${i-1}`).remove();
            generateWordCard(words[i-1], data);
        }).fail((err) => {
            i += 1;
            if (i < words.length) {
                launchRequests(words, i);
            }
            $(`.js-ths-preloader-${i-1}`).remove();
            generateWordCard(words[i-1], []);
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
                generateFinalTextCard();
                generateSynonymCardHeader();

                if (DEBUG) {
                    generateWordCard('Test', ['bad-mannered','ill-mannered','unmannered','unmannerly','natural','raw']);
                    generateWordCard('Lorem', ['uncivil','crude','primitive','bounderish','ill-bred','lowbred','underbred','yokelish']);
                } else {
                    launchRequests(words, 0);
                }
            }
        }
    });

    function copyTextToClipboard(text) {
        var textArea = document.createElement('textarea');

        // Place in top-left corner of screen regardless of scroll position.
        textArea.style.position = 'fixed';
        textArea.style.top = 0;
        textArea.style.left = 0;

        // Ensure it has a small width and height. Setting to 1px / 1em
        // doesn't work as this gives a negative w/h on some browsers.
        textArea.style.width = '2em';
        textArea.style.height = '2em';

        // We don't need padding, reducing the size if it does flash render.
        textArea.style.padding = 0;

        // Clean up any borders.
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        // Avoid flash of white box if rendered for any reason.
        textArea.style.background = 'transparent';
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();

        try {
            const successful = document.execCommand('copy');
        } catch (err) {
            console.log('Oops, unable to copy');
        }

        document.body.removeChild(textArea);
    }
});