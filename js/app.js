$(document).ready(function() {
  var board = [[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];
  var status = 'n';
  var turn = 1;

  move = function(col, move){
    for(var i = board[col].length -1; i > -1; i--){
      if(board[col][i] == 0){
        return board[col][i] = move;
      }
    }
  }

  checkWin = function(){
    checkVert();
    checkHoriz();
    checkDia();
  }

  winAlert = function(checkSum){
    if(checkSum == 4){
      status = "a"
      alert("a wins"); 
    }
    else if(checkSum == -4){
      status = 'b';
      alert("b wins"); 
    }
  }
  checkVert = function(){
    for(var i = 0; i < board.length; i++){
      for(var j = 0; j < board[0].length - 3; j++){
        var checkSum = board[i][j] + board[i][j+1] + board[i][j+2] + board[i][j+3];
        winAlert(checkSum);
      }
    }
  }

  checkHoriz = function(){
    for(var i = 0; i < board.length-3; i++){
      for(var j = 0; j < board[0].length; j++){
        var checkSum = board[i][j] + board[i+1][j] + board[i+2][j] + board[i+3][j];
        winAlert(checkSum);
      }
    }
  }
  
  checkDia = function(){
    for(var i = 0; i < board.length-3; i++){
      for(var j = 0; j < board[0].length - 3; j++){
        var checkSum = board[i][j] + board[i+1][j+1] + board[i+2][j+2] + board[i+3][j+3];
        winAlert(checkSum);
      }
    }
  }

  renderBoard = function(){
    $("#board").empty();
    for(var i = 0; i < board.length; i++){
      $('<div id="' + i + '" class="' + ' col">' + '</div>').appendTo('#board');
      board[i].map(function(cell){
        var tileClass = 'n'
        if(cell == 1){
          var tileClass = 'a' 
        }
        else if(cell == -1){
          var tileClass = 'b'
        }
        $('<div class="' + tileClass + ' tile">' + '</div>').appendTo('#'+i);
      })
    }    
  }

  renderBoard();
  $("#board").on('mouseover', '.tile', function(){
    var hovClass = "b";
    if(turn ==1){hovClass = "a"};
    if(status != "n"){hovClass = "dummyclass"}
    $(this).addClass(hovClass + " temp");
  });

  $("#board").on('mouseout', '.tile', function(){
    renderBoard();
  });

  $('#board').on('click', '.col', function(){
    if(status == 'n'){
      move(this.id, turn);
      turn *= -1;
      renderBoard();
      checkWin();
    }  
  });
  $('.new').click(function(){
    location.reload();  
  })
});