$(document).ready(function() {
  var game = {
    board: [[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,1],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]],
    nextPlay: -1,
    depth: 0
  }
  var possMoves = [0,1,2,3,4,5,6];
  var state;
  var winLine = [];



  makeMove = function(game, move){
    for(var i = game.board[move].length -1; i > -1; i--){
      if(game.board[move][i] == 0){
        game.board[move][i] = game.nextPlay;
        game.nextPlay *= -1
        break;
      }
    }

  }

  function maxMove(game){
    return possMoves.reduce(function(maxSoFar, current){
        return evalMove(game, current) > evalMove(game, maxSoFar) ? current : maxSoFar;
    });
  }

  function minMove(game){
    var best = possMoves.reduce(function(minSoFar, current){
      return evalMove(game, current) < evalMove(game, minSoFar) ? current : minSoFar;
    });
    return best;
  }

  // clones arrays
  function clone(arr){
    var copy = [];
      for (var i = 0; i < arr.length; i++) {
          copy[i] = arr[i];
        }
    return copy;
  }

  // simulates a move on a clone of current game
  function simMove(game, move){
    var simBoard = [];
    for(var i = 0; i < game.board.length; i++){
      var copy = clone(game.board[i])
      simBoard.push(copy);
    }
    var simNext = game.nextPlay * 1;
    var simDepth = game.depth * 1;
    
    var simGame = {
        board: simBoard,
        nextPlay: simNext,
        depth: simDepth
      }; 

    makeMove(simGame, move)
    return simGame;
  }

  // applies move to actual game
  function makeMove(game, move){
    var movVal = game.nextPlay;
    simGame.board[move] = movVal;
    game.nextPlay *= -1;
    return game;
  }

  // simulates a move and then evaluates the game's board
  function evalMove(game, move){
    if(game.board[move][0]!==0){
      if(game.nextPlay==1){
        return -10001   
      }
     else if(game.nextPlay==-1){
      return 10001;
     }
    }
    sim = simMove(game, move);
    sim.depth++
    return evalBoard(sim);
  }

  function countBoth(array, first, sec) {
    var _first = 0;
    var _sec = 0;
    for(var i = 0; i < array.length; i++){
      if (array[i] === first) {
        _first++;
      }
      else if(array[i] === sec){
        _sec++;
      }
    }
    return [_first,_sec];
  };

  evalLine = function(line) {
    var score = countBoth(line,1,-1);
    var first = score[0];
    var second = score[1];
    if(first === 0 || second === 0){
      if(first == 2){
        return 1;
        }
      else if(first == 3){
        return 7;
        }
      else if(first == 4){
        return 1000;
        }
      else if(second == 2){
        return -1;
        }
      else if(second == 3){
        return -7;
      }
      else if(second == 4){
        return -1000;
      }  
    }
  return 0;
  };

  function storeIfWin(board, starts, ends, steps){
    var xStart = starts[0];
    var xEnd = ends[0];
    var xStep = steps[0];
    var yStart = starts[1];
    var yEnd = ends[1];
    var yStep = steps[1];
    for (var i = xStart; i < xEnd; i++) {
      for (var j = yStart; j < yEnd; j++) {
        var lineSum = board[i][j] +board[i+xStep][j + yStep] +board[i+2*xStep][j + 2*yStep] + board[i+ 3* xStep][j + 3*yStep]
      if(lineSum === 4 || lineSum === -4){
        winLine = [[i,j],[i+xStep,j + yStep],[i+2*xStep,j + 2*yStep],[i+ 3* xStep,j + 3*yStep]] 
          showWin(winLine, game);
        break;
      }
      }
    }

  };

  function showWin(ans, game) {
    ans.map(function(item){
      game.board[item[0]][[item[1]]]=10
    })
    renderBoard(game.board);
    $('#board').off('click');
    $('#board').off('mouseover');
    $('#board').off('mouseout');
  }

  function winAlert(checkSum) {
    if (Math.abs(checkSum) === 4) {
      state = sgn(checkSum);
      return state;
    }
  }

  function checkLine(board, starts, ends, steps){
    var xStart = starts[0];
    var xEnd = ends[0];
    var xStep = steps[0];
    var yStart = starts[1];
    var yEnd = ends[1];
    var yStep = steps[1];
    var total = 0;
    for (var i = xStart; i < xEnd; i++) {
      for (var j = yStart; j < yEnd; j++) {
        var lineVal = evalLine([board[i][j],board[i+xStep][j + yStep],board[i+2*xStep][j + 2*yStep],board[i+ 3* xStep][j + 3*yStep]]);
        total += lineVal;
      }
    }
    return total;
  };
  
  function evalBoard(game){
    if(game.depth ==4){
      return staticEvalBoard(game.board);
    }
    else if(game.nextPlay ===1){
      return evalMove(game, maxMove(game));
    }
    else if(game.nextPlay ===-1){
      return evalMove(game, minMove(game));
    }
  }

  function staticEvalBoard(board) {
    _x = board.length;
    _y = board[0].length;
    var gameEval = 0;
    gameEval += checkLine(board, [0,0],[_x, _y -3],[0,1]);
    gameEval += checkLine(board, [0,0],[_x -3, _y],[1,0]);
    gameEval += checkLine(board, [0,0],[_x -3, _y -3],[1,1]);
    gameEval += checkLine(board, [0,3],[_x -3, _y],[1, -1]);
    return gameEval;
  }

  function checkAllWins(board) {
    _x = board.length;
    _y = board[0].length;
   storeIfWin(board, [0,0],[_x, _y -3],[0,1]);
    storeIfWin(board, [0,0],[_x -3, _y],[1,0]);
    storeIfWin(board, [0,0],[_x -3, _y -3],[1,1]);
    storeIfWin(board, [0,3],[_x -3, _y],[1, -1]);
  }

  renderBoard = function(board){
    $("#board").empty();
    for(var i = 0; i < board.length; i++){
      $('<div id="' + i + '" class="' + ' col">' + '</div>').appendTo('#board');
      board[i].map(function(cell){
        var tileClass = 'n';
        if(cell == 1){
          var tileClass = 'a'; 
        }
        else if(cell == -1){
          var tileClass = 'b';
        }
        else if (cell == 10){
          var tileClass = 'win';
        }
        $('<div class="' + tileClass + ' tile">' + '</div>').appendTo('#'+i);
      })
    }    
  }

  renderBoard(game.board);
  $("#board").on('mouseover', '.tile', function(){
    var hovClass = "b";
    if(game.nextPlay ==1){hovClass = "a"};
    hovClass = "dummyclass";
    $(this).addClass(hovClass);
  });

  $("#board").on('mouseout', '.tile', function(){
    renderBoard(game.board);
  });

  $('#board').on('click', '.col', function(){
      if(game.nextPlay === -1){
        makeMove(game, this.id);
        checkAllWins(game.board);
        renderBoard(game.board);
        var compMove = maxMove(game);
        makeMove(game, compMove);
        checkAllWins(game.board);
        renderBoard(game.board)
      }
  });
  $('.new').click(function(){
    location.reload();  
  })
});