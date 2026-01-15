// Elementos
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

// Carregar configurações salvas
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
  // Usar !== undefined para permitir valores como 0 ou strings vazias
  if (result.delayValue !== undefined) delayValue.value = result.delayValue;
  if (result.delayUnit !== undefined) delayUnit.value = result.delayUnit;
  if (result.scheduleEnabled) {
    scheduleToggle.checked = true;
    timeConfig.classList.add('visible');
  }
  if (result.startTime !== undefined) startTime.value = result.startTime;
  if (result.endTime !== undefined) endTime.value = result.endTime;
  if (result.specialDelayValue !== undefined) specialDelayValue.value = result.specialDelayValue;
  if (result.specialDelayUnit !== undefined) specialDelayUnit.value = result.specialDelayUnit;

  // Importante: atualizar UI depois de restaurar os valores (senão mostra 1 min mesmo com 10h salvo)
  updateUI(result.autoActive || false);
});

// Toggle horário específico
scheduleToggle.addEventListener('change', () => {
  if (scheduleToggle.checked) {
    timeConfig.classList.add('visible');
  } else {
    timeConfig.classList.remove('visible');
  }
  saveSettings();
});

// Salvar configurações ao alterar - usar tanto change quanto input para capturar todas as alterações
[delayValue, specialDelayValue].forEach(el => {
  el.addEventListener('input', saveSettings);
  el.addEventListener('change', saveSettings);
});
[delayUnit, startTime, endTime, specialDelayUnit].forEach(el => {
  el.addEventListener('change', saveSettings);
});
scheduleToggle.addEventListener('change', saveSettings);

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

// Botão Executar com Delay
delayBtn.addEventListener('click', () => {
  const isActive = delayBtn.classList.contains('active');
  
  if (isActive) {
    chrome.runtime.sendMessage({ action: 'stop' }, () => {
      updateUI(false);
    });
  } else {
    saveSettings();
    // Salvar momento de ativação
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

// Botão Executar Agora
runBtn.addEventListener('click', () => {
  runBtn.disabled = true;
  runBtn.textContent = '⏳ EXECUTANDO...';
  
  chrome.runtime.sendMessage({ action: 'runNow' }, () => {
    runBtn.textContent = '✅ CONCLUÍDO!';
    setTimeout(() => {
      runBtn.textContent = '⚡ EXECUTAR AGORA';
      runBtn.disabled = false;
    }, 2000);
  });
});

// Atualizar UI
function updateUI(isActive) {
  const delayText = `${delayValue.value} ${delayUnit.value === 'minutes' ? 'min' : 'h'}`;
  
  if (isActive) {
    statusDiv.className = 'status active';
    statusDiv.textContent = `✅ ATIVO (${delayText})`;
    delayBtn.classList.add('active');
    delayBtn.textContent = '🔴 DESATIVAR DELAY';
  } else {
    statusDiv.className = 'status inactive';
    statusDiv.textContent = '⏸️ INATIVO';
    delayBtn.classList.remove('active');
    delayBtn.textContent = '🟢 EXECUTAR COM DELAY';
  }
}
