var gameMatch = {};
gameMatch.init = function () {
  gameMatch.grabEmoji();
  //defaut normal board 4x5
  gameMatch.shuffleBoard(10);
  gameMatch.matchListener();
  gameMatch.optionListener();
};
gameMatch.size = 0;
gameMatch.emojiset = [];
gameMatch.counter = 0;
gameMatch.compare = [];
gameMatch.minutes = 1;
gameMatch.seconds = 60;
gameMatch.flag = true;
gameMatch.score = 0;
gameMatch.mode = 'normal';
gameMatch.grabEmoji = function () {
  for (var i = 0x1f600; i <= 0x1f644; i += 1) {
    gameMatch.emojiset.push(String.fromCodePoint(i));
  }
  gameMatch.emojiset.push(String.fromCodePoint(0x1f4a9));
};
gameMatch.randomSelect = function (array, num) {
  var pointer = array.length;
  while (0 !== pointer) {
    var randomPointer = Math.floor(Math.random() * pointer);
    pointer -= 1;
    var tempVal = array[pointer];
    array[pointer] = array[randomPointer];
    array[randomPointer] = tempVal;
  }
  return array.slice(0, num);
};
gameMatch.countDown = function () {
  gameMatch.timer = setInterval(function () {
    if (gameMatch.seconds === 0) {
      gameMatch.minutes -= 1;
      gameMatch.seconds = 59;
    } else {
      gameMatch.seconds -= 1;
    }
    if (gameMatch.minutes === 0 && gameMatch.seconds < 30) {
      $('#timerCountdown').css('color', 'red');
    }
    if (gameMatch.minutes > 0 || gameMatch.seconds > 0) {
      $('#timerCountdown').html(
        `${gameMatch.minutes}:${gameMatch.leadingZero(gameMatch.seconds)}`
      );
    } else if (gameMatch.minutes === 0 && gameMatch.seconds === 0) {
      $('#timerCountdown').html(
        `${gameMatch.minutes}:${gameMatch.leadingZero(gameMatch.seconds)}`
      );
      clearInterval(gameMatch.timer);
      let subTimer = setInterval(function () {
        swal({
          title: 'Sorry, You Lose!',
          type: 'error',
          width: 500,
          padding: 50,
          allowOutsideClick: false,
          onClose: function () {
            location.reload();
          },
          background: 'url(assets/backgroundLight.png)',
          html:
            '<h3>Your Final Score is: <span class="result_score">' +
            gameMatch.score +
            '</span></h3>' +
            '<a href="https://twitter.com/share">' +
            '<span class="fa-stack fa-lg">' +
            '<i class="fa fa-circle fa-stack-2x"></i>' +
            '<i class="fa fa-twitter fa-inverse fa-stack-1x"></i>' +
            '</span>' +
            '</a>',
        });
        clearInterval(subTimer);
      }, 0);
    }
  }, 1000);
};
gameMatch.leadingZero = function (n) {
  if (n < 10 && n >= 0) {
    return '0' + n;
  } else {
    return n;
  }
};
gameMatch.shuffleBoard = function (n) {
  gameMatch.size = n;
  var randomSelected = gameMatch.randomSelect(gameMatch.emojiset, n);
  var gameSample = [];
  for (var i = 0; i < randomSelected.length; i += 1) {
    gameSample.push(randomSelected[i]);
    gameSample.push(randomSelected[i]);
  }
  var finalBoard = gameMatch.randomSelect(gameSample, gameSample.length);
  for (var i = 0; i < finalBoard.length; i++) {
    $('#board').append(
      $(
        `<li class="emojicard"><div class="front">?</div><div class="back">${finalBoard[i]}</div></li>`
      )
    );
  }
};
gameMatch.matchListener = function () {
  $('ul').on('click touchstart', 'li', function (event) {
    event.preventDefault();
    if (gameMatch.flag) {
      gameMatch.countDown();
      gameMatch.flag = false;
    }
    var $current = $(this);
    $('#hardMode').prop('disabled', true);
    $('#normalMode').prop('disabled', true);
    if (!$current.hasClass('flip')) {
      var emoInfo = {
        index: $current.index(),
        value: $current.find('.back').text(),
      };
      gameMatch.compare.push(emoInfo);
      gameMatch.counter += 1;
      $current.addClass('flip');
      if (gameMatch.counter == 2) {
        $('li').addClass('off');
        if (gameMatch.compare[0].value === gameMatch.compare[1].value) {
          if (gameMatch.compare[0].value === String.fromCodePoint(0x1f608)) {
            gameMatch.score -= 5;
          } else if (
            gameMatch.compare[0].value === String.fromCodePoint(0x1f4a9)
          ) {
            gameMatch.score += 100;
          } else if (gameMatch.mode === 'hard') {
            gameMatch.score += 20;
          } else {
            gameMatch.score += 10;
          }
          $('#scoreCounter').text(gameMatch.score);
          var preIndex = gameMatch.compare[0].index;
          $current.addClass('correct');
          $current.find('.back').css('background-color', '#66BB6A');
          $current.parent().children().eq(preIndex).addClass('correct');
          $current
            .parent()
            .children()
            .eq(preIndex)
            .find('.back')
            .css('background-color', '#66BB6A');
          gameMatch.counter = 0;
          gameMatch.compare = [];
          $('li').removeClass('off');
          setTimeout(function () {
            if ($('#board > li.correct').length == gameMatch.size * 2) {
              clearInterval(gameMatch.timer);
              var bonus = gameMatch.minutes * 60 + gameMatch.seconds;
              gameMatch.score += bonus;
              swal({
                title: 'GREAT JOB! YOU WIN!',
                type: 'success',
                text: '&#x1F601',
                width: 500,
                padding: 50,
                background: 'url(assets/backgroundLight.png)',
                allowOutsideClick: false,
                onClose: function () {
                  location.reload();
                },
                html:
                  '<h3>Remaining Time: <span class="result_score">' +
                  gameMatch.minutes +
                  ':' +
                  gameMatch.leadingZero(gameMatch.seconds) +
                  '</span></h3>' +
                  '<h3>Your Final Score is: <span class="result_score">' +
                  gameMatch.score +
                  '</span></h3>' +
                  '<a href="https://twitter.com/share">' +
                  '<span class="fa-stack fa-lg">' +
                  '<i class="fa fa-circle fa-stack-2x"></i>' +
                  '<i class="fa fa-twitter fa-inverse fa-stack-1x"></i>' +
                  '</span>' +
                  '</a>',
              });
              $('li').removeClass('flip');
            }
          }, 350);
        } else {
          setTimeout(function () {
            $('li').removeClass('flip off');
          }, 600);
          gameMatch.compare = [];
          gameMatch.counter = 0;
        }
      }
    }
  });
};
gameMatch.optionListener = function () {
  $('#normalMode').click(function (event) {
    event.preventDefault();
    gameMatch.mode = 'normal';
    $('#board').empty();
    gameMatch.shuffleBoard(10);
    gameMatch.hint();
  });

  $('#hardMode').click(function (event) {
    event.preventDefault();
    gameMatch.mode = 'hard';
    $('#board').empty();
    gameMatch.shuffleBoard(18);
    $('li.emojicard').css('flex-basis', '14%');
    $('li.emojicard').css('margin', '1% 1%');
    gameMatch.hint();
  });

  $('#reset').click(function (event) {
    event.preventDefault();
    gameMatch.clearall();
    gameMatch.hint();
  });

  $('#FAQ').click(function (event) {
    swal({
      title: 'RULES',
      width: 600,
      padding: 20,
      background: 'url(assets/backgroundLight.png)',
      html:
        '<p>- There are total of <span class="result_score">70 emoji faces</span> to randomly shuffle from</p>' +
        '<p>- Click <span class="result_score">( Normal )</span> or <span class="result_score">( Hardcore )</span> Button to shuffle the borad/Change difficulty</p>' +
        '<p>- When first card is being clicked, the game is on!</p>' +
        '<p>- Click <span class="result_score">( <i class="fa fa-repeat" aria-hidden="true"></i> )</span> to reset page during the game</p>' +
        '<p>***Score Calculation***</p>' +
        '<p>&#x1F3AE Normal: One Correct match = <span class="result_score">10 points</span> </p>' +
        '<p>&#x1F525 Hardcore: One Correct match = <span class="result_score">20 points</span> </p>' +
        '<p>Matching &#x1F4A9 = <span class="result_score">100 points!</span></p>' +
        '<p>Matching &#x1F608 deducts <span class="result_score"> 5 points!</span></p>' +
        '<p>&#x1F4AF Final Score = total points + remaining time</p>' +
        '<br>' +
        '<p>Thank you for playing!</p>',
    });
  });
};
gameMatch.clearall = function () {
  gameMatch.counter = 0;
  gameMatch.flag = true;
  gameMatch.compare = [];
  clearInterval(gameMatch.timer);
  gameMatch.minutes = 1;
  gameMatch.seconds = 60;
  $('#timerCountdown').html('2:00');
  gameMatch.score = 0;
  $('#scoreCounter').text('00');
  $('#board').empty();
  if (gameMatch.mode === 'hard') {
    gameMatch.shuffleBoard(18);
    $('li.emojicard').css('flex-basis', '14%');
    $('li.emojicard').css('margin', '1% 1%');
  } else {
    gameMatch.shuffleBoard(10);
  }
  $('#hardMode').prop('disabled', false);
  $('#normalMode').prop('disabled', false);
};
gameMatch.hint = function () {
  $('li').addClass('flip');
  setTimeout(function () {
    $('li').removeClass('flip');
  }, 500);
};
$(function () {
  gameMatch.init();
  console.log(
    'Thanks for checking this out! Feel free to contact me at timlemkedeveloper@gmail.com if you have any questions!'
  );
});
