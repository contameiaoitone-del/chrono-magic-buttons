// Extension files content for ZIP generation

export const manifestJson = `{
  "manifest_version": 3,
  "name": "Zapdata Rotator",
  "version": "4.0",
  "description": "Remove automaticamente numeros do WhatsApp do Facebook",
  "permissions": ["activeTab", "scripting", "alarms", "tabs", "storage"],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icon.png",
      "48": "icon.png",
      "128": "icon.png"
    }
  },
  "icons": {
    "16": "icon.png",
    "48": "icon.png",
    "128": "icon.png"
  }
}`;

export const popupHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      width: 320px;
      padding: 20px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #000000;
      color: #ffffff;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #F67618;
    }
    .header img {
      width: 48px;
      height: 48px;
      margin-bottom: 8px;
    }
    .header h1 {
      font-size: 16px;
      color: #F67618;
      font-weight: bold;
    }
    .status {
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 16px;
      text-align: center;
      font-weight: bold;
      font-size: 14px;
    }
    .active { 
      background: linear-gradient(135deg, #F67618 0%, #d4630f 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(246, 118, 24, 0.3);
    }
    .inactive { 
      background: #111111;
      color: #888;
      border: 1px solid #222;
    }
    
    .section {
      background: #111111;
      border-radius: 10px;
      padding: 15px;
      margin-bottom: 12px;
      border: 1px solid #222;
    }
    .section-title {
      font-size: 12px;
      color: #F67618;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
      font-weight: bold;
    }
    
    .delay-config {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 12px;
    }
    .delay-config input {
      width: 70px;
      padding: 10px;
      border: 1px solid #222;
      border-radius: 6px;
      background: #000000;
      color: white;
      font-size: 14px;
      text-align: center;
    }
    .delay-config input:focus {
      outline: none;
      border-color: #F67618;
      box-shadow: 0 0 0 2px rgba(246, 118, 24, 0.2);
    }
    .delay-config select {
      flex: 1;
      padding: 10px;
      border: 1px solid #222;
      border-radius: 6px;
      background: #000000;
      color: white;
      font-size: 14px;
      cursor: pointer;
    }
    .delay-config select:focus {
      outline: none;
      border-color: #F67618;
    }
    
    .toggle-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .toggle-label {
      font-size: 13px;
      color: #ccc;
    }
    .toggle-switch {
      position: relative;
      width: 50px;
      height: 26px;
    }
    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    .toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #222;
      transition: 0.3s;
      border-radius: 26px;
    }
    .toggle-slider:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }
    .toggle-switch input:checked + .toggle-slider {
      background-color: #F67618;
    }
    .toggle-switch input:checked + .toggle-slider:before {
      transform: translateX(24px);
    }
    
    .time-config {
      display: none;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #222;
    }
    .time-config.visible {
      display: block;
    }
    .time-row {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 10px;
    }
    .time-row label {
      width: 50px;
      font-size: 12px;
      color: #888;
    }
    .time-row input[type="time"] {
      flex: 1;
      padding: 8px;
      border: 1px solid #222;
      border-radius: 6px;
      background: #000000;
      color: white;
      font-size: 13px;
    }
    .time-row input[type="time"]:focus {
      outline: none;
      border-color: #F67618;
    }
    .special-delay-label {
      font-size: 12px;
      color: #888;
      margin-bottom: 8px;
      display: block;
    }
    
    button {
      width: 100%;
      padding: 14px;
      margin-bottom: 10px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      transition: all 0.3s ease;
    }
    #delayBtn {
      background: linear-gradient(135deg, #F67618 0%, #d4630f 100%);
      color: white;
    }
    #delayBtn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(246, 118, 24, 0.4);
    }
    #delayBtn.active {
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    }
    #runBtn {
      background: #000000;
      color: #F67618;
      border: 2px solid #F67618;
    }
    #runBtn:hover {
      background: #F67618;
      color: white;
    }
    #runBtn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .footer {
      text-align: center;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #222;
    }
    .footer a {
      color: #888;
      text-decoration: none;
      font-size: 11px;
      transition: color 0.3s;
    }
    .footer a:hover {
      color: #F67618;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="icon.png" alt="Logo">
    <h1>ZAPDATA ROTATOR</h1>
  </div>
  
  <div id="status" class="status inactive">INATIVO</div>
  
  <div class="section">
    <div class="section-title">CONFIGURAR DELAY</div>
    <div class="delay-config">
      <input type="number" id="delayValue" min="1" max="999" value="1" placeholder="1">
      <select id="delayUnit">
        <option value="minutes">Minutos</option>
        <option value="hours">Horas</option>
      </select>
    </div>
  </div>
  
  <div class="section">
    <div class="section-title">HORARIO ESPECIFICO</div>
    <div class="toggle-row">
      <span class="toggle-label">Ativar delay por horario</span>
      <label class="toggle-switch">
        <input type="checkbox" id="scheduleToggle">
        <span class="toggle-slider"></span>
      </label>
    </div>
    <div id="timeConfig" class="time-config">
      <div class="time-row">
        <label>Inicio:</label>
        <input type="time" id="startTime" value="09:00">
      </div>
      <div class="time-row">
        <label>Fim:</label>
        <input type="time" id="endTime" value="18:00">
      </div>
      <span class="special-delay-label">Delay durante este periodo:</span>
      <div class="delay-config">
        <input type="number" id="specialDelayValue" min="1" max="999" value="5" placeholder="5">
        <select id="specialDelayUnit">
          <option value="minutes">Minutos</option>
          <option value="hours">Horas</option>
        </select>
      </div>
    </div>
  </div>
  
  <button id="delayBtn">EXECUTAR COM DELAY</button>
  <button id="runBtn">EXECUTAR AGORA</button>
  
  <div class="footer">
    <a href="https://instagram.com/joaolucassps" target="_blank">Criado por @joaolucassps</a>
  </div>
  
  <script src="popup.js"></script>
</body>
</html>`;

export const popupJs = `// Elementos
const statusDiv = document.getElementById('status');
const delayBtn = document.getElementById('delayBtn');
const runBtn = document.getElementById('runBtn');
const delayValue = document.getElementById('delayValue');
const delayUnit = document.getElementById('delayUnit');
const scheduleToggle = document.getElementById('scheduleToggle');
const timeConfig = document.getElementById('timeConfig');
const startTime = document.getElementById('startTime');
const endTime = document.getElementById('endTime');
const specialDelayValue = document.getElementById('specialDelayValue');
const specialDelayUnit = document.getElementById('specialDelayUnit');

// Carregar configuracoes salvas
chrome.storage.local.get([
  'autoActive',
  'delayValue',
  'delayUnit',
  'scheduleEnabled',
  'startTime',
  'endTime',
  'specialDelayValue',
  'specialDelayUnit',
  'activationTime'
], (result) => {
  updateUI(result.autoActive || false);
  
  if (result.delayValue) delayValue.value = result.delayValue;
  if (result.delayUnit) delayUnit.value = result.delayUnit;
  if (result.scheduleEnabled) {
    scheduleToggle.checked = true;
    timeConfig.classList.add('visible');
  }
  if (result.startTime) startTime.value = result.startTime;
  if (result.endTime) endTime.value = result.endTime;
  if (result.specialDelayValue) specialDelayValue.value = result.specialDelayValue;
  if (result.specialDelayUnit) specialDelayUnit.value = result.specialDelayUnit;
});

// Toggle horario especifico
scheduleToggle.addEventListener('change', () => {
  if (scheduleToggle.checked) {
    timeConfig.classList.add('visible');
  } else {
    timeConfig.classList.remove('visible');
  }
  saveSettings();
});

// Salvar configuracoes ao alterar
[delayValue, delayUnit, startTime, endTime, specialDelayValue, specialDelayUnit].forEach(el => {
  el.addEventListener('change', saveSettings);
});

function saveSettings() {
  chrome.storage.local.set({
    delayValue: parseInt(delayValue.value) || 1,
    delayUnit: delayUnit.value,
    scheduleEnabled: scheduleToggle.checked,
    startTime: startTime.value,
    endTime: endTime.value,
    specialDelayValue: parseInt(specialDelayValue.value) || 5,
    specialDelayUnit: specialDelayUnit.value
  });
}

// Botao Executar com Delay
delayBtn.addEventListener('click', () => {
  const isActive = delayBtn.classList.contains('active');
  
  if (isActive) {
    chrome.runtime.sendMessage({ action: 'stop' }, () => {
      updateUI(false);
    });
  } else {
    saveSettings();
    chrome.storage.local.set({ activationTime: Date.now() });
    chrome.runtime.sendMessage({ 
      action: 'start',
      config: {
        delayValue: parseInt(delayValue.value) || 1,
        delayUnit: delayUnit.value,
        scheduleEnabled: scheduleToggle.checked,
        startTime: startTime.value,
        endTime: endTime.value,
        specialDelayValue: parseInt(specialDelayValue.value) || 5,
        specialDelayUnit: specialDelayUnit.value
      }
    }, () => {
      updateUI(true);
    });
  }
});

// Botao Executar Agora
runBtn.addEventListener('click', () => {
  runBtn.disabled = true;
  runBtn.textContent = 'EXECUTANDO...';
  
  chrome.runtime.sendMessage({ action: 'runNow' }, () => {
    runBtn.textContent = 'CONCLUIDO!';
    setTimeout(() => {
      runBtn.textContent = 'EXECUTAR AGORA';
      runBtn.disabled = false;
    }, 2000);
  });
});

// Atualizar UI
function updateUI(isActive) {
  const delayText = \`\${delayValue.value} \${delayUnit.value === 'minutes' ? 'min' : 'h'}\`;
  
  if (isActive) {
    statusDiv.className = 'status active';
    statusDiv.textContent = \`ATIVO (\${delayText})\`;
    delayBtn.classList.add('active');
    delayBtn.textContent = 'DESATIVAR DELAY';
  } else {
    statusDiv.className = 'status inactive';
    statusDiv.textContent = 'INATIVO';
    delayBtn.classList.remove('active');
    delayBtn.textContent = 'EXECUTAR COM DELAY';
  }
}`;

export const backgroundJs = `// Fuso horario de Sao Paulo (UTC-3)
const SAO_PAULO_OFFSET = -3;

// Quando extensao e instalada
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extensao instalada - v4.0');
});

// Quando navegador inicia
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(['autoActive'], (result) => {
    if (result.autoActive) {
      startTimer();
    }
  });
});

// Escutar alarme
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'autoRemove') {
    console.log('Alarme disparado, verificando configuracoes...');
    checkAndExecute();
  }
});

// Obter hora atual de Sao Paulo
function getSaoPauloTime() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const saoPauloTime = new Date(utc + (SAO_PAULO_OFFSET * 3600000));
  return saoPauloTime;
}

// Verificar se esta no horario especifico
function isInScheduledTime(startTime, endTime) {
  const now = getSaoPauloTime();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  if (endMinutes < startMinutes) {
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }
  
  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
}

// Verificar condicoes e executar
async function checkAndExecute() {
  const settings = await chrome.storage.local.get([
    'autoActive',
    'delayValue',
    'delayUnit',
    'scheduleEnabled',
    'startTime',
    'endTime',
    'specialDelayValue',
    'specialDelayUnit',
    'activationTime'
  ]);
  
  if (!settings.autoActive) {
    console.log('Extensao nao esta ativa');
    return;
  }
  
  console.log('Configuracoes:', settings);
  console.log('Hora atual (Sao Paulo):', getSaoPauloTime().toLocaleTimeString('pt-BR'));
  
  if (settings.scheduleEnabled && settings.startTime && settings.endTime) {
    const inSchedule = isInScheduledTime(settings.startTime, settings.endTime);
    console.log(\`Horario especifico \${settings.startTime}-\${settings.endTime}: \${inSchedule ? 'DENTRO' : 'FORA'}\`);
    
    if (inSchedule) {
      console.log(\`Usando delay especial: \${settings.specialDelayValue} \${settings.specialDelayUnit}\`);
    } else {
      console.log(\`Usando delay normal: \${settings.delayValue} \${settings.delayUnit}\`);
    }
  }
  
  executeOnAllTabs();
}

// Iniciar timer com delay configurado
async function startTimer() {
  const settings = await chrome.storage.local.get([
    'delayValue',
    'delayUnit',
    'scheduleEnabled',
    'startTime',
    'endTime',
    'specialDelayValue',
    'specialDelayUnit'
  ]);
  
  let periodInMinutes = (parseInt(settings.delayValue) || 1);
  
  if (settings.delayUnit === 'hours') {
    periodInMinutes *= 60;
  }
  
  if (settings.scheduleEnabled && settings.startTime && settings.endTime) {
    if (isInScheduledTime(settings.startTime, settings.endTime)) {
      periodInMinutes = parseInt(settings.specialDelayValue) || 5;
      if (settings.specialDelayUnit === 'hours') {
        periodInMinutes *= 60;
      }
      console.log(\`Dentro do horario especial, usando delay: \${periodInMinutes} min\`);
    }
  }
  
  periodInMinutes = Math.max(1, periodInMinutes);
  
  chrome.alarms.create('autoRemove', {
    periodInMinutes: periodInMinutes
  });
  
  console.log(\`Timer iniciado: a cada \${periodInMinutes} minuto(s)\`);
  
  if (settings.scheduleEnabled) {
    chrome.alarms.create('checkSchedule', {
      periodInMinutes: 1
    });
  }
}

// Parar timer
function stopTimer() {
  chrome.alarms.clear('autoRemove');
  chrome.alarms.clear('checkSchedule');
  console.log('Timer parado');
}

// Listener para verificar mudanca de horario
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'checkSchedule') {
    const settings = await chrome.storage.local.get(['autoActive', 'scheduleEnabled']);
    if (settings.autoActive && settings.scheduleEnabled) {
      await startTimer();
    }
  }
});

// Executar em todas as abas do Facebook WhatsApp
async function executeOnAllTabs() {
  const tabs = await chrome.tabs.query({});
  
  const facebookTabs = tabs.filter(tab => 
    tab.url && tab.url.includes('facebook.com/settings') && tab.url.includes('linked_whatsapp')
  );
  
  console.log(\`Encontradas \${facebookTabs.length} abas do Facebook WhatsApp\`);
  
  for (let i = 0; i < facebookTabs.length; i++) {
    const tab = facebookTabs[i];
    console.log(\`Processando aba \${i + 1}/\${facebookTabs.length}\`);
    
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: removeNumber
      });
      
      console.log(\`Aba \${i + 1} processada\`);
      
      if (i < facebookTabs.length - 1) {
        await sleep(10000);
      }
      
    } catch (error) {
      console.error(\`Erro na aba \${i + 1}:\`, error);
    }
  }
  
  console.log('Todas as abas processadas!');
}

// Funcao que remove o numero
async function removeNumber() {
  console.log('Iniciando remocao...');
  
  await new Promise(r => setTimeout(r, 3000));
  
  console.log('Procurando botoes...');
  console.log('Total de botoes na pagina:', document.querySelectorAll('div[role="button"]').length);
  
  let btnRemove = document.querySelector('[aria-label*="Remover o numero do WhatsApp"]');
  console.log('Botao por aria-label:', btnRemove);
  
  if (!btnRemove) {
    const allButtons = Array.from(document.querySelectorAll('div[role="button"]'));
    console.log('Procurando por texto "Remover"...');
    
    btnRemove = allButtons.find(btn => {
      const text = btn.textContent || '';
      const hasRemover = text.includes('Remover');
      const hasIcon = btn.querySelector('svg') || btn.querySelector('[data-visualcompletion]');
      return hasRemover && hasIcon;
    });
    
    console.log('Botao encontrado por texto:', btnRemove);
    
    if (!btnRemove) {
      btnRemove = allButtons.find(btn => btn.textContent.includes('Remover'));
      console.log('Pegando primeiro botao com "Remover":', btnRemove);
    }
  }
  
  if (!btnRemove) {
    console.log('Botao nao encontrado');
    return;
  }
  
  console.log('Clicando remover...');
  btnRemove.click();
  
  await new Promise(r => setTimeout(r, 1500));
  
  const btnConfirm = document.querySelector('[aria-label="Remove"]') || 
                     Array.from(document.querySelectorAll('div[role="button"]')).find(btn => 
                       btn.textContent.trim() === 'Remover' && btn.closest('[role="dialog"]')
                     );
  
  if (btnConfirm) {
    console.log('Confirmando...');
    btnConfirm.click();
    
    await new Promise(r => setTimeout(r, 3000));
    console.log('Atualizando pagina...');
    location.reload();
  } else {
    console.log('Botao de confirmacao nao encontrado');
  }
}

// Helper
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Escutar mensagens do popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'start') {
    chrome.storage.local.set({ 
      autoActive: true,
      ...request.config
    }, () => {
      startTimer();
      sendResponse({ success: true });
    });
  } else if (request.action === 'stop') {
    stopTimer();
    chrome.storage.local.set({ autoActive: false });
    sendResponse({ success: true });
  } else if (request.action === 'runNow') {
    executeOnAllTabs();
    sendResponse({ success: true });
  }
  return true;
});`;
