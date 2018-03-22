//判断当前是否是移动端
window.os = function () {
  var ua = navigator.userAgent,
    isWindowsPhone = /(?:Windows Phone)/.test(ua),
    isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
    isAndroid = /(?:Android)/.test(ua),
    isFireFox = /(?:Firefox)/.test(ua),
    isChrome = /(?:Chrome|CriOS)/.test(ua),
    isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (
      isFireFox && /(?:Tablet)/.test(ua)),
    isPhone = /(?:iPhone)/.test(ua) && !isTablet,
    isPc = !isPhone && !isAndroid && !isSymbian;
  return {
    isTablet: isTablet,
    isPhone: isPhone,
    isAndroid: isAndroid,
    isPc: isPc
  };
}();

function Index(param) {
  this.dom = {
    btnStart: $('.start'),
    imgArea: $('.imgArea')
  };
  this.obj = {
    imgOrigArr: [], //图片拆分后，存储正确排序的数组
    imgRanArr: [], //图片顺序打乱后，存储当前排序的数组
    imgWidth: parseInt(this.dom.imgArea.css('width')),
    imgHeight: parseInt(this.dom.imgArea.css('height')),
  };
  this.cell = {
    cellWidth: this.obj.imgWidth / param.cell,
    cellHeight: this.obj.imgHeight / param.cell,
  }
  this.param = param;
  this.img = param.img;
  this.hasStart = false;
  this.moveTime = 400;
  this.init();
}
Index.prototype.init = function () {
  this.imgSplit();
  this.gameState();
};
Index.prototype.imgSplit = function () {
  var self = this;
  self.obj.imgOrigArr = [];
  self.dom.imgArea.html('');
  var cell = '';

  for (var i = 0; i < self.param.cell; i++) {
    for (var j = 0; j < self.param.cell; j++) {

      self.obj.imgOrigArr.push(i * self.param.cell + j);
      cell = document.createElement('div');

      $(cell).attr('class', 'imgCell');
      $(cell).css({
        'width': self.cell.cellWidth + 'px',
        'height': self.cell.cellHeight + 'px',
        'left': j * self.cell.cellWidth + 'px',
        'top': i * self.cell.cellHeight + 'px',
        'background': "url('" + self.img + "')",
        'backgroundPosition': (-j) * self.cell.cellWidth + 'px ' + (-i) * self.cell.cellHeight + 'px',
      });
      self.dom.imgArea.append(cell);
    }
  }
  self.dom.imgCell = $('.imgCell');
};
Index.prototype.gameState = function () {
  var self = this;
  self.dom.btnStart.bind('click', function () {
    if (!self.hasStart) {
      $('.msg').text('');
      $('#music')[0].pause();
      $(this).text('复原');
      self.hasStart = true;
      self.randomArr();
      self.cellOrder(self.obj.imgRanArr);
      self.dom.imgCell.css({
        'cursor': 'pointer'
      }).bind(os.isPc ? 'mouseover' : 'touchstart', function () {
        $(this).addClass('hover');
      }).bind(os.isPc ? 'mouseout' : 'touchend', function () {
        $(this).removeClass('hover');
      }).bind(os.isPc ? 'mousedown' : 'touchstart', function (e) {
        $(this).css('cursor', 'move');
        var cellIndex1 = $(this).index();
        if (!os.isPc) {
          e.preventDefault();
          e.pageX = e.changedTouches[0].pageX;
          e.pageY = e.changedTouches[0].pageY;
        }
        var cellX = e.pageX - self.dom.imgCell.eq(cellIndex1).offset().left;
        var cellY = e.pageY - self.dom.imgCell.eq(cellIndex1).offset().top;
        
        $(document).bind(os.isPc ? 'mousemove' : 'touchmove', function (e2) {
          if (!os.isPc) {
            e2.preventDefault();
            e2.pageX = e2.changedTouches[0].pageX;
            e2.pageY = e2.changedTouches[0].pageY;
          }
          self.dom.imgCell.eq(cellIndex1).css({
            'z-index': '40',
            'left': (e2.pageX - cellX - self.dom.imgArea.offset().left) + 'px',
            'top': (e2.pageY - cellY - self.dom.imgArea.offset().top) + 'px',
          });
        }).bind(os.isPc ? 'mouseup' : 'touchend', function (e3) {
          if (!os.isPc) {
            e3.preventDefault();
            e3.pageX = e3.changedTouches[0].pageX;
            e3.pageY = e3.changedTouches[0].pageY;
          }
          var cellIndex2 = self.changeIndex((e3.pageX - self.dom.imgArea.offset().left), (e3.pageY - self.dom.imgArea.offset().top), cellIndex1);
          if (cellIndex1 == cellIndex2) {
            self.cellReturn(cellIndex1);
          } else {
            self.cellChange(cellIndex1, cellIndex2);
          }
          if (os.isPc) {
            $(document).unbind('mousemove').unbind('mouseup');
          } else {
            $(document).unbind('touchmove').unbind('touchend');
          }
        });
      }).bind(os.isPc ? 'mouseup' : 'touchend', function () {
        $(this).css('cursor', 'pointer')
      });
    } else {
      $(this).text('开始');
      $('.msg').text('');
      $('#music')[0].pause();
      self.hasStart = false;
      self.cellOrder(self.obj.imgOrigArr);
      if (os.isPc) {
        self.dom.imgCell.css('cursor', 'default').unbind('mouseover').unbind('mousedown').unbind('mouseup');
      } else {
        self.dom.imgCell.css('cursor', 'default').unbind('touchstart').unbind('touchmove').unbind('touchend');
      }
    }
  })
}
Index.prototype.randomArr = function () {
  this.obj.imgRanArr = [];
  var len = this.obj.imgOrigArr.length;
  var order;
  for (var i = 0; i < len; i++) {
    order = Math.floor(Math.random() * len);
    if (this.obj.imgRanArr.length > 0) {
      while (jQuery.inArray(order, this.obj.imgRanArr) > -1) {
        order = Math.floor(Math.random() * len);
      }
    }
    this.obj.imgRanArr.push(order);
  }
  return;
};
Index.prototype.cellOrder = function (arr) {
  var self = this;
  for (var i = 0; i < arr.length; i++) {
    self.dom.imgCell.eq(i).animate({
      'left': arr[i] % self.param.cell * self.cell.cellWidth + 'px',
      'top': Math.floor(arr[i] / self.param.cell) * self.cell.cellHeight + 'px',
    }, self.moveTime);
  }
};
Index.prototype.changeIndex = function (x, y, orig) {
  var self = this;
  if (x < 0 || x > self.obj.imgWidth || y < 0 || y > self.obj.imgHeight) {
    return orig;
  }
  var row = Math.floor(y / self.cell.cellHeight),
    col = Math.floor(x / self.cell.cellWidth),
    location = row * self.param.cell + col;
  var i = 0,
    len = self.obj.imgRanArr.length;
  while ((i < len) && (self.obj.imgRanArr[i] !== location)) {
    i++;
  }
  return i;
}
Index.prototype.cellReturn = function (index) {
  var self = this;
  var row = Math.floor(this.obj.imgRanArr[index] / self.param.cell),
    col = this.obj.imgRanArr[index] % self.param.cell;
  this.dom.imgCell.eq(index).animate({
    'top': row * this.cell.cellHeight + 'px',
    'left': col * this.cell.cellWidth + 'px',
  }, this.moveTime, function () {
    $(this).css('z-index', '10');
  });
}
Index.prototype.cellChange = function (from, to) {
  var self = this;
  var rowFrom = Math.floor(this.obj.imgRanArr[from] / self.param.cell),
    colFrom = this.obj.imgRanArr[from] % self.param.cell,
    rowTo = Math.floor(this.obj.imgRanArr[to] / self.param.cell),
    colTo = this.obj.imgRanArr[to] % self.param.cell,
    temp = this.obj.imgRanArr[from];
  this.dom.imgCell.eq(from).animate({
    'top': rowTo * this.cell.cellHeight + 'px',
    'left': colTo * this.cell.cellWidth + 'px',
  }, this.moveTime, function () {
    $(this).css('z-index', '10');
  });
  this.dom.imgCell.eq(to).animate({
    'top': rowFrom * this.cell.cellHeight + 'px',
    'left': colFrom * this.cell.cellWidth + 'px',
  }, this.moveTime, function () {
    $(this).css('z-index', '10');
    self.obj.imgRanArr[from] = self.obj.imgRanArr[to];
    self.obj.imgRanArr[to] = temp;
    if (self.checkPass(self.obj.imgOrigArr, self.obj.imgRanArr)) {
      self.sucess();
    }
  })
}
Index.prototype.checkPass = function (rightArr, puzzleArr) {
  if (rightArr.toString() == puzzleArr.toString()) {
    return true;
  } else {
    return false;
  }
};
Index.prototype.sucess = function () {
  for (var i = 0; i < this.obj.imgOrigArr.length; i++) {
    if (this.dom.imgCell.eq(i).has('hover')) {
      this.dom.imgCell.eq(i).removeClass('hover')
    }
  }
  if (os.isPc) {
    this.dom.imgCell.css('cursor', 'default').unbind('mouseover').unbind('mousedown').unbind('mouseup');
  } else {
    this.dom.imgCell.css('cursor', 'default').unbind('touchstart').unbind('touchmove').unbind('touchend');
  }
  this.dom.btnStart.text('开始');
  this.hasStart = false;
  $('.msg').text('嘿嘿，拼成功啦！');
  $('#music')[0].play();
}
new Index({
  'img': 'love.jpg',
  'cell': 5
});