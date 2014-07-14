'use strict';

var btnId = '#btnCommentsSorter';
var btnMessage = 'Отсортировать комментарии';
var collapsedCommentsSelector = '.ct-hidden';
var commentsSelector = '[class*="b-comment level-"]';
var threadCommentsLingSelector = '.thread-comments';
var desc = true;
var initialStateChanged = false;

// Good idea is to move this to a separate file
var tpl = '<a class="btn-comments-sorter btn-comments-sorter-mid" id="' + btnId.substr(1) + '" href="javascript:;"><span>' + btnMessage + '</span></a>'

function sort(desc) {
    console.time('sort');
    $(commentsSelector).sort(function (first, second) {
      var firstId = parseInt($(first).find('.comment-link').attr('href').substring(1));
      var secondId = parseInt($(second).find('.comment-link').attr('href').substring(1));

      if (!desc) {
        return (firstId > secondId) ? 1 : (firstId < secondId) ? -1 : 0;
      }
      return (firstId > secondId) ? -1 : (firstId < secondId) ? 1 : 0;
    }).appendTo('#commentsList');
    console.timeEnd('sort');
}


// this function was a hotspot
function expandAllThreads(){
    console.time('expandAll');
    $(collapsedCommentsSelector).each(function () {
      this.classList.remove(collapsedCommentsSelector.substr(1));
    });
		$(threadCommentsLingSelector).hide();
    console.timeEnd('expandAll');
}

function fixIcon(desc) {
    var btnElement = $(btnId);

    // no need for additional parameter
    // removeClass will not throw error if there is no class
    btnElement.removeClass('btn-comments-sorter-mid');

    if (desc) {
        btnElement.removeClass('btn-comments-sorter-desc').addClass('btn-comments-sorter-asc');
    } else {
        btnElement.removeClass('btn-comments-sorter-asc').addClass('btn-comments-sorter-desc');
    }
}

// debounce is not needed as contenscript is loaded after DOM is ready
// this is extension-specific behavior
function sortFn() {
    expandAllThreads();
    sort(desc);
    desc = !desc;
    fixIcon(desc, initialStateChanged);
    initialStateChanged = true;
}

$('div.fixed-menu').append(tpl);
$(btnId).on('click', sortFn);
