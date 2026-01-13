// Fuso horário de São Paulo (UTC-3)
const SAO_PAULO_OFFSET = -3;

// Quando extensão é instalada
chrome.runtime.onInstalled.addListener(() => {
  console.log('✅ Extensão instalada - v4.0');
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
    console.log('⏰ Alarme disparado, verificando configurações...');
    checkAndExecute();
  }
});

// Obter hora atual de São Paulo
function getSaoPauloTime() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const saoPauloTime = new Date(utc + (SAO_PAULO_OFFSET * 3600000));
  return saoPauloTime;
}

// Verificar se está no horário específico
function isInScheduledTime(startTime, endTime) {
  const now = getSaoPauloTime();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  // Verificar se o período atravessa a meia-noite
  if (endMinutes < startMinutes) {
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }
  
  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
}

// Verificar condições e executar
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
    console.log('❌ Extensão não está ativa');
    return;
  }
  
  console.log('📊 Configurações:', settings);
  console.log('🕐 Hora atual (São Paulo):', getSaoPauloTime().toLocaleTimeString('pt-BR'));
  
  // Verificar se deve usar delay especial (horário específico)
  if (settings.scheduleEnabled && settings.startTime && settings.endTime) {
    const inSchedule = isInScheduledTime(settings.startTime, settings.endTime);
    console.log(`📅 Horário específico ${settings.startTime}-${settings.endTime}: ${inSchedule ? 'DENTRO' : 'FORA'}`);
    
    if (inSchedule) {
      // Usar delay especial
      console.log(`⚡ Usando delay especial: ${settings.specialDelayValue} ${settings.specialDelayUnit}`);
    } else {
      // Usar delay normal
      console.log(`⏱️ Usando delay normal: ${settings.delayValue} ${settings.delayUnit}`);
    }
  }
  
  // Executar a ação
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
  
  // Converter horas para minutos se necessário
  if (settings.delayUnit === 'hours') {
    periodInMinutes *= 60;
  }
  
  // Verificar se está no horário especial
  if (settings.scheduleEnabled && settings.startTime && settings.endTime) {
    if (isInScheduledTime(settings.startTime, settings.endTime)) {
      periodInMinutes = parseInt(settings.specialDelayValue) || 5;
      if (settings.specialDelayUnit === 'hours') {
        periodInMinutes *= 60;
      }
      console.log(`🕐 Dentro do horário especial, usando delay: ${periodInMinutes} min`);
    }
  }
  
  // Chrome alarms mínimo é 1 minuto
  periodInMinutes = Math.max(1, periodInMinutes);
  
  chrome.alarms.create('autoRemove', {
    periodInMinutes: periodInMinutes
  });
  
  console.log(`🚀 Timer iniciado: a cada ${periodInMinutes} minuto(s)`);
  
  // Configurar verificação periódica para atualizar o timer quando entrar/sair do horário especial
  if (settings.scheduleEnabled) {
    // Verificar a cada minuto para ajustar o timer
    chrome.alarms.create('checkSchedule', {
      periodInMinutes: 1
    });
  }
}

// Parar timer
function stopTimer() {
  chrome.alarms.clear('autoRemove');
  chrome.alarms.clear('checkSchedule');
  console.log('🔴 Timer parado');
}

// Listener para verificar mudança de horário
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'checkSchedule') {
    const settings = await chrome.storage.local.get(['autoActive', 'scheduleEnabled']);
    if (settings.autoActive && settings.scheduleEnabled) {
      // Recriar o timer com o delay correto
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
  
  console.log(`📑 Encontradas ${facebookTabs.length} abas do Facebook WhatsApp`);
  
  for (let i = 0; i < facebookTabs.length; i++) {
    const tab = facebookTabs[i];
    console.log(`🔄 Processando aba ${i + 1}/${facebookTabs.length}`);
    
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: removeNumber
      });
      
      console.log(`✅ Aba ${i + 1} processada`);
      
      // Delay de 10 segundos entre abas
      if (i < facebookTabs.length - 1) {
        await sleep(10000);
      }
      
    } catch (error) {
      console.error(`❌ Erro na aba ${i + 1}:`, error);
    }
  }
  
  console.log('🎉 Todas as abas processadas!');
}

// Função que remove o número
async function removeNumber() {
  console.log('🗑️ Iniciando remoção...');
  
  // Esperar 3 segundos
  await new Promise(r => setTimeout(r, 3000));
  
  console.log('🔍 Procurando botões...');
  console.log('Total de botões na página:', document.querySelectorAll('div[role="button"]').length);
  
  let btnRemove = document.querySelector('[aria-label*="Remover o número do WhatsApp"]');
  console.log('Botão por aria-label:', btnRemove);
  
  if (!btnRemove) {
    const allButtons = Array.from(document.querySelectorAll('div[role="button"]'));
    console.log('Procurando por texto "Remover"...');
    
    btnRemove = allButtons.find(btn => {
      const text = btn.textContent || '';
      const hasRemover = text.includes('Remover');
      const hasIcon = btn.querySelector('svg') || btn.querySelector('[data-visualcompletion]');
      return hasRemover && hasIcon;
    });
    
    console.log('Botão encontrado por texto:', btnRemove);
    
    if (!btnRemove) {
      btnRemove = allButtons.find(btn => btn.textContent.includes('Remover'));
      console.log('Pegando primeiro botão com "Remover":', btnRemove);
    }
  }
  
  if (!btnRemove) {
    console.log('❌ Botão não encontrado');
    return;
  }
  
  console.log('✅ Clicando remover...');
  btnRemove.click();
  
  await new Promise(r => setTimeout(r, 1500));
  
  const btnConfirm = document.querySelector('[aria-label="Remove"]') || 
                     Array.from(document.querySelectorAll('div[role="button"]')).find(btn => 
                       btn.textContent.trim() === 'Remover' && btn.closest('[role="dialog"]')
                     );
  
  if (btnConfirm) {
    console.log('✅ Confirmando...');
    btnConfirm.click();
    
    await new Promise(r => setTimeout(r, 3000));
    console.log('🔄 Atualizando página...');
    location.reload();
  } else {
    console.log('❌ Botão de confirmação não encontrado');
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
});
