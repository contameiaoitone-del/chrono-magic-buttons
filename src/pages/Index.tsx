import { Download, Clock, Calendar, Zap, Shield, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/FeatureCard";
import { StepCard } from "@/components/StepCard";
import { useDownloadExtension } from "@/hooks/useDownloadExtension";

const Index = () => {
  const { downloadExtension, isDownloading } = useDownloadExtension();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        
        <div className="container relative pt-20 pb-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo */}
            <div className="mb-8 animate-fade-in">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-orange-dark animate-float glow-orange">
                <span className="text-5xl font-black text-primary-foreground">Z</span>
              </div>
            </div>
            
            {/* Title */}
            <h1 
              className="text-4xl md:text-6xl font-black mb-6 animate-fade-in"
              style={{ animationDelay: '100ms' }}
            >
              <span className="text-foreground">Zapdata </span>
              <span className="text-gradient">Rotator</span>
            </h1>
            
            {/* Subtitle */}
            <p 
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in"
              style={{ animationDelay: '200ms' }}
            >
              Automatize a rotacao de numeros do WhatsApp vinculados as suas paginas do Facebook 
              com delays personalizados e horarios especificos.
            </p>
            
            {/* CTA Button */}
            <div 
              className="animate-fade-in"
              style={{ animationDelay: '300ms' }}
            >
              <Button
                size="lg"
                onClick={downloadExtension}
                disabled={isDownloading}
                className="bg-gradient-to-r from-primary to-orange-dark hover:from-orange-dark hover:to-primary text-primary-foreground font-bold px-8 py-6 text-lg rounded-xl glow-orange transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:cursor-wait disabled:hover:scale-100"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Gerando ZIP...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Baixar Extensão v4.0
                  </>
                )}
              </Button>
              <p className="text-muted-foreground text-sm mt-4">
                Compatível com Google Chrome e navegadores baseados em Chromium
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-border">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Funcionalidades</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Recursos poderosos para automatizar suas tarefas no Facebook
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <FeatureCard
              icon={Clock}
              title="Delay Customizável"
              description="Configure o intervalo de tempo entre as ações em minutos ou horas conforme sua necessidade."
              delay={0}
            />
            <FeatureCard
              icon={Calendar}
              title="Horário Específico"
              description="Defina um período do dia com delay diferente. Perfeito para horários de pico."
              delay={100}
            />
            <FeatureCard
              icon={Zap}
              title="Execução Imediata"
              description="Execute a ação instantaneamente quando precisar, sem esperar o delay."
              delay={200}
            />
            <FeatureCard
              icon={RefreshCw}
              title="Multi-abas"
              description="Processa automaticamente todas as abas do Facebook abertas no navegador."
              delay={300}
            />
            <FeatureCard
              icon={Shield}
              title="Fuso de São Paulo"
              description="Usa o horário de Brasília (UTC-3) como referência para os agendamentos."
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-20 border-t border-border">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Interface Moderna</h2>
              <p className="text-muted-foreground">
                Design escuro e elegante com detalhes em laranja
              </p>
            </div>
            
            {/* Mock Extension Preview */}
            <div className="flex justify-center">
              <div className="w-80 bg-[#0a0a0a] rounded-2xl p-5 border border-border shadow-2xl">
                {/* Header */}
                <div className="text-center pb-4 border-b-2 border-primary mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-dark rounded-lg flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl font-black text-primary-foreground">Z</span>
                  </div>
                  <h3 className="text-primary font-bold text-sm">ZAPDATA ROTATOR</h3>
                </div>
                
                {/* Status */}
                <div className="bg-gradient-to-r from-primary to-orange-dark rounded-lg py-3 text-center mb-4">
                  <span className="text-primary-foreground font-bold text-sm">ATIVO (5 min)</span>
                </div>
                
                {/* Config Section */}
                <div className="bg-[#1a1a1a] rounded-lg p-4 mb-3 border border-[#2a2a2a]">
                  <p className="text-primary text-xs uppercase tracking-wider font-bold mb-3">CONFIGURAR DELAY</p>
                  <div className="flex gap-2">
                    <div className="bg-[#0a0a0a] border border-[#333] rounded-md px-3 py-2 text-foreground text-sm w-16 text-center">5</div>
                    <div className="bg-[#0a0a0a] border border-[#333] rounded-md px-3 py-2 text-foreground text-sm flex-1">Minutos</div>
                  </div>
                </div>
                
                {/* Buttons */}
                <button className="w-full bg-gradient-to-r from-red-500 to-red-600 text-primary-foreground py-3 rounded-lg font-bold text-sm mb-2">
                  DESATIVAR DELAY
                </button>
                <button className="w-full bg-[#1a1a1a] border-2 border-primary text-primary py-3 rounded-lg font-bold text-sm">
                  EXECUTAR AGORA
                </button>
                
                {/* Footer */}
                <div className="text-center mt-4 pt-4 border-t border-[#2a2a2a]">
                  <span className="text-muted-foreground text-xs">Criado por @joaolucassps</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Install */}
      <section className="py-20 border-t border-border">
        <div className="container px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Como Instalar</h2>
              <p className="text-muted-foreground">
                Siga estes passos simples para instalar a extensão
              </p>
            </div>
            
            <div className="space-y-6">
              <StepCard
                number={1}
                title="Baixe os arquivos"
                description="Clique no botão de download e extraia os arquivos em uma pasta."
              />
              <StepCard
                number={2}
                title="Acesse as extensões"
                description="Abra o Chrome e digite chrome://extensions na barra de endereço."
              />
              <StepCard
                number={3}
                title="Ative o modo desenvolvedor"
                description="No canto superior direito, ative a opção 'Modo do desenvolvedor'."
              />
              <StepCard
                number={4}
                title="Carregue a extensão"
                description="Clique em 'Carregar sem compactação' e selecione a pasta com os arquivos."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border">
        <div className="container px-4">
          <div className="text-center">
            <a 
              href="https://instagram.com/joaolucassps" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              Criado por @joaolucassps
            </a>
            <p className="text-muted-foreground/50 text-xs mt-2">
              Zapdata Rotator v4.0 - Todos os direitos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
