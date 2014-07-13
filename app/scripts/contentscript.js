'use strict';

var expandCommentsLinksSelector = 'a.expand-thread';
var commentsSelector = '[class*="b-comment level-"]';

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
// Code copied from: http://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
    };
}

function sort(desc) {
    // expand all threads
    $(expandCommentsLinksSelector).each(function () {
        this.click();
    });

    // sort all comments
    $(commentsSelector).sort(function (first, second) {

        var firstId = parseInt($(first).find('.comment-link').attr('href').substring(1));
        var secondId = parseInt($(second).find('.comment-link').attr('href').substring(1));

        if (!desc) {
            return (firstId > secondId) ? 1 : (firstId < secondId) ? -1 : 0;
        }
        return (firstId > secondId) ? -1 : (firstId < secondId) ? 1 : 0;
    }).appendTo('#commentsList');
}

function getBtnId() {
    return 'btnCommentsSorter';
}

function getBtnMessage() {
    return 'Отсортировать комментарии';
}

function getImageElement(desc) {
    if (desc) {
        return '<img alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAACgElEQVQ4y3WTzWuUVxSHn3PuOx/RavJOZhrfsRBjEsGVWVZbShel3fZfcNNVoVC6kXbVrQhFcSm4MCsRRLJSxIVLqZONH9UgBEOcycxYYk0yk3fuOV04GZuKd3Phwn0497m/nwDjy8vLl/I83xURAPb2veXuuDsAhUKhtLCw8COwCSBAtbez037xsomIIKKIgIgCjvs7AO44zomZOiEpjgNvRoB+v99uPH7B87+ecCSr87rboVqtsbHRQlWZSFPStIIK3Gq85sb9Z3ceXTn7bfLdH8MJer326lqTYrGImaEh4OaEEHA3YjSCOudvPuX7r08RBH64sHR35erZb0aAPM8pl8uEoNjwMoBZRFX4ffFPvlyYJY9OUCgE5efLt5eSPVEhBBqNBkmSUK/XWV9fR0TIsgxxY6yg3HvwlPa2sLW9y7WlxrnkQGFr5GB1rYUDQRVRHUoEd8PNiO58Ugr8en2VfJCz+MtXApAAqAp/v9nm+bPHZNlRut0OtdqnbGy0EBHStMJEmrLbEwYoho6+OAFwcyYOj/HF6dOYG3PHpzFzZmemcXdijMQYOVBSzDYRSfYDzJ3PpiYplUuohn1hcnfMjDzPKReF3fiK/8bsPUqEhw/fScyyjGazibtTr9fJ85xKpQKuFJICQW0/QER4+arD+OQRRJWtvnEonUIE3vYi5sJas8vBUmCsVESJH06w+c/2KIndbodqrUa71UJUSdMKaaVCfwcOHyyDDf4n0Z3xQ2OcOfM5Fo3ZmWnMjNlj00MHcZTGk1MDfrp477fRy4HJGGNnMBggIqjqsFR7TXzfRjMjSRJCCFWgC5DMz8+/HR7s7/DHl83NzW2trKwA8C81rSZ43N/CbAAAAABJRU5ErkJggg==" />';
    }
    return '<img alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAACaElEQVQ4y42TTUtUcRTGf+fcO/+ZMLA7juPcUayxNyojJIJy07JPILRp27ZlqyBwGRR9jJYtgqBFb+Ci0k2ZJiUJZePoGNMLzlzv/Z8WjmbWogNnd87DOb/zHAGGpqam7iRJkogIIsK/wswwM5xzbnx8/ArQBhCg1m63F7+2vqGiqAjsEtpuNAzvPZVSLxLk5fTkF3l9IzYBaknSWZx//4mFd3NU4pj1ZpO+UolGY4VAAw5EEVFUpJCDa/dalgtF7l8fE4AQQERorLcoDx4i9Z6oPEhmRn98EDMj8xmrX7/Tk1cG+3okF9jOaiGA98aFsWMUCgVUAzAPotvL482TbqY4B3efLVBw8qfA1hTK9PQMYRhSrVZZXl5GRIjjmDRNiaII55WNZLOLbo/Aj58b1EaOoIGioowcProD0XnPRruDWoCSgu0RUFVW1losvHtLJR6k2Vylv3+A1UYdRImiIlEUsc8pgXp07wQi7IJoFMtDpGb0VYa3IGYZjfVv7C8EqHh0l1VCgCzzjI8dJ5/PI6p/m8j7LlPFHj1Hw981AtQ6nc5imqbMzs4ShiFxHFOv1zEzqtUq+QAuTU5xaqTM2WMDYNibjw2Znv/882+IIogKBw+NICJY94w3L5/k8VyLE8NFAFmqN3n5dP7iDoOVZmvLiZWY9eYapf4yjcYKKsKBqMhwsY/TFeHJzAcEuHX7wVlmJ2cEqG0myeLTF29wzuG9J9AAbx7t8siyDJ9lGEZPb4nzZ66eI3v4apvBcJqmSz7LEBVUFRFBuqcyDPO/nwkU53IO2ARgdHTUAXmg8J+Zm5iYCLbZ/QJlfA2YpciCZgAAAABJRU5ErkJggg==" />';
}

function getBtnHtml(desc) {
    var btnId = getBtnId();
    var btnMessage = getBtnMessage();
    return '<a id="' + btnId + '" href="javascript:;"><img alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAACgElEQVQ4y3WTzWuUVxSHn3PuOx/RavJOZhrfsRBjEsGVWVZbShel3fZfcNNVoVC6kXbVrQhFcSm4MCsRRLJSxIVLqZONH9UgBEOcycxYYk0yk3fuOV04GZuKd3Phwn0497m/nwDjy8vLl/I83xURAPb2veXuuDsAhUKhtLCw8COwCSBAtbez037xsomIIKKIgIgCjvs7AO44zomZOiEpjgNvRoB+v99uPH7B87+ecCSr87rboVqtsbHRQlWZSFPStIIK3Gq85sb9Z3ceXTn7bfLdH8MJer326lqTYrGImaEh4OaEEHA3YjSCOudvPuX7r08RBH64sHR35erZb0aAPM8pl8uEoNjwMoBZRFX4ffFPvlyYJY9OUCgE5efLt5eSPVEhBBqNBkmSUK/XWV9fR0TIsgxxY6yg3HvwlPa2sLW9y7WlxrnkQGFr5GB1rYUDQRVRHUoEd8PNiO58Ugr8en2VfJCz+MtXApAAqAp/v9nm+bPHZNlRut0OtdqnbGy0EBHStMJEmrLbEwYoho6+OAFwcyYOj/HF6dOYG3PHpzFzZmemcXdijMQYOVBSzDYRSfYDzJ3PpiYplUuohn1hcnfMjDzPKReF3fiK/8bsPUqEhw/fScyyjGazibtTr9fJ85xKpQKuFJICQW0/QER4+arD+OQRRJWtvnEonUIE3vYi5sJas8vBUmCsVESJH06w+c/2KIndbodqrUa71UJUSdMKaaVCfwcOHyyDDf4n0Z3xQ2OcOfM5Fo3ZmWnMjNlj00MHcZTGk1MDfrp477fRy4HJGGNnMBggIqjqsFR7TXzfRjMjSRJCCFWgC5DMz8+/HR7s7/DHl83NzW2trKwA8C81rSZ43N/CbAAAAABJRU5ErkJggg==" /><span>' + btnMessage + '</span></a>';
}

window.addEventListener('load', function () {
    var desc = true;
    var btnId = getBtnId();

    $('div.fixed-menu').append(getBtnHtml(desc));

    var sortFn = debounce(function () {
        sort(desc);
        desc = !desc;
    }, 300);

    var link = document.getElementById(btnId);
    link.addEventListener('click', function () {
        sortFn();
    });
});
