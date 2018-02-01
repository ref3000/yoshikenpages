var userName = location.search.substring(1);

$(function () {
  // setup tabs
  Store.tabs.forEach(function (v) {
    addTab(v.id, v.text);
  });

  $.ajax({
    type: 'GET',
    url: 'https://script.google.com/macros/s/AKfycbxLgFVykNkKiKxMpkIxu4Pt0Zlv06BecGmX8lJzJ13C44GwiBQ/exec?q=' + userName,
    dataType: 'json',
    success: function (sheet) {
      if (sheet.name == null) {
        document.getElementById('name-area').textContent = "Insuccesso del loading...potresti contattare all'amministratore ?";
        return;
      }
      var img = new Image();
      img.onload = function (e) {
        // setup buttons
        setupButtons(sheet.buttons);
        // setup namearea
        document.getElementById('name-area').textContent = 'Benvenuto/a signor(a) ' + sheet.name;
        // setup map-tab-area
        document.getElementById('map-tab-area').style.width = (img.width + 12) + 'px';
        // setup map
        var elm = document.getElementById('map');
        elm.style.width = img.width + 'px';
        elm.style.height = img.height + 'px';
        elm.style.backgroundImage = 'url(' + img.src + ')';
        // setup map-over
        var moElm = document.getElementById('map-over');
        moElm.style.width = elm.style.width;
        moElm.style.height = elm.style.height;
        moElm.style.marginTop = '-' + elm.style.height;

        // show tab 1
        document.getElementById('t1').click();
        document.getElementById('wrapper').style.visibility = 'visible';
      };
      img.src = sheet.mapUrl;
    },
    error: function (e) {
      console.log(e);
      document.getElementById('name-area').textContent = "Insuccesso del loading...potresti contattare all'amministratore ?";
    }
  });
});

Store = {
  activeTab: '',
  tabs: [
    // { id: 't0', text: '説明', color: '#6b6f59', desc: 'ここ説明ページ いらない？' },
    { id: 't1', text: 'Il ricevimento', color: '#006e54', desc: 'Potresti scegliere “il ricevimento”?' },
    { id: 't2', text: 'Il ristorante', color: '#d9a62e', desc: 'Potresti scegliere “il ristorante”?' },
    { id: 't3', text: 'Le camere', color: '#c53d43', desc: 'Potresti scegliere “le camere”?' },
    { id: 't4', text: 'Gli altri servizi', color: '#1e50a2', desc: 'Se ci siano gli altri edifici per gestire Albergo Diffuso, potresti sceglierli?' },
    { id: 't5', text: 'Le domande', color: '#c0c6c9', desc: 'Potresti rispondere queste domande?' }
  ],
  buttons: [],
  getTab: function (id) {
    for (var i = 0; i < Store.tabs.length; i++) {
      var v = Store.tabs[i];
      if (v.id === id) return v;
    };
  },
  toggleButton: function (id) {
    for (var i = 0; i < Store.buttons.length; i++) {
      var v = Store.buttons[i];
      if (v.id === id) {
        var pos = Store.getActiveTabPos();
        v.r[pos] = !v.r[pos];
        return v.r[pos];
      }
    };
  },
  getActiveTab: function () {
    return Store.tabs[Store.getActiveTabPos()];
  },
  getActiveTabPos: function () {
    for (var i = 0; i < Store.tabs.length; i++) {
      if (Store.tabs[i].id === Store.activeTab) return i;
    }
    return -1;
  }
};

function setupButtons(sheet) {
  if (sheet == null) return;
  // update store and setup buttons
  Store.buttons = [];
  for (var i = 0; i < sheet.length; i++) {
    var obj = {
      id: sheet[i][0],
      x: sheet[i][1],
      y: sheet[i][2],
      r: [
        sheet[i][3] ? true : false,
        sheet[i][4] ? true : false,
        sheet[i][5] ? true : false,
        sheet[i][6] ? true : false,
        sheet[i][7] ? true : false
      ]
    };
    if (!obj.id) continue;
    Store.buttons.push(obj);
    addButton(obj.id, obj.x, obj.y);
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
  btElm.style.left = (Number(x) - 10) + 'px';
  btElm.style.top = (Number(y) - 10) + 'px';
  // btElm.textContent = id;
  btElm.onclick = clickButton;
  document.getElementById('map').appendChild(btElm);
}

function clickTab(e) {
  Store.activeTab = e.target.id;
  // 1. change color
  // 2. set z-index to put forward active tab
  // 3. set description
  // 4. set visibility for tab5
  var tabs = document.getElementsByClassName('map-tab');
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].style.color = '#000';
    tabs[i].style.zIndex = 0;
  }
  var tab = Store.getTab(e.target.id);
  e.target.style.color = tab.color;
  e.target.style.zIndex = 20;
  document.getElementById('map-description').textContent = tab.desc;
  document.getElementById('map-area').style.borderColor = tab.color;
  document.getElementById('map-over').style.display = (e.target.id === 't5') ? 'block' : 'none';

  updateButtonColor();
  // omake
  document.getElementById('bg-button').style.visibility = (e.target.id === 't5') ? 'visible' : 'hidden';
}

function clickButton(e) {
  Store.toggleButton(e.target.id);
  updateButtonColor();
}

function updateButtonColor() {
  var color = Store.getActiveTab().color;
  var pos = Store.getActiveTabPos();
  Store.buttons.forEach(function (v) {
    if (Store.activeTab === 't5') { // omake
      for (var i = 0; i < 4; i++) {
        if (v.r[i]) document.getElementById(v.id).style.backgroundColor = Store.tabs[i].color;
      }
      return;
    }
    if (v.r[pos]) {
      document.getElementById(v.id).style.backgroundColor = color;
    } else {
      document.getElementById(v.id).style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    }
  });
}

function sendResult(e) {
  document.getElementById('send-button').disabled = true;
  document.getElementById('send-status').textContent = 'Sta trasmettendo…';
  $.ajax({
    type: 'POST',
    url: 'https://script.google.com/macros/s/AKfycbxLgFVykNkKiKxMpkIxu4Pt0Zlv06BecGmX8lJzJ13C44GwiBQ/exec',
    data: JSON.stringify(getPostObj()),
    dataType: 'json',
    success: function (d) {
      document.getElementById('send-button').disabled = false;
      document.getElementById('send-status').textContent = 'Successo della emissione. Grazie mille per la sua collaborazione.';
    },
    error: function (e) {
      console.log(e);
      document.getElementById('send-button').disabled = false;
      document.getElementById('send-status').textContent = "Insuccesso della emissione...potresti contattare all'amministratore?";
    }
  });
}

function getPostObj() {
  return {
    name: userName,
    r: getResearchArray(),
    b: getButtonArrays()
  };
}

function getButtonArrays() {
  var a = [];
  for (var i = 0; i < Store.buttons.length; i++) {
    var b = Store.buttons[i];
    a.push({ id: b.id, r: b.r });
  }
  return a;
}

function getResearchArray() {
  return [
    document.getElementById('q0').value,
    document.getElementById('q1').value,
    document.getElementById('q2').value,
    document.getElementById('q3').value,
    document.getElementById('q4').value,
    document.getElementById('q5').value,
    document.getElementById('q6').value,
    document.getElementById('q7').value,
    document.getElementById('q8').value,
    document.getElementById('q9').value,
    $('[name=q10]:checked').val()
  ];
}

function toggleResearchBG() { // omake
  var bgb = document.getElementById('bg-button');
  if (bgb.textContent === 'Show') {
    document.getElementById('map-over').style.backgroundColor = 'transparent';
    document.getElementById('research-form').style.backgroundColor = 'transparent';
    bgb.textContent = 'Hide'
  } else {
    document.getElementById('map-over').style.backgroundColor = '#eeeeee';
    document.getElementById('research-form').style.backgroundColor = '#afceff';
    bgb.textContent = 'Show'
  }
}