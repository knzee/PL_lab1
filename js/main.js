function show(e){
e.style.display = 'block';
}

function hide(e){
e.style.display = 'none';
}

function clearScreen(fld) {
  fld.innerHTML='';
}

function getByID(id) {
  return document.getElementById(id);
}

function getByClass(id) {
  return document.getElementsByClassName(id);
}

function HttpRequest(path) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', path, false);
  xhr.send();
  if (xhr.status != 200) {
    return false;
  } else {
    return JSON.parse(xhr.responseText);
  }
}

var folder = getByID('folder');
var cloakscreen = getByID('bg');
var mw_newfolder = getByID('createfolder');
var mw_delete = getByID('deleteconfirm');
var retblock =  getByID('return');
var delete_yes = getByID('dely');

getByID('deln').addEventListener('click', function() {
  hide(cloakscreen);
  hide(mw_delete);
});

delete_yes.addEventListener('click', function() {
  hide(cloakscreen);
  hide(mw_delete);
});

function drawPage(path) {

  getByClass('header-path__text')[0].innerHTML = path;

  //Получение json'а
  let data = HttpRequest(path);

  //Добавление папок и файлов на страницу
  for(let i=0;i<data.length;i++){

    if (data[i].is_file == true) {
      curtype = 'file'
      cursize = ' (<span>'+data[i].f_size+'б</span>)'
    } else {curtype = 'dir'; cursize= '';};

  	folder.innerHTML+=('<div class="block">'+'<img src="img/'+curtype+'.png" alt="directory" class="block__img">'+'<div class="block__name">'+data[i].basename+cursize+'</div>'+'      <div class="block-delete"><span class="block-delete__line"></span><span class="block-delete__line block-delete__line--right"></span></div>');
  	retblock.innerHTML='<div class="header__back">&#8592;</div>';
  }

  //Блок для добавление новой папки
  folder.innerHTML+=('<div class="block"><div class="block__plus"></div><div class="block__name">Добавить новую папку</div></div>')

  //Открытие модального окна для добавления новой папки
  getByClass('block__plus')[0].addEventListener('click', function() {
     show(cloakscreen);
     show(mw_newfolder);
  } );

  //Создание новой папки
  getByClass('screen-form')[0].innerHTML=('<input id="folder_name" class="screen-form__name"></input>'+
  '<input class="screen-form__button" type="button" id="sumbit" value="Создать">');
  getByID('sumbit').addEventListener("click", function() {
    //console.log(document.getElementById('folder_name').value);
    HttpRequest(path+'/?cref='+document.getElementById('folder_name').value);
    hide(cloakscreen);
    hide(mw_newfolder);
    clearScreen(folder);
    drawPage(path);
  });

  //Кнопка возврата
  let return_button =  getByClass('header__back')[0];
  if (path!='/main') {
    return_button.addEventListener("click", function() {
      let a = path.split('/');
      let newpath = '';
      for (let i=1;i<(a.length-1);i++) {
        newpath+= '/' + a[i];
      }
      clearScreen(folder);
      drawPage(newpath);
    });
  }
  //Закрытие модального окна при нажатии на фон
  cloakscreen.addEventListener('click', function() {
    hide(cloakscreen);
    hide(mw_newfolder);
    hide(mw_delete);
  } );

  /*Переход по папкам, удаление файлов и папок; при нажатии на папку очищается экран и снова вызывается отрисовка окна*/
  for(let i=0;i<data.length;i++){
    let block = getByClass('block')[i];

    block.firstChild.addEventListener('click', function() {
      if (data[i].is_file != true) {
        path += '/' + data[i].basename;
        clearScreen(folder);
        drawPage(path);
      } else {
        window.location.href = path + '/' + data[i].basename;
      }
    });

    block.lastChild.addEventListener('click', function() {
      show(cloakscreen);
      mw_delete.childNodes[1].innerHTML='Вы точно хотите удалить '+ data[i].basename +'?';
      delete_yes.innerHTML='<div>Да</div>';

      delete_yes.lastChild.addEventListener('click', function() {
        HttpRequest(path+'/?del='+data[i].basename)
        clearScreen(folder);
        drawPage(path);
      });

      show(mw_delete);
    });
  }

}

var pa = '/main';
drawPage(pa);
