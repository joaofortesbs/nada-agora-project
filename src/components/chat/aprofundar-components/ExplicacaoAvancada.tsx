
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft } from 'lucide-react';
import TypewriterEffect from '@/components/ui/typewriter-effect';

interface ExplicacaoAvancadaProps {
  handleBack: () => void;
  aprofundadoContent: {
    contexto: string;
    loading: boolean;
    termos: Array<{termo: string, definicao: string}>;
    aplicacoes: string;
  };
  generateAprofundadoContent: () => void;
}

const ExplicacaoAvancada: React.FC<ExplicacaoAvancadaProps> = ({ 
  handleBack, 
  aprofundadoContent, 
  generateAprofundadoContent 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center mb-2">
        <Button 
          onClick={handleBack} 
          variant="ghost" 
          size="sm" 
          className="mr-2 h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Explicação Avançada</h3>
      </div>

      <ScrollArea className="h-[60vh] pr-4">
        <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-xl p-4 border border-blue-100 dark:border-blue-900/30 mb-4">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            O conteúdo solicitado está sendo preparado para você. Aqui você encontrará uma versão expandida da resposta original da IA, incluindo explicações mais detalhadas, termos técnicos, aplicações do conteúdo, contexto histórico e comparações com conceitos semelhantes.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-base font-medium text-gray-900 dark:text-white mb-2">Contexto Aprofundado</h4>
            <div className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              {aprofundadoContent.loading ? (
                <div className="typewriter-loader p-4 bg-blue-50/40 dark:bg-blue-900/10 rounded-md border border-blue-100/50 dark:border-blue-800/30 animate-pulse">
                  Preparando análise detalhada do conteúdo... <span className="inline-block w-2 h-4 bg-blue-500 dark:bg-blue-400 animate-blink ml-1"></span>
                </div>
              ) : (
                aprofundadoContent.contexto ? (
                  <div className="relative bg-white/60 dark:bg-gray-800/60 rounded-lg border border-gray-200/70 dark:border-gray-700/50 p-4 shadow-sm">
                    <TypewriterEffect text={aprofundadoContent.contexto} typingSpeed={5} />
                    <button 
                      onClick={generateAprofundadoContent} 
                      className="absolute top-3 right-3 p-1.5 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-600 dark:text-blue-400 rounded-md transition-colors text-xs flex items-center"
                      title="Gerar novo conteúdo"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Tentar novamente
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 dark:text-blue-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-center mb-3">Estamos com dificuldade para gerar o conteúdo detalhado. Por favor, tente novamente.</p>
                    <button 
                      onClick={generateAprofundadoContent} 
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors flex items-center shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      Gerar análise aprofundada
                    </button>
                  </div>
                )
              )}
            </div>
          </div>

          <div>
            <h4 className="text-base font-medium text-gray-900 dark:text-white mb-2">Termos Técnicos</h4>
            <div className="grid grid-cols-1 gap-3">
              {aprofundadoContent.loading ? (
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <span className="block font-medium text-blue-600 dark:text-blue-400 mb-1">Carregando termos...</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Os termos técnicos estão sendo preparados.</span>
                </div>
              ) : (
                Array.isArray(aprofundadoContent.termos) && aprofundadoContent.termos.length > 0 ? (
                  aprofundadoContent.termos.map((item, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                      <span className="block font-medium text-blue-600 dark:text-blue-400 mb-1">
                        {item.termo || "Termo Técnico"}
                      </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {item.definicao || "Definição não disponível"}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span className="block font-medium text-blue-600 dark:text-blue-400 mb-1">Processando termos técnicos</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Estamos extraindo os principais termos técnicos relacionados a este tema.
                      <button 
                        onClick={generateAprofundadoContent}
                        className="ml-2 text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Tentar novamente
                      </button>
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          <div>
            <h4 className="text-base font-medium text-gray-900 dark:text-white mb-2">Aplicações Expandidas</h4>
            <div className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              {aprofundadoContent.loading ? (
                <div className="typewriter-loader">Identificando aplicações...</div>
              ) : (
                aprofundadoContent.aplicacoes ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <TypewriterEffect text={aprofundadoContent.aplicacoes} typingSpeed={1} />
                  </div>
                ) : (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800">
                    <p>As aplicações estão sendo identificadas. Se esta mensagem persistir, clique no botão abaixo.</p>
                    <button 
                      onClick={generateAprofundadoContent} 
                      className="mt-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors"
                    >
                      Gerar aplicações
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ExplicacaoAvancada;
