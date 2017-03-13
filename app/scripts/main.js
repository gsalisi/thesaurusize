const $input = $('.js-ths-input');
const $btn = $('.js-ths-btn');
const $result = $('.js-ths-result');

$btn.click(() => {
    $result.empty();
    let input = $input.val();
    if(input.split(' ').length > 5) {
        $result.html(`<h4> I don't know man, that's a bit too much for me... </h4>`);        
    } else {
        $.get('localhost:3000/convert', {
            q: input
        }, (resp) => {
            $result.html(resp);
        });
    }
});