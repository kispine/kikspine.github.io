'use strict'

var bkon = function(id, box_max, pic_size) {
  var self = this;

  self.id = id;
  self.box_max = box_max;
  self.pic_size = self.size = pic_size;
  self.defsrc = self.src = "img/1.jpg";

  self.frames = [];

  self.bg_c = self.pas_c = 0;

  __calcBoxSize(self.box_max, self.pic_size);
  __setImg(self.src);
  __draw();

  function __calcBoxSize(box_max, size) {
    if (box_max[0]/size[0]*size[1] > box_max[1]) {
      var box_w = box_max[1]/size[1]*size[0];
      var box_h = box_max[1];
    } else {
      var box_w = box_max[0];
      var box_h = box_max[0]/size[0]*size[1];
    }
    self.box_size = [Math.floor(box_w), Math.floor(box_h)];
    self.px2mm = box_w / size[0];
  }

  function __calcBgSize() {
    var frames_wid = 0;
    for (var i = 0; i < self.frames.length; i++) {
      frames_wid += self.frames[i][3];
    }
    self.frames_wid = frames_wid;
    self.size = [2 * frames_wid + self.pic_size[0],
                 2 * frames_wid + self.pic_size[1]];
  }

  function __createFrameEls(id, i) {
    $('#'+self.id).append('<div id="' + id + '" class="bk-fr bk-' + self.frames[i][1] + '"></div>');
    $('#'+id).append(`<div id="`+id+`-l" class="bk-l"></div>
                      <div id="`+id+`-r" class="bk-r"></div>
                      <div id="`+id+`-tw" class="bk-tw"><div id="`+id+`-t" class="bk-t"></div></div>
                      <div id="`+id+`-bw" class="bk-bw"><div id="`+id+`-b" class="bk-b"></div></div>`);
  }

  function __setFrameStls(id, src, wid, size, sum_fr) {
    $('#'+id).css('width', size[0]);
    $('#'+id).css('height', size[1]);
    $('#'+id).css('top', sum_fr);
    $('#'+id).css('left', sum_fr);

    $('#'+id+'-l').css('background-image', 'url('+ src +')');
    $('#'+id+'-l').css('width', size[1]);
    $('#'+id+'-l').css('height', wid);

    $('#'+id+'-r').css('background-image', 'url('+ src +')');
    $('#'+id+'-r').css('width', size[1]);
    $('#'+id+'-r').css('height', wid);

    var side = size[0] / Math.sqrt(2);

    $('#'+id+'-tw').css('width', side);
    $('#'+id+'-tw').css('height', side);
    $('#'+id+'-t').css('background-image', 'url('+ src +')');
    $('#'+id+'-t').css('width', size[0]);
    $('#'+id+'-t').css('height', wid);

    $('#'+id+'-bw').css('width', side);
    $('#'+id+'-bw').css('height', side);
    $('#'+id+'-b').css('background-image', 'url('+ src +')');
    $('#'+id+'-b').css('width', size[0]);
    $('#'+id+'-b').css('height', wid);
  }

  function __draw() {
    $('#'+self.id).css('width', self.box_size[0]);
    $('#'+self.id).css('height', self.box_size[1]);
    $('.'+self.id+'-fr').remove();
    __setImg();

    var next = self.box_size;
    var sum_fr = 0;
    var fr_wid = 0;

    for (var i = 0; i < self.frames.length; i++) {
      fr_wid = Math.floor(self.frames[i][3]*self.px2mm);
      __createFrameEls(self.id + i, i);
      __setFrameStls(self.id + i, self.frames[i][2], fr_wid, next, sum_fr);
      sum_fr += fr_wid;
      next = [self.box_size[0]-2*sum_fr, 
              self.box_size[1]-2*sum_fr];
    }
    $('#sizex span').html(self.size[0]/10 + ' см.');
    $('#sizey span').html(self.size[1]/10 + ' см.');
  }

  function __setImg() {
    var fr_wid = 0;
    for (var i = 0, l = self.frames.length; i < l; i++) {
      fr_wid += Math.floor(self.frames[i][3]*self.px2mm);
    }
    $('#bk-img').css('background-image', 'url('+ self.src +')');
    $('#bk-img').css('width', self.box_size[0] - 2*fr_wid);
    $('#bk-img').css('height', self.box_size[1] - 2*fr_wid);
    $('#bk-img').css('top', fr_wid);
    $('#bk-img').css('left', fr_wid);
  }

  self.calcCounts = function() {
    self.bg_c = self.pas_c = 0;
    for (var i = 0; i < self.frames.length; i++) {
      if (self.frames[i][1] == 'bg') {self.bg_c++;}
      if (self.frames[i][1] == 'pas') {self.pas_c++;}
    }
  }

  self.addFrame = function(art, type, src, wid) {
    if (type == 'bg') {
      for (var i = 0; i < self.frames.length; i++) {
        if (self.frames[i][1] == 'pas') {
          self.frames.splice(i, 0, [art, 'bg', src, wid]);
          break;
        }
      }
    }

    if (type == 'pas') {
      self.frames.push([art, 'pas', src, wid]);
    }

    __calcBgSize();
    __calcBoxSize(self.box_max, self.size);
    __draw();
  }

  self.changeFrame = function(id, type, art, src, wid) {
    self.calcCounts();
    if (type == 'bg') {
      if ((self.pas_c > 0) && (self.frames[id][1] == 'pas')) {
        self.frames.splice(id, 0, [art, type, src, wid]);
      } else {
        self.frames[id] = [art, type, src, wid];
      }    
    }
    if (type == 'pas') {
      self.frames[id+self.bg_c] = [art, type, src, wid];
    }
    
    __calcBgSize();
    __calcBoxSize(self.box_max, self.size);
    __draw();
  }

  self.delFrame = function(id) {
    self.frames.splice(id, 1);
    __calcBgSize();
    __calcBoxSize(self.box_max, self.size);
    __draw();
  }

  self.delFrames = function() {
    self.frames = [];
  }

  self.uploadImg = function(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function(e) {
        self.src = e.target.result;
        __setImg();
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  self.delImg = function() {
    self.src = self.defsrc;
    $('#bk-img').css('background-image', 'url('+ self.defsrc +')');
    $('#uploadImg-btn').val('');
  }

  self.getFrLength = function() {
    return self.frames.length;
  }

  // todo: добавить проверки на наличие подходящего числа (число, min размер картины..)
  // todo: сравнивать соотношение сторон картинки и заданных размеров рамки
  self.setPicSize = function() {
    self.pic_size[0] = Number($('#bg-width-setter').val())*10;
    self.pic_size[1] = Number($('#bg-height-setter').val())*10;
    __calcBgSize();
    __calcBoxSize(self.box_max, self.size);
    __draw();
  }

  self.changeWid = function(id, wid) {
    self.frames[id][3] = wid;
    __calcBgSize();
    __calcBoxSize(self.box_max, self.size);
    __draw();
  }
}

var bk;
$(document).ready(function() {
  bk = new bkon('bk', [400, 300], [400, 300]);
  console.log(bk);

  var bkAdd = function(e) {
    if ($(this).is('.bkcat-add')) {
      var it = $(this);
    } else {
      var it = $(this).parents('.bkcat-add');
    }
    var it_art = it.data('bg-art');
    var it_wid = it.data('bg-wid');
    if (it_wid == 0) {
      var wid_val = $('.bklist-el--select').find('.bklist-el-wid input').val().replace(/,/, '.');
      if (wid_val) { it_wid = Number(wid_val)*10; } else { it_wid = 50; }
    }
    var it_price = it.data('bg-price');
    
    var id = $('.bklist-el--select').data('num');
    var type = $('.bklist-el--select').data('type');
    bk.changeFrame(id, type, it_art, 'img/'+type+'/'+it_art+'t.jpg', it_wid);

    $('.bklist-el--select').find('img').remove();
    $('.bklist-el--select').find('.bklist-el-wrap').remove();
    $('.bklist-el--select').find('.bklist-el-wid').css('display', 'inline-block');
    $('.bklist-el--select').append(`<img src="img/`+type+'/'+it_art+`.jpg">
                                    <div class="bklist-el-wrap">
                                      <span class="bklist-el-art">`+it_art+`</span>
                                      <span class="bklist-el-price">`+it_price+`</span>
                                    </div>`);
    $('.bklist-el--select').addClass('bklist-el--load');
    $('.bklist-el--select').removeClass('bklist-el--active');
    if ($('.bklist-el--select').next().hasClass('bklist-el--load')) {

    } else {
      $('.bklist-el--select').next().addClass('bklist-el--active');
    }
  }

  $('.bkcat-add a').click(bkAdd);
  $('.bkcat-add').click(bkAdd);


  $('.bklist-el-del').click(function(e) {
    e.stopPropagation();

    var par = $(this).parent();
    var id = par.data('num');
    var type = par.data('type');

    bk.calcCounts();
    if (type == 'bg') { bk.delFrame(id); }
    if (type == 'pas') { bk.delFrame(id+bk.bg_c); }

    $('.bklist-el').removeClass('bklist-el--select');
    
    for (var i = id; i < 3; i++) {

      par.find('img').remove();
      par.find('.bklist-el-wrap').remove();
      par.find('.bklist-el-wid input').val(null);
      par.find('.bklist-el-wid').hide();

      if (par.next().hasClass('bklist-el--load')) {
        var load_last = i;

        par.append(`<img src="`+par.next().find('img').attr('src')+`">
                    <div class="bklist-el-wrap">
                      <span class="bklist-el-art">`+par.next().find('.bklist-el-art').html()+`</span>
                      <span class="bklist-el-price">`+par.next().find('.bklist-el-price').html()+`</span>
                    </div>`);
        par.find('.bklist-el-wid input').val(par.next().find('.bklist-el-wid input').val());

        par = par.next();
      }
    }

    par.prev().find('.bklist-el-wid').show();

    par.addClass('bklist-el--select');
    par.addClass('bklist-el--active');
    par.next().removeClass('bklist-el--active');
    par.removeClass('bklist-el--load');

    if (par.data('type') == 'bg') { selTab(0); }
    if (par.data('type') == 'pas') { selTab(1); }
    
  });

  $('.bklist-el').click(function(e) {
    $('.bklist-el').removeClass('bklist-el--select');
    if ($(this).hasClass('bklist-el--active')) {
      $(this).addClass('bklist-el--select');
    }
    if ($(this).hasClass('bklist-el--load')) {
      $(this).addClass('bklist-el--select');
    }
    if ($(this).data('type') == 'bg') { selTab(0); }
    if ($(this).data('type') == 'pas') { selTab(1); }
  });

  var selTab = function(id) {
    bk.calcCounts();

    $('.bkcat-tab').removeClass('active');
    $('.bkcat-caption li').removeClass('active');
    $($('.bkcat-tab')[id]).addClass('active');
    $($('.bkcat-caption li')[id]).addClass('active');
  }

  $('ul.bkcat-caption').on('click', 'li:not(.active)', function() {
    var ind = $(this).index();
    selTab(ind);

    $('.bklist-el').removeClass('bklist-el--select');
    if (ind == 0) {
      $($('.bklist-el')[bk.bg_c]).addClass('bklist-el--select');
    }
    if (ind == 1) {
      $($('.bklist-el')[bk.pas_c+3]).addClass('bklist-el--select');
    }
  });

  $('.bklist-el-wid input').change(function() {
    bk.calcCounts();
    bk.changeWid($(this).parent().parent().data('num')+bk.bg_c, Number($(this).val().replace(/,/, '.'))*10);
  });
});
