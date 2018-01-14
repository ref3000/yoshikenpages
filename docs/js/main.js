
window.onload = function () {
  console.log('onload');
  Store.tabs.forEach(function (v) {
    addTab(v.id, v.text)
  });
  Store.buttons.forEach(function (v) {
    addButton(v.id, v.x, v.y)
  });
};

Store = {
  tabs: [
    { id: 't1', text: 'レセプション', color: '#ff0000' },
    { id: 't2', text: 'レストラン', color: '#00ff00' },
    { id: 't3', text: '客室', color: '#0000ff' },
    { id: 't4', text: 'その他の施設', color: '#ffff00' },
    { id: 't5', text: '質問', color: '#00ffff' }
  ],
  buttons: [
    { id: 'bt1', x: 0, y: 0 },
    { id: 'bt2', x: 100, y: 100 },
    { id: 'bt3', x: 1000, y: 600 },
    { id: '444', x: 444, y: 444 },
    { id: '555', x: 555, y: 555 },
    { id: '666', x: 666, y: 666 }
  ],
  getTab: function (id) {
    for (var i = 0; i < Store.tabs.length; i++) {
      var v = Store.tabs[i];
      if (v.id === id) return v;
    };
  }
}
function addTab(id, text) {
  var tabElm = document.createElement('div');
  tabElm.id = id;
  tabElm.classList.add('map-tab');
  tabElm.textContent = text;
  tabElm.onclick = clickTab;
  document.getElementById('map-tab-area').appendChild(tabElm);
}

function addButton(id, x, y) {
  var btElm = document.createElement('div');
  btElm.id = id;
  btElm.classList.add('map-button');
  btElm.style.left = (Number(x) - 16) + 'px';
  btElm.style.top = (Number(y) - 16) + 'px';
  btElm.textContent = id;
  btElm.onclick = clickButton;
  document.getElementById('map').appendChild(btElm);
}

function clickTab(e) {
  var tabs = document.getElementsByClassName('map-tab');
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].style.color = '#000';
    tabs[i].style.zIndex = 0;
  }
  var elm = e.target;
  var color = Store.getTab(elm.id).color;
  elm.classList.remove('map-tab-nonactive');
  elm.style.color = color;
  elm.style.zIndex = 20;

  document.getElementById('map').style.borderColor = color;
  console.log('clickTab: ' + elm.id);
}

function clickButton(e) {
  var elm = e.target;
  elm.classList.toggle('map-button-active');
  console.log('clickButton: ' + elm.id);
}

function sendResult(e) {
  console.log('sendResult');
}

console.log('init');
