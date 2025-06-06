import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  FileDown, 
  PenLine, 
  Eye, 
  CheckCircle, 
  FileLineChart, 
  RotateCw,
  Download,
  Clipboard,
  Maximize2,
  Save,
  X,
  SendHorizonal,
  Share2
} from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { ScrollArea } from '@/components/ui/scroll-area';
import FluxogramaVisualizer from './FluxogramaVisualizer';
import FluxogramaDetailModal from './FluxogramaDetailModal';
import FluxogramaItem from './FluxogramaItem';
import { Node } from 'reactflow';

interface GerarFluxogramaProps {
  handleBack: () => void;
  aprofundadoContent: {
    contexto: string;
  };
}

const GerarFluxograma: React.FC<GerarFluxogramaProps> = ({ 
  handleBack, 
  aprofundadoContent 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'ia' | 'manual' | null>(null);
  const [fluxogramaGerado, setFluxogramaGerado] = useState(false);
  const [showFluxograma, setShowFluxograma] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [manualContent, setManualContent] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [showSavedFluxogramas, setShowSavedFluxogramas] = useState(false);
  const [savedFluxogramas, setSavedFluxogramas] = useState<Array<{
    id: string;
    title: string;
    description?: string;
    date: string;
    data: any;
  }>>([]);

  // Carrega os fluxogramas salvos do localStorage
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('savedFluxogramas');
      if (savedData) {
        setSavedFluxogramas(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Erro ao carregar fluxogramas salvos:', error);
    }
  }, []);
  
  // Função para excluir um fluxograma salvo
  const handleDeleteFluxograma = (index: number) => {
    try {
      const updatedFluxogramas = [...savedFluxogramas];
      updatedFluxogramas.splice(index, 1);
      setSavedFluxogramas(updatedFluxogramas);
      localStorage.setItem('savedFluxogramas', JSON.stringify(updatedFluxogramas));
    } catch (error) {
      console.error('Erro ao excluir fluxograma:', error);
      alert('Erro ao excluir o fluxograma. Por favor, tente novamente.');
    }
  };

  const handleGenerateFlowchart = (option: 'ia' | 'manual') => {
    if (option === 'manual') {
      setSelectedOption(option);
      setShowManualInput(true);
      return;
    }

    setSelectedOption(option);
    setIsLoading(true);

    // Simula o processamento do fluxograma
    setTimeout(() => {
      setIsLoading(false);
      setFluxogramaGerado(true);
      // Aqui seria implementada a lógica real de geração do fluxograma
    }, 3000);
  };
  
  const handleSaveFluxograma = () => {
    try {
      // Obter os dados do fluxograma atual
      const fluxogramaData = localStorage.getItem('fluxogramaData');
      if (!fluxogramaData) {
        console.error('Nenhum fluxograma disponível para salvar');
        return;
      }
      
      // Criar um novo objeto para o fluxograma salvo
      const newSavedFluxograma = {
        id: `flux_${Date.now()}`,
        title: `Fluxograma ${savedFluxogramas.length + 1}`,
        description: selectedOption === 'manual' ? manualContent.substring(0, 100) + '...' : 'Gerado pela IA',
        date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }),
        data: JSON.parse(fluxogramaData)
      };
      
      // Adicionar à lista de fluxogramas salvos
      const updatedFluxogramas = [...savedFluxogramas, newSavedFluxograma];
      setSavedFluxogramas(updatedFluxogramas);
      
      // Salvar no localStorage
      localStorage.setItem('savedFluxogramas', JSON.stringify(updatedFluxogramas));
      
      // Mostrar mensagem de sucesso
      alert('Fluxograma salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar fluxograma:', error);
      alert('Erro ao salvar o fluxograma. Por favor, tente novamente.');
    }
  };
  
  const handleLoadSavedFluxograma = (fluxograma: any) => {
    try {
      // Salvar os dados do fluxograma selecionado para o visualizador
      localStorage.setItem('fluxogramaData', JSON.stringify(fluxograma.data));
      
      // Mostrar o visualizador
      setFluxogramaGerado(true);
      setShowFluxograma(true);
    } catch (error) {
      console.error('Erro ao carregar fluxograma:', error);
      alert('Erro ao carregar o fluxograma. Por favor, tente novamente.');
    }
  };

  const handleSubmitManualContent = () => {
    if (!manualContent.trim()) {
      return;
    }

    setIsLoading(true);
    setShowManualInput(false);

    // Processar o conteúdo e gerar o fluxograma
    const processFluxogramaContent = async () => {
      try {
        // ETAPA 1: Analisar o conteúdo usando a API de IA
        let fluxogramaData;

        // Determinar a fonte do conteúdo (IA ou manual)
        const contentToAnalyze = selectedOption === 'manual' 
          ? manualContent 
          : aprofundadoContent?.contexto || '';

        if (!contentToAnalyze.trim()) {
          throw new Error('Conteúdo vazio. Por favor, forneça um texto para gerar o fluxograma.');
        }

        // Usar a API de IA para gerar o fluxograma
        try {
          // Mostrar indicador de carregamento enquanto processa
          setIsLoading(true);

          // Importar o serviço de IA
          const { generateAIResponse } = await import('@/services/aiChatService');

          // Criar um ID de sessão único para esta solicitação
          const sessionId = `fluxograma_${Date.now()}`;

          // Prompt estruturado para a IA
          const prompt = `
Com base na seguinte explicação sobre o tema, gere um fluxograma interativo no formato do React Flow:

${contentToAnalyze}

Crie um fluxograma educacional estruturado em 5 camadas de aprendizado que:


  // Função para tornar os nós arrastáveis
  useEffect(() => {
    // Verificar se estamos no navegador antes de usar o DOM
    if (typeof window !== 'undefined') {
      const container = document.getElementById('flow-preview-container');
      const nodes = document.querySelectorAll('.draggable-node');
      
      if (container && nodes.length > 0) {
        nodes.forEach(node => {
          let isDragging = false;
          let startX = 0;
          let startY = 0;
          let initialX = 0;
          let initialY = 0;
          let currentX = 0;
          let currentY = 0;
          
          // Função para iniciar o arrasto
          const startDrag = (e: MouseEvent | TouchEvent) => {
            isDragging = true;
            
            if (e instanceof MouseEvent) {
              startX = e.clientX;
              startY = e.clientY;
            } else {
              startX = e.touches[0].clientX;
              startY = e.touches[0].clientY;
            }
            
            // Obter a posição atual do elemento
            const style = window.getComputedStyle(node);
            const transform = style.transform;
            
            // Extrair a matriz de transformação atual
            if (transform !== 'none') {
              const matrix = new DOMMatrix(transform);
              initialX = matrix.e;
              initialY = matrix.f;
            } else {
              initialX = 0;
              initialY = 0;
            }
            
            currentX = initialX;
            currentY = initialY;
            
            node.classList.add('scale-105');
            node.classList.add('shadow-lg');
            
            // Adicionar eventos de movimento e fim do arrasto
            document.addEventListener('mousemove', drag);
            document.addEventListener('touchmove', drag, { passive: false });
            document.addEventListener('mouseup', endDrag);
            document.addEventListener('touchend', endDrag);
          };
          
          // Função para realizar o arrasto
          const drag = (e: MouseEvent | TouchEvent) => {
            if (!isDragging) return;
            
            e.preventDefault();
            
            let clientX: number, clientY: number;
            
            if (e instanceof MouseEvent) {
              clientX = e.clientX;
              clientY = e.clientY;
            } else {
              clientX = e.touches[0].clientX;
              clientY = e.touches[0].clientY;
            }
            
            // Calcular a nova posição
            const deltaX = clientX - startX;
            const deltaY = clientY - startY;
            
            currentX = initialX + deltaX;
            currentY = initialY + deltaY;
            
            // Limitar o movimento aos limites do container
            const rect = node.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            
            if (rect.left + deltaX < containerRect.left) {
              currentX = initialX + (containerRect.left - rect.left);
            }
            if (rect.right + deltaX > containerRect.right) {
              currentX = initialX + (containerRect.right - rect.right);
            }
            if (rect.top + deltaY < containerRect.top) {
              currentY = initialY + (containerRect.top - rect.top);
            }
            if (rect.bottom + deltaY > containerRect.bottom) {
              currentY = initialY + (containerRect.bottom - rect.bottom);
            }
            
            // Aplicar a transformação
            node.style.transform = "translate(" + currentX + "px, " + currentY + "px) scale(1.05)";
          };
          
          // Função para finalizar o arrasto
          const endDrag = () => {
            isDragging = false;
            node.classList.remove('scale-105');
            node.classList.remove('shadow-lg');
            node.style.transform = "translate(" + currentX + "px, " + currentY + "px)";
            
            // Remover eventos de arrasto
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('mouseup', endDrag);
            document.removeEventListener('touchend', endDrag);
          };
          
          // Adicionar eventos de início de arrasto
          node.addEventListener('mousedown', startDrag);
          node.addEventListener('touchstart', startDrag, { passive: true });
          
          // Prevenir o comportamento padrão de drag and drop do navegador
          node.addEventListener('dragstart', (e) => e.preventDefault());
        });
      }
    }
    
    // Cleanup quando o componente for desmontado
    return () => {
      if (typeof window !== 'undefined') {
        const nodes = document.querySelectorAll('.draggable-node');
        nodes.forEach(node => {
          node.removeEventListener('mousedown', () => {});
          node.removeEventListener('touchstart', () => {});
          node.removeEventListener('dragstart', () => {});
        });
      }
    };
  }, [selectedOption, showManualInput, fluxogramaGerado]);

1. Comece com um CONCEITO CENTRAL (nó inicial):
   - Defina o tema de forma objetiva e clara
   - Ex: "O que é fotossíntese?"

2. Adicione CONTEXTUALIZAÇÃO E PRÉ-REQUISITOS:
   - Conhecimentos prévios necessários
   - Termos importantes para entender o tema
   - Base científica/histórica relevante

3. Detalhe o PROCESSO, MECANISMO OU LÓGICA DO TEMA:
   - Passo a passo da explicação em etapas numeradas
   - Fluxo de causa e efeito
   - Ex: "Etapa 1: Captação de luz → Etapa 2: Transformação química → Etapa 3: Liberação de oxigênio"

4. Inclua uma CAMADA DE APLICAÇÃO/PRÁTICA:
   - Exemplos práticos ou situações-problema
   - Destaque erros comuns e dicas
   - Inclua nós de decisão do tipo: "Se o aluno pensar A → Mostrar que está errado" / "Se pensar B → Está correto"

5. Finalize com CONCLUSÃO OU RESULTADO FINAL:
   - Síntese do aprendizado
   - Resumo visual
   - Dica de ouro ou aplicação em provas

Adicione ELEMENTOS EXTRAS distribuídos no fluxograma:
- Tópicos Relacionados (possíveis conexões para novos fluxos)
- Comparações entre conceitos (quando aplicável)
- Aplicações na vida real
- Alertas sobre equívocos comuns

Para cada nó (node), inclua:
- id: único (numérico ou string)
- title: título curto e claro
- description: explicação resumida
- type: um dos seguintes ("start", "context", "process", "practice", "decision", "tip", "end")
- position: coordenadas x e y (posicione os nós em camadas, ex: y: 0, y: 100, y: 200...)

Para cada conexão (edge), inclua:
- id: formado por "eID1-ID2" (concatenando os IDs de origem e destino)
- source: ID do nó de origem
- target: ID do nó de destino
- label: descrição da relação (ex: "Segue para", "Sim", "Não")
- type: "smoothstep" para fluidez visual
- animated: true para conexões importantes

IMPORTANTE: Conecte todos os nós em sequência lógica de aprendizado, e se houver ramificações (ex: exemplos, erros), conecte como saídas alternativas do nó anterior.

Dicas para posicionamento visual:
- Posicione os y dos nós em camadas (0px, 100px, 200px, 300px...)
- Varie o x para ramificações (ex: x: 100, x: 250, x: 400)
- Use animated: true nos edges para as setas se moverem nas conexões importantes

Retorne o resultado como um objeto JSON com a seguinte estrutura:
{
  "nodes": [
    {
      "id": "1",
      "title": "O que é Fotossíntese?",
      "description": "Processo biológico pelo qual plantas transformam luz em energia",
      "type": "start",
      "position": { "x": 100, "y": 0 }
    },
    ...
  ],
  "edges": [
    {
      "id": "e1-2",
      "source": "1",
      "target": "2",
      "label": "Segue para",
      "type": "smoothstep",
      "animated": true
    },
    ...
  ]
}
`;

          // Chamar a API de IA com o prompt estruturado
          const response = await generateAIResponse(prompt, sessionId, {
            intelligenceLevel: 'advanced',
            detailedResponse: true
          });

          // Extrair o JSON da resposta
          let extractedData;
          try {
            // Tenta encontrar o JSON na resposta
            const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || 
                             response.match(/```\n([\s\S]*?)\n```/) ||
                             response.match(/{[\s\S]*?}/);

            const jsonString = jsonMatch ? jsonMatch[0].replace(/```json\n|```\n|```/g, '') : response;
            extractedData = JSON.parse(jsonString);
            
            // Normalize data structure - ensure we have both nodes and edges
            if (!extractedData.edges && extractedData.connections) {
              // Convert connections to edges if needed
              extractedData.edges = extractedData.connections.map(conn => ({
                id: `e${conn.source}-${conn.target}`,
                source: conn.source,
                target: conn.target,
                label: conn.label || '',
                type: 'smoothstep',
                animated: conn.animated || false
              }));
            } else if (!extractedData.edges) {
              // Create default edges if none provided
              extractedData.edges = [];
              // If we have nodes, create sequential edges between them
              if (extractedData.nodes && extractedData.nodes.length > 1) {
                for (let i = 0; i < extractedData.nodes.length - 1; i++) {
                  extractedData.edges.push({
                    id: `e${extractedData.nodes[i].id}-${extractedData.nodes[i+1].id}`,
                    source: extractedData.nodes[i].id,
                    target: extractedData.nodes[i+1].id,
                    label: 'Segue para',
                    type: 'smoothstep',
                    animated: true
                  });
                }
              }
            }
          } catch (error) {
            console.error('Erro ao extrair JSON da resposta da IA:', error);

            // Se falhar em extrair o JSON, criar uma estrutura padrão baseada no texto
            // Implementação de fallback similar à original
            const paragraphs = contentToAnalyze.split(/\n\n+/);
            const sentences = contentToAnalyze.split(/[.!?]\s+/);

            const mainBlocks = paragraphs.length > 3 ? paragraphs.slice(0, paragraphs.length) : sentences.slice(0, Math.min(8, sentences.length));

            const keywords = mainBlocks.map(block => {
              const words = block.split(/\s+/).filter(word => word.length > 3);
              const mainWord = words.find(word => word.length > 5) || words[0] || 'Conceito';
              return {
                text: block,
                keyword: mainWord.length > 20 ? mainWord.substring(0, 20) + '...' : mainWord
              };
            }).slice(0, 8);

            // Preparar os dados no formato esperado
            const nodes = keywords.map((item, index) => ({
              id: (index + 1).toString(),
              title: item.keyword.charAt(0).toUpperCase() + item.keyword.slice(1),
              description: item.text,
              type: index === 0 ? 'start' : index === keywords.length - 1 ? 'end' : 'default',
              position: { x: 100 + (index % 3) * 50, y: 100 * Math.floor(index / 3) }
            }));
            
            // Create edges to connect nodes
            const edges = [];
            for (let i = 0; i < nodes.length - 1; i++) {
              edges.push({
                id: `e${nodes[i].id}-${nodes[i+1].id}`,
                source: nodes[i].id,
                target: nodes[i+1].id,
                label: 'Segue para',
                type: 'smoothstep',
                animated: true
              });
            }
            
            extractedData = { nodes, edges };
          }

          // ETAPA 2: Converter os dados da IA para o formato do fluxograma
          const nodes = extractedData.nodes.map((node, index) => {
            // Determinar o tipo do nó (usando o tipo da IA ou inferindo por conteúdo e posição)
            let nodeType = node.type || 'default';

            // Se o tipo não estiver definido, tente inferir do conteúdo ou posição
            if (!node.type) {
              // Mapeamento para as 5 camadas do fluxograma
              if (index === 0) {
                nodeType = 'start'; // CONCEITO CENTRAL
              } 
              else if (index === extractedData.nodes.length - 1) {
                nodeType = 'end'; // CONCLUSÃO
              }
              else if (index < Math.ceil(extractedData.nodes.length * 0.25)) {
                // Primeiros nós após o início são geralmente contexto e pré-requisitos
                nodeType = 'context';
              }
              else if (index < Math.ceil(extractedData.nodes.length * 0.6)) {
                // Nós intermediários são processos ou mecanismos
                nodeType = 'process';
              }
              else {
                // Nós finais antes da conclusão são aplicações práticas
                nodeType = 'practice';
              }

              // Inferência baseada no conteúdo sobrepõe a inferência por posição
              const titleLower = node.title?.toLowerCase() || '';
              const descLower = node.description?.toLowerCase() || '';

              if (titleLower.includes('pré-requisito') || 
                  titleLower.includes('termo') || 
                  titleLower.includes('context') ||
                  titleLower.includes('você precisa saber')) {
                nodeType = 'context';
              }
              else if (titleLower.includes('etapa') || 
                       titleLower.includes('passo') || 
                       titleLower.includes('processo') ||
                       titleLower.includes('fase')) {
                nodeType = 'process';
              }
              else if (titleLower.includes('exemplo') || 
                       titleLower.includes('prática') || 
                       titleLower.includes('aplicação') ||
                       titleLower.includes('exercício')) {
                nodeType = 'practice';
              }
              else if (titleLower.includes('dica') || 
                       titleLower.includes('lembre') || 
                       titleLower.includes('atenção') ||
                       titleLower.includes('importante') ||
                       titleLower.includes('nota')) {
                nodeType = 'tip';
              }
              else if (titleLower.includes('decis') || 
                       titleLower.includes('escolh') ||
                       titleLower.includes('verif') ||
                       titleLower.includes('se ') ||
                       descLower.includes('se ') ||
                       descLower.includes('caso ') ||
                       descLower.includes('correto') ||
                       descLower.includes('incorreto')) {
                nodeType = 'decision';
              }
            }

            // Calcular posicionamento usando uma estratégia de layout para fluxograma educacional
            // com as 5 camadas de aprendizado definidas
            let position;
            const canvasWidth = 600;
            const canvasHeight = extractedData.nodes.length * 150;
            const verticalSections = 5; // Uma seção para cada camada do modelo de aprendizado
            const sectionHeight = canvasHeight / verticalSections;

            // Calcular a seção vertical com base no tipo de nó
            let section = 0;
            switch (nodeType) {
              case 'start':
                section = 0; // Topo para o conceito central
                break;
              case 'context':
                section = 1; // Segunda seção para contextualização
                break;
              case 'process':
                section = 2; // Terceira seção para processos
                break;
              case 'practice':
              case 'decision':
                section = 3; // Quarta seção para aplicações e decisões
                break;
              case 'tip':
                // Os tips podem aparecer em qualquer lugar, então usar um cálculo específico
                section = Math.floor(Math.random() * 4) + 1; 
                break;
              case 'end':
                section = 4; // Fundo para conclusão
                break;
              default:
                // Posicionar nós padrão com base no índice relativo
                section = Math.floor((index / extractedData.nodes.length) * 4);
            }

            // Contar quantos nós estão na mesma seção para calcular o posicionamento horizontal
            const nodesInSameSection = extractedData.nodes.filter(n => {
              // Simplificado para a demonstração, na prática precisaria de uma análise de tipo real
              if (nodeType === 'start' && n.type === 'start') return true;
              if (nodeType === 'context' && n.type === 'context') return true;
              if (nodeType === 'process' && n.type === 'process') return true;
              if ((nodeType === 'practice' || nodeType === 'decision') && 
                  (n.type === 'practice' || n.type === 'decision')) return true;
              if (nodeType === 'end' && n.type === 'end') return true;
              return false;
            }).length;

            // Distribuir os nós horizontalmente dentro da seção
            const horizontalPosition = nodesInSameSection > 1 
              ? canvasWidth * (0.5 + ((index % nodesInSameSection) - (nodesInSameSection / 2)) * 0.15)
              : canvasWidth * 0.5;

            // Adicionar pequena variação aleatória para naturalidade e para evitar sobreposição
            const jitterX = Math.random() * 40 - 20;
            const jitterY = Math.random() * 40 - 20;

            position = { 
              x: horizontalPosition + jitterX,
              y: sectionHeight * (section + 0.5) + jitterY
            };

            // Dados extras para processos (etapa/passo)
            let extraData = {};
            if (nodeType === 'process') {
              // Tenta extrair um número de etapa do título
              const stepMatch = node.title?.match(/etapa\s*(\d+)|passo\s*(\d+)|fase\s*(\d+)/i);
              if (stepMatch) {
                const stepNumber = stepMatch[1] || stepMatch[2] || stepMatch[3];
                extraData = { stepNumber };
              }
            }

            // Retorna o nó formatado com todos os dados necessários
            return {
              id: node.id,
              data: { 
                label: node.title || 'Conceito', 
                description: node.description || 'Sem descrição disponível',
                ...extraData
              },
              type: nodeType,
              position
            };
          });

          // ETAPA 3: Gerar as Conexões (Edges) para o fluxograma educacional
          const edges = extractedData.edges?.map(edge => {
            // Determinar o estilo e cor da conexão baseado nos tipos de nós conectados
            const sourceNode = nodes.find(n => n.id === edge.source);
            const targetNode = nodes.find(n => n.id === edge.target);

            let edgeStyle = { stroke: '#3b82f6' }; // Azul padrão
            let labelStyle = { fill: '#3b82f6', fontWeight: 500 };

            // Estilizar com base no tipo de nós conectados
            if (sourceNode?.type === 'decision') {
              if (edge.label?.toLowerCase().includes('sim') || 
                  edge.label?.toLowerCase().includes('correto') ||
                  edge.label?.toLowerCase().includes('verdadeiro')) {
                edgeStyle = { stroke: '#10b981' }; // Verde para caminhos positivos
                labelStyle = { fill: '#10b981', fontWeight: 500 };
              } else if (edge.label?.toLowerCase().includes('não') || 
                         edge.label?.toLowerCase().includes('incorreto') ||
                         edge.label?.toLowerCase().includes('falso')) {
                edgeStyle = { stroke: '#f43f5e' }; // Vermelho para caminhos negativos
                labelStyle = { fill: '#f43f5e', fontWeight: 500 };
              }
            } 
            else if (sourceNode?.type === 'start') {
              edgeStyle = { stroke: '#6366f1', strokeWidth: 2 }; // Indigo destaque para início
            }
            else if (targetNode?.type === 'end') {
              edgeStyle = { stroke: '#10b981', strokeWidth: 2 }; // Verde destaque para conclusão
            }
            else if (sourceNode?.type === 'tip' || targetNode?.type === 'tip') {
              edgeStyle = { stroke: '#0ea5e9', strokeDasharray: '5,5' }; // Azul tracejado para dicas
              labelStyle = { fill: '#0ea5e9', fontWeight: 500 };
            }

            return {
              id: edge.id || `e${edge.source}-${edge.target}`,
              source: edge.source,
              target: edge.target,
              label: edge.label || '',
              type: edge.type || 'smoothstep',
              animated: edge.animated || edge.label?.toLowerCase().includes('importante') || false,
              style: edgeStyle,
              labelStyle: labelStyle,
              labelBgStyle: { fill: 'rgba(255, 255, 255, 0.75)', rx: 4, ry: 4 }
            }
          }) || [];

          // Se não houver conexões definidas pela IA, criar conexões para as 5 camadas de aprendizado
          if (edges.length === 0 && nodes.length > 1) {
            // Agrupar nós por tipo para facilitar o gerenciamento das camadas
            const nodesByType = {
              start: nodes.filter(n => n.type === 'start'),
              context: nodes.filter(n => n.type === 'context'),
              process: nodes.filter(n => n.type === 'process'),
              practice: nodes.filter(n => n.type === 'practice'),
              decision: nodes.filter(n => n.type === 'decision'),
              tip: nodes.filter(n => n.type === 'tip'),
              end: nodes.filter(n => n.type === 'end'),
              default: nodes.filter(n => n.type === 'default')
            };

            // 1. Conectar o nó inicial (conceito central) com os nós de contexto
            if (nodesByType.start.length > 0) {
              const startNode = nodesByType.start[0];

              // Se há nós de contexto, conecte o início a eles
              if (nodesByType.context.length > 0) {
                nodesByType.context.forEach((contextNode, idx) => {
                  edges.push({
                    id: `e${startNode.id}-${contextNode.id}`,
                    source: startNode.id,
                    target: contextNode.id,
                    label: idx === 0 ? 'Para entender' : '',
                    animated: false,
                    style: { stroke: '#3b82f6', strokeWidth: 2 },
                    labelStyle: { fill: '#3b82f6', fontWeight: 500 },
                    labelBgStyle: { fill: 'rgba(255, 255, 255, 0.75)', rx: 4, ry: 4 }
                  });
                });
              } 
              // Se não há contexto, conectar diretamente aos processos ou próximo tipo disponível
              else if (nodesByType.process.length > 0) {
                edges.push({
                  id: `e${startNode.id}-${nodesByType.process[0].id}`,
                  source: startNode.id,
                  target: nodesByType.process[0].id,
                  label: 'Entenda como funciona',
                  animated: false,
                  style: { stroke: '#3b82f6', strokeWidth: 2 },
                  labelStyle: { fill: '#3b82f6', fontWeight: 500 },
                  labelBgStyle: { fill: 'rgba(255, 255, 255, 0.75)', rx: 4, ry: 4 }
                });
              }
            }

            // 2. Conectar nós de contexto entre si (se houver mais de um)
            if (nodesByType.context.length > 1) {
              for (let i = 0; i < nodesByType.context.length - 1; i++) {
                edges.push({
                  id: `e${nodesByType.context[i].id}-${nodesByType.context[i+1].id}`,
                  source: nodesByType.context[i].id,
                  target: nodesByType.context[i+1].id,
                  label: '',
                  animated: false,
                  style: { stroke: '#0d9488' }, // Teal
                  labelStyle: { fill: '#0d9488', fontWeight: 500 },
                  labelBgStyle: { fill: 'rgba(255, 255, 255, 0.75)', rx: 4, ry: 4 }
                });
              }

              // Conectar o último nó de contexto à primeira etapa do processo
              if (nodesByType.process.length > 0) {
                edges.push({
                  id: `e${nodesByType.context[nodesByType.context.length-1].id}-${nodesByType.process[0].id}`,
                  source: nodesByType.context[nodesByType.context.length-1].id,
                  target: nodesByType.process[0].id,
                  label: 'Com isso em mente',
                  animated: false,
                  style: { stroke: '#0d9488' }, // Teal
                  labelStyle: { fill: '#0d9488', fontWeight: 500 },
                  labelBgStyle: { fill: 'rgba(255, 255, 255, 0.75)', rx: 4, ry: 4 }
                });
              }
            }

            // 3. Conectar nós de processo em sequência
            if (nodesByType.process.length > 1) {
              for (let i = 0; i < nodesByType.process.length - 1; i++) {
                const sourceNode = nodesByType.process[i];
                const targetNode = nodesByType.process[i+1];

                // Extrair números de etapa se disponíveis
                const sourceStep = sourceNode.data.stepNumber;
                const targetStep = targetNode.data.stepNumber;

                let label = '';
                if (sourceStep && targetStep) {
                  label = `Etapa ${sourceStep} → ${targetStep}`;
                } else {
                  label = 'Próxima etapa';
                }

                edges.push({
                  id: `e${sourceNode.id}-${targetNode.id}`,
                  source: sourceNode.id,
                  target: targetNode.id,
                  label: label,
                  animated: false,
                  style: { stroke: '#8b5cf6' }, // Roxo/Indigo
                  labelStyle: { fill: '#8b5cf6', fontWeight: 500 },
                  labelBgStyle: { fill: 'rgba(255, 255, 255, 0.75)', rx: 4, ry: 4 }
                });
              }

              // Conectar o último processo aos nós de aplicação prática
              const lastProcess = nodesByType.process[nodesByType.process.length - 1];
              if (nodesByType.practice.length > 0) {
                nodesByType.practice.forEach((practiceNode, idx) => {
                  edges.push({
                    id: `e${lastProcess.id}-${practiceNode.id}`,
                    source: lastProcess.id,
                    target: practiceNode.id,
                    label: idx === 0 ? 'Aplicação prática' : '',
                    animated: false,
                    style: { stroke: '#8b5cf6' }, // Roxo/Indigo
                    labelStyle: { fill: '#8b5cf6', fontWeight: 500 },
                    labelBgStyle: { fill: 'rgba(255, 255, 255, 0.75)', rx: 4, ry: 4 }
                  });
                });
              }
            }

            // 4. Conectar os nós de decisão com ramos "Correto" e "Incorreto"
            if (nodesByType.decision.length > 0) {
              nodesByType.decision.forEach((decisionNode, idx) => {
                // Determinar para onde o ramo "Correto" deve ir
                // Tipicamente para o próximo nó de prática ou conclusão
                let correctTargetFound = false;

                // Tentar encontrar um nó de prática não conectado como destino
                const availablePracticeNodes = nodesByType.practice.filter(n => 
                  n.id !== decisionNode.id && 
                  !edges.some(e => e.target === n.id) &&
                  !edges.some(e => e.source === decisionNode.id && e.target === n.id)
                );

                if (availablePracticeNodes.length > 0) {
                  edges.push({
                    id: `e${decisionNode.id}-${availablePracticeNodes[0].id}-correct`,
                    source: decisionNode.id,
                    target: availablePracticeNodes[0].id,
                    label: 'Correto',
                    animated: false,
                    style: { stroke: '#10b981' }, // Verde
                    labelStyle: { fill: '#10b981', fontWeight: 500 },
                    labelBgStyle: { fill: 'rgba(255, 255, 255, 0.75)', rx: 4, ry: 4 }
                  });
                  correctTargetFound = true;
                }

                // Se não encontrou alvo para o caminho correto, tente o nó de fim
                if (!correctTargetFound && nodesByType.end.length > 0) {
                  edges.push({
                    id: `e${decisionNode.id}-${nodesByType.end[0].id}-correct`,
                    source: decisionNode.id,
                    target: nodesByType.end[0].id,
                    label: 'Correto',
                    animated: false,
                    style: { stroke: '#10b981' }, // Verde 
                    labelStyle: { fill: '#10b981', fontWeight: 500 },
                    labelBgStyle: { fill: 'rgba(255, 255, 255, 0.75)', rx: 4, ry: 4 }
                  });
                  correctTargetFound = true;
                }

                // Determinar para onde o ramo "Incorreto" deve ir
                // Tipicamente para um nó de dica ou volta para um processo anterior
                let incorrectTargetFound = false;

                // Primeiro tente uma dica
                if (nodesByType.tip.length > 0) {
                  const availableTips = nodesByType.tip.filter(t => 
                    !edges.some(e => e.source === decisionNode.id && e.target === t.id)
                  );

                  if (availableTips.length > 0) {
                    edges.push({
                      id: `e${decisionNode.id}-${availableTips[0].id}-incorrect`,
                      source: decisionNode.id,
                      target: availableTips[0].id,
                      label: 'Incorreto',
                      animated: false,
                      style: { stroke: '#f43f5e' }, // Vermelho
                      labelStyle: { fill: '#f43f5e', fontWeight: 500 },
                      labelBgStyle: { fill: 'rgba(255, 255, 255, 0.75)', rx: 4, ry: 4 }
                    });
                    incorrectTargetFound = true;
                  }
                }

                // Se não encontrou dica, volte para um processo anterior
                if (!incorrectTargetFound && nodesByType.process.length > 0) {
                  const processToReview = nodesByType.process[Math.floor(nodesByType.process.length / 2)];
                  edges.push({
                    id: `e${decisionNode.id}-${processToReview.id}-incorrect`,
                    source: decisionNode.id,
                    target: processToReview.id,
                    label: 'Incorreto - Revise',
                    animated: false,
                    style: { stroke: '#f43f5e' }, // Vermelho
                    labelStyle: { fill: '#f43f5e', fontWeight: 500 },
                    labelBgStyle: { fill: 'rgba(255, 255, 255, 0.75)', rx: 4, ry: 4 }
                  });
                  incorrectTargetFound = true;
                }
              });
            }

            // 5. Conectar nós de dica aos nós relevantes
            if (nodesByType.tip.length > 0) {
              nodesByType.tip.forEach(tipNode => {
                // Se o nó de dica não é destino de nenhuma conexão ainda, conecte-o
                if (!edges.some(e => e.target === tipNode.id)) {
                  // Encontrar um nó de processo aleatório para receber a dica
                  if (nodesByType.process.length > 0) {
                    const randomProcessIndex = Math.floor(Math.random() * nodesByType.process.length);
                    edges.push({
                      id: `e${nodesByType.process[randomProcessIndex].id}-${tipNode.id}`,
                      source: nodesByType.process[randomProcessIndex].id,
                      target: tipNode.id,
                      label: 'Dica importante',
                      animated: true,
                      style: { stroke: '#0ea5e9', strokeDasharray: '5,5' }, // Azul tracejado
                      labelStyle: { fill: '#0ea5e9', fontWeight: 500 },
                      labelBgStyle: { fill: 'rgba(255, 255, 255, 0.75)', rx: 4, ry: 4 }
                    });
                  }
                }

                // Se o nó de dica não é origem de nenhuma conexão ainda,
                // conecte-o de volta a um nó relevante
                if (!edges.some(e => e.source === tipNode.id)) {
                  // Tentar encontrar o próximo nó lógico
                  let targetFound = false;

                  // Primeiro tente qualquer nó de prática disponível
                  if (!targetFound && nodesByType.practice.length > 0) {
                    const availablePractice = nodesByType.practice.find(p => 
                      !edges.some(e => e.source === tipNode.id && e.target === p.id)
                    );

                    if (availablePractice) {
                      edges.push({
                        id: `e${tipNode.id}-${availablePractice.id}`,
                        source: tipNode.id,
                        target: availablePractice.id,
                        label: 'Continue',
                        animated: false,
                        style: { stroke: '#0ea5e9', strokeDasharray: '5,5' }, // Azul tracejado
                        labelStyle: { fill: '#0ea5e9', fontWeight: 500 },
                        labelBgStyle: { fill: 'rgba(255, 255, 255, 0.75)', rx: 4, ry: 4 }
                      });
                      targetFound = true;
                    }
                  }

                  // Ou então, vá para o nó final
                  if (!targetFound && nodesByType.end.length > 0) {
                    edges.push({
                      id: `e${tipNode.id}-${nodesByType.end[0].id}`,
                      source: tipNode.id,
                      target: nodesByType.end[0].id,
                      label: 'Prosseguir',
                      animated: false,
                      style: { stroke: '#0ea5e9', strokeDasharray: '5,5' }, // Azul tracejado
                      labelStyle: { fill: '#0ea5e9', fontWeight: 500 },
                      labelBgStyle: { fill: 'rgba(255, 255, 255, 0.75)', rx: 4, ry: 4 }
                    });
                  }
                }
              });
            }

            // 6. Conectar nós de aplicação prática à conclusão
            if (nodesByType.practice.length > 0 && nodesByType.end.length > 0) {
              // Para cada nó de prática que não tem saída, conectar ao nó de conclusão
              nodesByType.practice.forEach(practiceNode => {
                if (!edges.some(e => e.source === practiceNode.id)) {
                  edges.push({
                    id: `e${practiceNode.id}-${nodesByType.end[0].id}`,
                    source: practiceNode.id,
                    target: nodesByType.end[0].id,
                    label: 'Consolidar aprendizado',
                    animated: false,
                    style: { stroke: '#6366f1' }, // Indigo
                    labelStyle: { fill: '#6366f1', fontWeight: 500 },
                    labelBgStyle: { fill: 'rgba(255, 255, 255, 0.75)', rx: 4, ry: 4 }
                  });
                }
              });
            }

            // 7. Verificar nós não conectados e criar conexões adicionais
            // Conectar qualquer nó sem saída ao próximo nó lógico no fluxo
            nodes.forEach(node => {
              // Se o nó não tem saída (exceto o nó final)
              if (node.type !== 'end' && !edges.some(e => e.source === node.id)) {
                // Determinar para qual tipo de nó deveria conectar com base na camada atual
                let targetNodeType = 'default';
                switch (node.type) {
                  case 'start': targetNodeType = 'context'; break;
                  case 'context': targetNodeType = 'process'; break;
                  case 'process': targetNodeType = 'practice'; break;
                  case 'practice': 
                  case 'decision': 
                  case 'tip': targetNodeType = 'end'; break;
                  default: targetNodeType = 'end';
                }

                // Encontrar o primeiro nó do tipo alvo que não é destino deste nó
                const targetNodes = nodesByType[targetNodeType] || [];
                const targetNode = targetNodes.find(t => 
                  t.id !== node.id && !edges.some(e => e.source === node.id && e.target === t.id)
                );

                // Se encontrou um nó alvo, crie a conexão
                if (targetNode) {
                  // Personalizar o rótulo com base nos tipos
                  let label = 'Continua';
                  if (node.type === 'start' && targetNode.type === 'context') {
                    label = 'Para compreender';
                  } else if (node.type === 'context' && targetNode.type === 'process') {
                    label = 'Vamos ao processo';
                  } else if (node.type === 'process' && targetNode.type === 'practice') {
                    label = 'Aplicação';
                  } else if (targetNode.type === 'end') {
                    label = 'Concluindo';
                  }

                  edges.push({
                    id: `e${node.id}-${targetNode.id}`,
                    source: node.id,
                    target: targetNode.id,
                    label: label,
                    animated: false,
                    style: { stroke: '#3b82f6' }, // Azul padrão
                    labelStyle: { fill: '#3b82f6', fontWeight: 500 },
                    labelBgStyle: { fill: 'rgba(255, 255, 255, 0.75)', rx: 4, ry: 4 }
                  });
                }
                // Se não encontrou do tipo ideal, tente conectar ao nó final
                else if (nodesByType.end.length > 0 && node.type !== 'end') {
                  edges.push({
                    id: `e${node.id}-${nodesByType.end[0].id}`,
                    source: node.id,
                    target: nodesByType.end[0].id,
                    label: 'Finalizando',
                    animated: false,
                    style: { stroke: '#3b82f6' }, // Azul padrão
                    labelStyle: { fill: '#3b82f6', fontWeight: 500 },
                    labelBgStyle: { fill: 'rgba(255, 255, 255, 0.75)', rx: 4, ry: 4 }
                  });
                }
              }
            });
          }

          fluxogramaData = { nodes, edges };

        } catch (error) {
          console.error('Erro ao processar com IA:', error);

          // Fallback para o método original se a IA falhar
          fluxogramaData = await new Promise((resolve) => {
            // ETAPA 1: Analisar e Estruturar o Conteúdo
            const paragraphs = contentToAnalyze.split(/\n\n+/);
            const sentences = contentToAnalyze.split(/[.!?]\s+/);

            // Identificar blocos conceituais principais
            const mainBlocks = paragraphs.length > 3 ? paragraphs.slice(0, paragraphs.length) : sentences.slice(0, Math.min(8, sentences.length));

            // Extrair palavras-chave significativas
            const keywords = mainBlocks.map(block => {
              const words = block.split(/\s+/).filter(word => word.length > 3);
              const mainWord = words.find(word => word.length > 5) || words[0] || 'Conceito';
              return {
                text: block,
                keyword: mainWord.length > 20 ? mainWord.substring(0, 20) + '...' : mainWord
              };
            }).slice(0, 8); // Limitar a 8 nós para melhor visualização

            // ETAPA 2: Gerar os Nós (Nodes) do Fluxograma
            const nodes = keywords.map((item, index) => {
              // Determinar o tipo do nó
              let type = 'default';
              if (index === 0) type = 'start';
              else if (index === keywords.length - 1) type = 'end';

              // Criar descrição significativa
              const description = item.text.length > 100 
                ? item.text.substring(0, 100) + '...' 
                : item.text;

              // Ajustar posicionamento para layout de fluxo
              let position;
              const flowDirection = 'vertical'; // ou 'horizontal'

              if (flowDirection === 'vertical') {
                position = { x: 250, y: 100 + (index * 120) };
              } else {
                position = { x: 100 + (index * 220), y: 200 };
              }

              return {
                id: (index + 1).toString(),
                data: { 
                  label: item.keyword.charAt(0).toUpperCase() + item.keyword.slice(1), 
                  description: description
                },
                type,
                position
              };
            });

            // ETAPA 3: Gerar as Conexões (Edges)
            const edges = [];
            for (let i = 0; i < nodes.length - 1; i++) {
              edges.push({
                id: `e${i+1}-${i+2}`,
                source: (i + 1).toString(),
                target: (i + 2).toString(),
                animated: true,
                style: { stroke: '#3b82f6' }
              });
            }

            // Simular um pequeno atraso antes de resolver (opcional)
            setTimeout(() => {
              resolve({ nodes, edges });
            }, 1000);
          });
        }

        // Armazena os dados do fluxograma para uso posterior no visualizador
        localStorage.setItem('fluxogramaData', JSON.stringify(fluxogramaData));

        setIsLoading(false);
        setFluxogramaGerado(true);
      } catch (error) {
        console.error('Erro ao processar o fluxograma:', error);
        setIsLoading(false);
      }
    };

    processFluxogramaContent();
  };

  const handleCancelManualInput = () => {
    setShowManualInput(false);
    setSelectedOption(null);
    setManualContent('');
  };

  const handleVisualizarFluxograma = () => {
    setShowFluxograma(true);
  };

  const handleCloseFluxograma = () => {
    setShowFluxograma(false);
  };

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
    setShowDetailModal(true);
  };

  const handleCopyFlowchartPrompt = (promptNumber: 1 | 2) => {
    const prompt = getFlowchartPrompt(promptNumber);
    navigator.clipboard.writeText(prompt)
      .then(() => alert('Prompt copiado para a área de transferência!'))
      .catch(err => console.error('Erro ao copiar prompt:', err));
  };
  
  const exportAsImage = async () => {
    try {
      // Mostrar indicador visual de carregamento
      const loadingIndicator = document.createElement('div');
      loadingIndicator.className = 'fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-[9999]';
      loadingIndicator.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col items-center">
          <svg class="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-sm text-gray-700 dark:text-gray-300">Exportando fluxograma...</span>
        </div>
      `;
      document.body.appendChild(loadingIndicator);
      
      // Impedir que o indicador de carregamento feche o modal ao ser clicado
      loadingIndicator.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
      });
      
      // Esperar um momento para garantir que o DOM está estável
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Verificar se o elemento existe - melhorando a seleção para garantir que encontre o elemento 
      const element = document.querySelector('.react-flow') || 
                      document.querySelector('.react-flow__viewport') ||
                      document.querySelector('[data-testid="rf__wrapper"]') as HTMLElement;
      if (!element) {
        loadingIndicator.remove();
        alert('Não foi possível encontrar o fluxograma para exportar.');
        return false;
      }
      
      // Forçar atualização da visualização
      window.dispatchEvent(new Event('resize'));
      
      // Aguardar mais um momento para a renderização
      await new Promise(resolve => setTimeout(resolve, 200));
      
      try {
        // Método 1: html2canvas (geralmente mais confiável)
        const html2canvas = (await import('html2canvas')).default;
        
        const canvas = await html2canvas(element, {
          backgroundColor: document.documentElement.classList.contains('dark') ? '#111827' : '#ffffff',
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true,
          ignoreElements: (el) => el.classList.contains('react-flow__minimap') || 
                                  el.classList.contains('react-flow__attribution') ||
                                  el.classList.contains('react-flow__panel')
        });
        
        // Converter para PNG e baixar
        const dataUrl = canvas.toDataURL('image/png');
        
        // Criar link para download e disparar o clique
        const link = document.createElement('a');
        link.download = `fluxograma_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
        link.href = dataUrl;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        
        // Limpar o DOM após um pequeno atraso
        setTimeout(() => {
          document.body.removeChild(link);
          loadingIndicator.remove();
          
          // Mostrar mensagem de sucesso
          const successMessage = document.createElement('div');
          successMessage.className = 'fixed bottom-4 right-4 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-100 px-4 py-2 rounded-md shadow-md border border-green-200 dark:border-green-800 z-50';
          successMessage.innerHTML = 'Fluxograma exportado com sucesso!';
          document.body.appendChild(successMessage);
          
          // Remover mensagem após 3 segundos
          setTimeout(() => {
            successMessage.remove();
          }, 3000);
        }, 100);
        
        return true;
      } catch (primaryError) {
        console.error('Erro no método html2canvas:', primaryError);
        
        // Método 2: html-to-image
        try {
          const options = {
            quality: 1,
            backgroundColor: document.documentElement.classList.contains('dark') ? '#111827' : '#ffffff',
            pixelRatio: 2,
            cacheBust: true,
            skipAutoScale: true,
            filter: (node: HTMLElement) => 
              !node.classList?.contains('react-flow__minimap') &&
              !node.classList?.contains('react-flow__attribution') &&
              !node.classList?.contains('react-flow__panel')
          };
          
          const dataUrl = await htmlToImage.toPng(element, options);
          
          const link = document.createElement('a');
          link.download = `fluxograma_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
          link.href = dataUrl;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          
          setTimeout(() => {
            document.body.removeChild(link);
            loadingIndicator.remove();
            
            const successMessage = document.createElement('div');
            successMessage.className = 'fixed bottom-4 right-4 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-100 px-4 py-2 rounded-md shadow-md border border-green-200 dark:border-green-800 z-50';
            successMessage.innerHTML = 'Fluxograma exportado com sucesso!';
            document.body.appendChild(successMessage);
            
            setTimeout(() => {
              successMessage.remove();
            }, 3000);
          }, 100);
          
          return true;
        } catch (error) {
          console.error('Erro no método html-to-image:', error);
          loadingIndicator.remove();
          alert('Erro ao exportar o fluxograma. Por favor, tente novamente.');
          return false;
        }
      }
    } catch (error) {
      console.error('Erro geral na exportação:', error);
      alert('Ocorreu um erro ao exportar o fluxograma. Por favor, tente novamente.');
      return false;
    }
  };

  const exportAsPDF = async () => {
    try {
      // Mostrar indicador visual de carregamento
      const loadingIndicator = document.createElement('div');
      loadingIndicator.className = 'fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-[9999]';
      loadingIndicator.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col items-center">
          <svg class="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-sm text-gray-700 dark:text-gray-300">Exportando fluxograma em PDF...</span>
        </div>
      `;
      document.body.appendChild(loadingIndicator);
      
      // Impedir que o indicador de carregamento feche o modal ao ser clicado
      loadingIndicator.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
      });
      
      // Esperar um momento para garantir que o DOM está estável
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Verificar se o elemento existe
      const element = document.querySelector('.react-flow') || 
                      document.querySelector('.react-flow__viewport') ||
                      document.querySelector('[data-testid="rf__wrapper"]') as HTMLElement;
      if (!element) {
        loadingIndicator.remove();
        alert('Não foi possível encontrar o fluxograma para exportar.');
        return false;
      }
      
      // Forçar atualização da visualização
      window.dispatchEvent(new Event('resize'));
      
      // Aguardar mais um momento para a renderização
      await new Promise(resolve => setTimeout(resolve, 200));
      
      try {
        // Importar as bibliotecas necessárias
        const html2canvas = (await import('html2canvas')).default;
        const jsPDF = (await import('jspdf')).default;
        
        // Capturar o fluxograma como imagem utilizando html2canvas
        const canvas = await html2canvas(element, {
          backgroundColor: document.documentElement.classList.contains('dark') ? '#111827' : '#ffffff',
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true,
          ignoreElements: (el) => el.classList.contains('react-flow__minimap') || 
                                  el.classList.contains('react-flow__attribution') ||
                                  el.classList.contains('react-flow__panel')
        });
        
        // Converter para imagem para inserir no PDF
        const imgData = canvas.toDataURL('image/png');
        
        // Calcular as dimensões para o PDF
        const imgWidth = 210; // A4 width in mm (portrait)
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        // Criar o documento PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Se a altura da imagem exceder a altura de uma página A4, ajustamos para a largura máxima
        if (imgHeight > 297) { // A4 height in mm
          const scaleFactor = 297 / imgHeight * 0.9; // 90% da altura da página para margens
          const newWidth = imgWidth * scaleFactor;
          pdf.addImage(imgData, 'PNG', (210 - newWidth) / 2, 10, newWidth, imgHeight * scaleFactor);
        } else {
          // Adicionar a imagem ao centro do PDF
          pdf.addImage(imgData, 'PNG', 10, 10, imgWidth - 20, imgHeight - 20);
        }
        
        // Salvar o PDF
        pdf.save(`fluxograma_${new Date().toISOString().replace(/[:.]/g, '-')}.pdf`);
        
        // Limpar o indicador de carregamento
        loadingIndicator.remove();
        
        // Mostrar mensagem de sucesso
        const successMessage = document.createElement('div');
        successMessage.className = 'fixed bottom-4 right-4 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-100 px-4 py-2 rounded-md shadow-md border border-green-200 dark:border-green-800 z-50';
        successMessage.innerHTML = 'Fluxograma exportado como PDF com sucesso!';
        document.body.appendChild(successMessage);
        
        // Remover mensagem após 3 segundos
        setTimeout(() => {
          successMessage.remove();
        }, 3000);
        
        return true;
      } catch (error) {
        console.error('Erro ao exportar PDF:', error);
        loadingIndicator.remove();
        alert('Erro ao exportar o fluxograma como PDF. Por favor, tente novamente.');
        return false;
      }
    } catch (error) {
      console.error('Erro geral na exportação do PDF:', error);
      alert('Ocorreu um erro ao exportar o fluxograma como PDF. Por favor, tente novamente.');
      return false;
    }
  };

  // Função para exportar o fluxograma como texto estruturado
  const exportAsText = async () => {
    try {
      // Mostrar indicador visual de carregamento
      const loadingIndicator = document.createElement('div');
      loadingIndicator.className = 'fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-[9999]';
      loadingIndicator.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col items-center">
          <svg class="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-sm text-gray-700 dark:text-gray-300">Processando texto do fluxograma...</span>
        </div>
      `;
      document.body.appendChild(loadingIndicator);
      
      // Impedir que o indicador de carregamento feche o modal ao ser clicado
      loadingIndicator.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
      });
      
      try {
        // Obter os dados do fluxograma
        const fluxogramaDataStr = localStorage.getItem('fluxogramaData');
        if (!fluxogramaDataStr) {
          loadingIndicator.remove();
          alert('Não foi possível encontrar dados do fluxograma para exportar.');
          return false;
        }
        
        // Converter para objeto
        const fluxogramaData = JSON.parse(fluxogramaDataStr);
        const { nodes, edges } = fluxogramaData;
        
        if (!nodes || !edges || nodes.length === 0) {
          loadingIndicator.remove();
          alert('Dados do fluxograma incompletos ou vazios.');
          return false;
        }
        
        // Encontrar o título do fluxograma (geralmente o primeiro nó ou nó do tipo 'start')
        const startNode = nodes.find(node => node.type === 'start') || nodes[0];
        const fluxogramaTitle = startNode?.data?.label || 'Fluxograma';
        
        // Ordenar os nós para seguir o fluxo lógico (tentativa simples)
        // 1. Iniciar com o nó inicial (tipo 'start')
        // 2. Seguir as conexões para ordenar os demais nós
        let orderedNodes = [];
        const startingNode = nodes.find(node => node.type === 'start') || nodes[0];
        const visitedNodeIds = new Set();
        
        // Função recursiva para percorrer os nós na ordem do fluxo
        const traverseNodes = (nodeId) => {
          if (visitedNodeIds.has(nodeId)) return;
          
          const currentNode = nodes.find(node => node.id === nodeId);
          if (!currentNode) return;
          
          visitedNodeIds.add(nodeId);
          orderedNodes.push(currentNode);
          
          // Encontrar todas as conexões que saem deste nó
          const outgoingEdges = edges.filter(edge => edge.source === nodeId);
          
          // Continuar a partir dos nós conectados
          for (const edge of outgoingEdges) {
            traverseNodes(edge.target);
          }
        };
        
        // Iniciar a ordenação a partir do nó inicial
        traverseNodes(startingNode.id);
        
        // Se algum nó não foi visitado, adicione-o ao final
        nodes.forEach(node => {
          if (!visitedNodeIds.has(node.id)) {
            orderedNodes.push(node);
          }
        });
        
        // Gerar texto formatado no estilo Markdown
        let markdownText = `# 🧩 Fluxograma: ${fluxogramaTitle}\n\n`;
        
        // Adicionar nós organizados por tipo (ou categoria se disponível)
        const nodesByType = {
          start: orderedNodes.filter(n => n.type === 'start'),
          context: orderedNodes.filter(n => n.type === 'context'),
          process: orderedNodes.filter(n => n.type === 'process'),
          practice: orderedNodes.filter(n => n.type === 'practice'),
          decision: orderedNodes.filter(n => n.type === 'decision'),
          tip: orderedNodes.filter(n => n.type === 'tip'),
          end: orderedNodes.filter(n => n.type === 'end'),
          default: orderedNodes.filter(n => !['start', 'context', 'process', 'practice', 'decision', 'tip', 'end'].includes(n.type))
        };
        
        // Adicionar o conceito central (nó inicial)
        if (nodesByType.start.length > 0) {
          markdownText += `## Conceito Central\n\n`;
          nodesByType.start.forEach(node => {
            markdownText += `**${node.data.label}**: ${node.data.description || ''}\n\n`;
          });
        }
        
        // Adicionar contexto e pré-requisitos
        if (nodesByType.context.length > 0) {
          markdownText += `## Contextualização e Pré-requisitos\n\n`;
          nodesByType.context.forEach(node => {
            markdownText += `- **${node.data.label}**: ${node.data.description || ''}\n`;
          });
          markdownText += '\n';
        }
        
        // Adicionar processo/mecanismo
        if (nodesByType.process.length > 0) {
          markdownText += `## Processo/Mecanismo\n\n`;
          nodesByType.process.forEach((node, index) => {
            markdownText += `${index + 1}. **${node.data.label}**: ${node.data.description || ''}\n`;
          });
          markdownText += '\n';
        }
        
        // Adicionar aplicações práticas
        if (nodesByType.practice.length > 0) {
          markdownText += `## Aplicações Práticas\n\n`;
          nodesByType.practice.forEach(node => {
            markdownText += `- **${node.data.label}**: ${node.data.description || ''}\n`;
          });
          markdownText += '\n';
        }
        
        // Adicionar pontos de decisão
        if (nodesByType.decision.length > 0) {
          markdownText += `## Pontos de Decisão\n\n`;
          nodesByType.decision.forEach(node => {
            markdownText += `### ${node.data.label}\n`;
            markdownText += `${node.data.description || ''}\n\n`;
            
            // Adicionar opções de decisão (conexões de saída)
            const decisionEdges = edges.filter(edge => edge.source === node.id);
            if (decisionEdges.length > 0) {
              markdownText += `Opções:\n`;
              decisionEdges.forEach(edge => {
                const targetNode = nodes.find(n => n.id === edge.target);
                if (targetNode) {
                  markdownText += `- ${edge.label || 'Seguir para'}: **${targetNode.data.label}**\n`;
                }
              });
              markdownText += '\n';
            }
          });
        }
        
        // Adicionar dicas
        if (nodesByType.tip.length > 0) {
          markdownText += `## Dicas Importantes\n\n`;
          nodesByType.tip.forEach(node => {
            markdownText += `> 💡 **${node.data.label}**: ${node.data.description || ''}\n\n`;
          });
        }
        
        // Adicionar conclusão
        if (nodesByType.end.length > 0) {
          markdownText += `## Conclusão\n\n`;
          nodesByType.end.forEach(node => {
            markdownText += `**${node.data.label}**: ${node.data.description || ''}\n\n`;
          });
        }
        
        // Adicionar nós não categorizados ou padrão
        if (nodesByType.default.length > 0) {
          markdownText += `## Outros Elementos\n\n`;
          nodesByType.default.forEach(node => {
            markdownText += `- **${node.data.label}**: ${node.data.description || ''}\n`;
          });
          markdownText += '\n';
        }
        
        // Adicionar informações de conexões (opcional - pode ser removido para conteúdo mais limpo)
        markdownText += `## Relações e Conexões\n\n`;
        edges.forEach(edge => {
          const sourceNode = nodes.find(n => n.id === edge.source);
          const targetNode = nodes.find(n => n.id === edge.target);
          if (sourceNode && targetNode) {
            markdownText += `- **${sourceNode.data.label}** ${edge.label || '→'} **${targetNode.data.label}**\n`;
          }
        });
        
        // Adicionar rodapé
        markdownText += `\n---\n\nFluxograma gerado em: ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}\n`;
        
        // Remover indicador de carregamento
        loadingIndicator.remove();
        
        // Mostrar modal para escolher o formato de texto para baixar
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]';
        modalOverlay.id = 'text-export-modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl';
        
        modalContent.innerHTML = `
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Exportar como Texto</h3>
            <button id="close-text-modal" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <div class="mb-4">
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">Escolha o formato de exportação:</p>
            <div class="flex space-x-2">
              <button id="download-md" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
                Markdown (.md)
              </button>
              <button id="download-txt" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md flex items-center justify-center text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
                Texto (.txt)
              </button>
            </div>
          </div>
          <div class="mb-4">
            <button id="copy-text" class="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-md flex items-center justify-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
              Copiar para Área de Transferência
            </button>
          </div>
          <div class="max-h-60 overflow-y-auto p-3 bg-gray-100 dark:bg-gray-900 rounded-md mb-4">
            <pre id="text-preview" class="text-xs text-gray-800 dark:text-gray-300 whitespace-pre-wrap"></pre>
          </div>
        `;
        
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
        
        // Adicionar conteúdo de prévia
        const previewElement = document.getElementById('text-preview');
        if (previewElement) {
          // Mostrar versão limitada para a prévia
          const previewText = markdownText.length > 800 
            ? markdownText.substring(0, 800) + '...\n(prévia limitada)'
            : markdownText;
          
          previewElement.textContent = previewText;
        }
        
        // Configurar eventos dos botões
        document.getElementById('close-text-modal')?.addEventListener('click', () => {
          modalOverlay.remove();
        });
        
        document.getElementById('download-md')?.addEventListener('click', () => {
          // Baixar como arquivo markdown
          const blob = new Blob([markdownText], { type: 'text/markdown' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `fluxograma_${fluxogramaTitle.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.md`;
          a.click();
          URL.revokeObjectURL(url);
          
          // Notificar sucesso
          const successMessage = document.createElement('div');
          successMessage.className = 'fixed bottom-4 right-4 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-100 px-4 py-2 rounded-md shadow-md border border-green-200 dark:border-green-800 z-50';
          successMessage.innerHTML = 'Fluxograma exportado como Markdown com sucesso!';
          document.body.appendChild(successMessage);
          
          setTimeout(() => {
            successMessage.remove();
          }, 3000);
        });
        
        document.getElementById('download-txt')?.addEventListener('click', () => {
          // Baixar como arquivo de texto simples
          const blob = new Blob([markdownText], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `fluxograma_${fluxogramaTitle.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.txt`;
          a.click();
          URL.revokeObjectURL(url);
          
          // Notificar sucesso
          const successMessage = document.createElement('div');
          successMessage.className = 'fixed bottom-4 right-4 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-100 px-4 py-2 rounded-md shadow-md border border-green-200 dark:border-green-800 z-50';
          successMessage.innerHTML = 'Fluxograma exportado como Texto com sucesso!';
          document.body.appendChild(successMessage);
          
          setTimeout(() => {
            successMessage.remove();
          }, 3000);
        });
        
        document.getElementById('copy-text')?.addEventListener('click', () => {
          // Copiar texto para a área de transferência
          navigator.clipboard.writeText(markdownText)
            .then(() => {
              const copyButton = document.getElementById('copy-text');
              if (copyButton) {
                copyButton.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  Copiado com Sucesso!
                `;
                
                setTimeout(() => {
                  copyButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                    Copiar para Área de Transferência
                  `;
                }, 2000);
              }
            })
            .catch(err => {
              console.error('Erro ao copiar para a área de transferência:', err);
              alert('Erro ao copiar o texto. Por favor, tente novamente.');
            });
        });
        
        // Fechar o modal ao clicar fora
        modalOverlay.addEventListener('click', (e) => {
          if (e.target === modalOverlay) {
            modalOverlay.remove();
          }
        });
        
        return true;
      } catch (error) {
        console.error('Erro ao exportar como texto:', error);
        loadingIndicator.remove();
        alert('Ocorreu um erro ao exportar o fluxograma como texto. Por favor, tente novamente.');
        return false;
      }
    } catch (error) {
      console.error('Erro geral na exportação como texto:', error);
      alert('Ocorreu um erro ao exportar o fluxograma como texto. Por favor, tente novamente.');
      return false;
    }
  };


  const getFlowchartPrompt = (promptNumber: 1 | 2): string => {
    switch (promptNumber) {
      case 1:
        return `
Prompts que você pode mandar para a IA programadora:

🎯 Prompt 1 – Criação Avançada de Fluxograma
Com base na explicação dada anteriormente sobre o tema, gere um fluxograma didático e aprofundado, dividido da seguinte forma:

Conceito Central (1 nó)

Contexto e Pré-requisitos (2 a 3 nós)

Processo ou Lógica do Tema (3 a 6 nós)

Aplicações, Exemplos e Erros comuns (2 a 4 nós)

Conclusão/Resumo (1 ou 2 nós)

Para cada nó, gere:

id único

label (curto e claro)

description (resumo curto)

details (explicação que pode ser expandida no clique)

category (ex: definição, exemplo, erro, etapa, conclusão, etc.)

position sugerida (apenas x e y simples para diferenciar os blocos visualmente)

Em seguida, conecte os nós com edges organizando a sequência de aprendizado. Se houver bifurcações ou condições, especifique.
        `;
      case 2:
        return `
🛠 Prompt 2 – Formatação para React Flow
O conteúdo gerado acima deve estar no seguinte formato JSON:

fluxograma:

{
  "nodes": [ ... ],
  "edges": [ ... ]
}
        `;
      default:
        return '';
    }
  };


  return (
    <div className="space-y-4">
      <div className="flex items-center mb-2">
        <Button 
          onClick={handleBack} 
          variant="ghost" 
          size="sm" 
          className="mr-2 h-8 w-8 p-0 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <FileLineChart className="h-5 w-5 mr-2 text-blue-500" />
          Criar Fluxograma do Tema
        </h3>
      </div>

      {showFluxograma ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-md font-medium text-gray-900 dark:text-white">Fluxograma Interativo</h4>
            <Button
              onClick={handleCloseFluxograma}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <FluxogramaVisualizer onNodeClick={handleNodeClick} />
          {/* Painel de ações fixo compacto */}
          <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl border border-gray-200/70 dark:border-gray-700/50 p-3 shadow-sm backdrop-blur-sm fixed bottom-4 right-4">
            <div className="flex items-center space-x-2">
              <div className="tooltip-container relative group">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    setIsLoading(true);
                    setShowFluxograma(false);
                    
                    // Reutilizar a lógica de geração do fluxograma
                    const regenerateFluxograma = async () => {
                      // Remover dados anteriores
                      localStorage.removeItem('fluxogramaData');
                      
                      // Gerar novo fluxograma usando o conteúdo já processado
                      const sourceOption = selectedOption || 'ia';
                      const contentToProcess = sourceOption === 'manual' 
                        ? manualContent 
                        : aprofundadoContent?.contexto || '';
                      
                      if (!contentToProcess.trim()) {
                        setIsLoading(false);
                        alert('Não há conteúdo disponível para regenerar o fluxograma.');
                        return;
                      }
                      
                      // Processar novamente seguindo a lógica existente
                      try {
                        // Importar o serviço de IA
                        const { generateAIResponse } = await import('@/services/aiChatService');
                        
                        // Criar um ID de sessão único
                        const sessionId = `fluxograma_regen_${Date.now()}`;
                        
                        // Usar o mesmo prompt para obter consistência
                        const prompt = `
Com base na seguinte explicação sobre o tema, gere um fluxograma interativo no formato do React Flow:

${contentToProcess}

Crie um fluxograma educacional estruturado em 5 camadas de aprendizado que:

1. Comece com um CONCEITO CENTRAL (nó inicial):
   - Defina o tema de forma objetiva e clara
   - Ex: "O que é fotossíntese?"

2. Adicione CONTEXTUALIZAÇÃO E PRÉ-REQUISITOS:
   - Conhecimentos prévios necessários
   - Termos importantes para entender o tema
   - Base científica/histórica relevante

3. Detalhe o PROCESSO, MECANISMO OU LÓGICA DO TEMA:
   - Passo a passo da explicação em etapas numeradas
   - Fluxo de causa e efeito
   - Ex: "Etapa 1: Captação de luz → Etapa 2: Transformação química → Etapa 3: Liberação de oxigênio"

4. Inclua uma CAMADA DE APLICAÇÃO/PRÁTICA:
   - Exemplos práticos ou situações-problema
   - Destaque erros comuns e dicas
   - Inclua nós de decisão do tipo: "Se o aluno pensar A → Mostrar que está errado" / "Se pensar B → Está correto"

5. Finalize com CONCLUSÃO OU RESULTADO FINAL:
   - Síntese do aprendizado
   - Resumo visual
   - Dica de ouro ou aplicação em provas

// Outras instruções detalhadas mantidas...
`;
                        
                        // Chamar a API de IA
                        const response = await generateAIResponse(prompt, sessionId, {
                          intelligenceLevel: 'advanced',
                          detailedResponse: true
                        });
                        
                        // Processar a resposta e salvar os dados
                        // Usar a lógica existente, mas simplificada
                        let extractedData;
                        try {
                          const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || 
                                         response.match(/```\n([\s\S]*?)\n```/) ||
                                         response.match(/{[\s\S]*?}/);

                          const jsonString = jsonMatch ? jsonMatch[0].replace(/```json\n|```\n|```/g, '') : response;
                          extractedData = JSON.parse(jsonString);
                          
                          // Normalize data structure
                          if (!extractedData.edges && extractedData.connections) {
                            extractedData.edges = extractedData.connections.map(conn => ({
                              id: `e${conn.source}-${conn.target}`,
                              source: conn.source,
                              target: conn.target,
                              label: conn.label || '',
                              type: 'smoothstep',
                              animated: conn.animated || false
                            }));
                          } else if (!extractedData.edges) {
                            extractedData.edges = [];
                            if (extractedData.nodes && extractedData.nodes.length > 1) {
                              for (let i = 0; i < extractedData.nodes.length - 1; i++) {
                                extractedData.edges.push({
                                  id: `e${extractedData.nodes[i].id}-${extractedData.nodes[i+1].id}`,
                                  source: extractedData.nodes[i].id,
                                  target: extractedData.nodes[i+1].id,
                                  label: 'Segue para',
                                  type: 'smoothstep',
                                  animated: true
                                });
                              }
                            }
                          }
                        } catch (error) {
                          console.error('Erro ao extrair JSON da resposta da IA:', error);
                          // Criar uma estrutura simples de fallback
                          const paragraphs = contentToProcess.split(/\n\n+/);
                          const sentences = contentToProcess.split(/[.!?]\s+/);
                          const mainBlocks = paragraphs.length > 3 ? paragraphs.slice(0, paragraphs.length) : sentences.slice(0, Math.min(8, sentences.length));
                          const nodes = mainBlocks.map((block, index) => ({
                            id: (index + 1).toString(),
                            data: { 
                              label: `Conceito ${index + 1}`, 
                              description: block
                            },
                            type: index === 0 ? 'start' : index === mainBlocks.length - 1 ? 'end' : 'default',
                            position: { x: 250, y: 100 * (index + 1) }
                          }));
                          
                          const edges = [];
                          for (let i = 0; i < nodes.length - 1; i++) {
                            edges.push({
                              id: `e${i+1}-${i+2}`,
                              source: (i + 1).toString(),
                              target: (i + 2).toString(),
                              animated: true,
                              style: { stroke: '#3b82f6' }
                            });
                          }
                          
                          extractedData = { nodes, edges };
                        }
                        
                        // Salvar os novos dados
                        localStorage.setItem('fluxogramaData', JSON.stringify(extractedData));
                        
                        // Mostrar o fluxograma
                        setIsLoading(false);
                        setFluxogramaGerado(true);
                        setShowFluxograma(true);
                        
                      } catch (error) {
                        console.error('Erro ao regenerar o fluxograma:', error);
                        setIsLoading(false);
                        alert('Ocorreu um erro ao regenerar o fluxograma. Por favor, tente novamente.');
                      }
                    };
                    
                    // Iniciar o processo de regeneração
                    regenerateFluxograma();
                  }}
                  className="h-10 w-10 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
                >
                  <RotateCw className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </Button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Regenerar
                </div>
              </div>
              
              <div className="tooltip-container relative group">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    
                    // Criar menu de exportação com estilos melhorados
                    const exportMenu = document.createElement('div');
                    exportMenu.id = 'export-options-menu';
                    exportMenu.className = 'fixed z-[9999] bg-white dark:bg-gray-800 shadow-lg rounded-md p-2 border border-gray-200 dark:border-gray-700 w-48';
                    
                    // Remover qualquer menu anterior que possa existir
                    const oldMenu = document.getElementById('export-options-menu');
                    if (oldMenu) {
                      oldMenu.remove();
                    }
                    
                    // Posicionar o menu em relação ao botão
                    const buttonRect = e.currentTarget.getBoundingClientRect();
                    exportMenu.style.top = `${buttonRect.top - 160}px`;
                    exportMenu.style.left = `${buttonRect.left - 20}px`;
                    
                    // Importante: garantir que receba eventos de mouse
                    exportMenu.style.pointerEvents = 'auto';
                    
                    // Usar createElement para criar todos os elementos do menu
                    const menuContent = document.createElement('div');
                    menuContent.className = 'flex flex-col space-y-1';
                    
                    // Botão Exportar IMG
                    const exportImgButton = document.createElement('button');
                    exportImgButton.id = 'export-img-button';
                    exportImgButton.className = 'text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors flex items-center text-gray-700 dark:text-gray-300 cursor-pointer';
                    
                    // Ícone para o botão
                    const imgIcon = document.createElement('svg');
                    imgIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                    imgIcon.setAttribute('class', 'w-4 h-4 mr-2');
                    imgIcon.setAttribute('fill', 'none');
                    imgIcon.setAttribute('viewBox', '0 0 24 24');
                    imgIcon.setAttribute('stroke', 'currentColor');
                    
                    const imgIconPath = document.createElement('path');
                    imgIconPath.setAttribute('stroke-linecap', 'round');
                    imgIconPath.setAttribute('stroke-linejoin', 'round');
                    imgIconPath.setAttribute('stroke-width', '2');
                    imgIconPath.setAttribute('d', 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z');
                    
                    imgIcon.appendChild(imgIconPath);
                    exportImgButton.appendChild(imgIcon);
                    
                    // Texto do botão
                    const imgText = document.createTextNode('Exportar em .IMG');
                    exportImgButton.appendChild(imgText);
                    
                    // Botão PDF (ativo)
                    const exportPdfButton = document.createElement('button');
                    exportPdfButton.className = 'text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors flex items-center text-gray-700 dark:text-gray-300 cursor-pointer';
                    
                    // Ícone para o botão PDF
                    const pdfIcon = document.createElement('svg');
                    pdfIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                    pdfIcon.setAttribute('class', 'w-4 h-4 mr-2');
                    pdfIcon.setAttribute('fill', 'none');
                    pdfIcon.setAttribute('viewBox', '0 0 24 24');
                    pdfIcon.setAttribute('stroke', 'currentColor');
                    
                    const pdfIconPath = document.createElement('path');
                    pdfIconPath.setAttribute('stroke-linecap', 'round');
                    pdfIconPath.setAttribute('stroke-linejoin', 'round');
                    pdfIconPath.setAttribute('stroke-width', '2');
                    pdfIconPath.setAttribute('d', 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z');
                    
                    pdfIcon.appendChild(pdfIconPath);
                    exportPdfButton.appendChild(pdfIcon);
                    
                    // Texto do botão PDF
                    const pdfText = document.createTextNode('Exportar em PDF');
                    exportPdfButton.appendChild(pdfText);
                    
                    // Botão Texto (ativo)
                    const exportTextButton = document.createElement('button');
                    exportTextButton.className = 'text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors flex items-center text-gray-700 dark:text-gray-300 cursor-pointer';
                    
                    // Ícone para o botão de texto
                    const textIcon = document.createElement('svg');
                    textIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                    textIcon.setAttribute('class', 'w-4 h-4 mr-2');
                    textIcon.setAttribute('fill', 'none');
                    textIcon.setAttribute('viewBox', '0 0 24 24');
                    textIcon.setAttribute('stroke', 'currentColor');
                    
                    const textIconPath = document.createElement('path');
                    textIconPath.setAttribute('stroke-linecap', 'round');
                    textIconPath.setAttribute('stroke-linejoin', 'round');
                    textIconPath.setAttribute('stroke-width', '2');
                    textIconPath.setAttribute('d', 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z');
                    
                    textIcon.appendChild(textIconPath);
                    exportTextButton.appendChild(textIcon);
                    
                    // Texto do botão de texto
                    const textButtonText = document.createTextNode('Exportar em Texto');
                    exportTextButton.appendChild(textButtonText);
                    
                    // Montar o menu
                    menuContent.appendChild(exportImgButton);
                    menuContent.appendChild(exportPdfButton);
                    menuContent.appendChild(exportTextButton);
                    exportMenu.appendChild(menuContent);
                    
                    // Adicionar o menu ao DOM
                    document.body.appendChild(exportMenu);
                    
                    // Configurar evento de clique para exportar em .IMG
                    exportImgButton.onclick = (event) => {
                      event.stopPropagation();
                      event.preventDefault();
                      
                      // Remover o menu de exportação sem fechar o modal principal
                      const exportMenu = document.getElementById('export-options-menu');
                      if (exportMenu) {
                        exportMenu.remove();
                      }
                      
                      // Indicador de carregamento no botão
                      exportImgButton.innerHTML = '';
                      
                      // Ícone de loading
                      const loadingIcon = document.createElement('svg');
                      loadingIcon.setAttribute('class', 'animate-spin w-4 h-4 mr-2');
                      loadingIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                      loadingIcon.setAttribute('fill', 'none');
                      loadingIcon.setAttribute('viewBox', '0 0 24 24');
                      
                      const loadingCircle = document.createElement('circle');
                      loadingCircle.setAttribute('class', 'opacity-25');
                      loadingCircle.setAttribute('cx', '12');
                      loadingCircle.setAttribute('cy', '12');
                      loadingCircle.setAttribute('r', '10');
                      loadingCircle.setAttribute('stroke', 'currentColor');
                      loadingCircle.setAttribute('stroke-width', '2');
                      
                      const loadingPath = document.createElement('path');
                      loadingPath.setAttribute('class', 'opacity-75');
                      loadingPath.setAttribute('fill', 'currentColor');
                      loadingPath.setAttribute('d', 'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z');
                      
                      loadingIcon.appendChild(loadingCircle);
                      loadingIcon.appendChild(loadingPath);
                      exportImgButton.appendChild(loadingIcon);
                      
                      // Texto de carregamento
                      const loadingText = document.createTextNode('Exportando...');
                      exportImgButton.appendChild(loadingText);
                      
                      exportImgButton.disabled = true;
                      exportImgButton.className = 'text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
                      
                      // Remover a escuta do evento de clique para evitar fechamento indesejado
                      document.removeEventListener('click', closeMenu);
                      
                      // Criar uma função que executa a exportação sem fechar o modal principal
                      setTimeout(() => {
                        // Exportar imagem sem fechar o modal principal
                        exportAsImage().then((success) => {
                          // O menu já foi removido acima, não precisamos fazer novamente
                          // Apenas notificar o usuário se houver falha
                          if (!success) {
                            console.error('Falha ao exportar imagem');
                          }
                        }).catch(error => {
                          console.error('Erro ao exportar imagem:', error);
                          alert('Ocorreu um erro ao exportar o fluxograma. Por favor, tente novamente.');
                        });
                      }, 50);
                    };
                    
                    // Configurar evento de clique para exportar em PDF
                    exportPdfButton.onclick = (event) => {
                      event.stopPropagation();
                      event.preventDefault();
                      
                      // Remover o menu de exportação sem fechar o modal principal
                      const exportMenu = document.getElementById('export-options-menu');
                      if (exportMenu) {
                        exportMenu.remove();
                      }
                      
                      // Indicador de carregamento no botão
                      exportPdfButton.innerHTML = '';
                      
                      // Ícone de loading
                      const loadingIcon = document.createElement('svg');
                      loadingIcon.setAttribute('class', 'animate-spin w-4 h-4 mr-2');
                      loadingIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                      loadingIcon.setAttribute('fill', 'none');
                      loadingIcon.setAttribute('viewBox', '0 0 24 24');
                      
                      const loadingCircle = document.createElement('circle');
                      loadingCircle.setAttribute('class', 'opacity-25');
                      loadingCircle.setAttribute('cx', '12');
                      loadingCircle.setAttribute('cy', '12');
                      loadingCircle.setAttribute('r', '10');
                      loadingCircle.setAttribute('stroke', 'currentColor');
                      loadingCircle.setAttribute('stroke-width', '2');
                      
                      const loadingPath = document.createElement('path');
                      loadingPath.setAttribute('class', 'opacity-75');
                      loadingPath.setAttribute('fill', 'currentColor');
                      loadingPath.setAttribute('d', 'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z');
                      
                      loadingIcon.appendChild(loadingCircle);
                      loadingIcon.appendChild(loadingPath);
                      exportPdfButton.appendChild(loadingIcon);
                      
                      // Texto de carregamento
                      const loadingText = document.createTextNode('Exportando...');
                      exportPdfButton.appendChild(loadingText);
                      
                      exportPdfButton.disabled = true;
                      exportPdfButton.className = 'text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
                      
                      // Remover a escuta do evento de clique para evitar fechamento indesejado
                      document.removeEventListener('click', closeMenu);
                      
                      // Criar uma função que executa a exportação sem fechar o modal principal
                      setTimeout(() => {
                        // Exportar PDF
                        exportAsPDF().then((success) => {
                          if (!success) {
                            console.error('Falha ao exportar PDF');
                          }
                        }).catch(error => {
                          console.error('Erro ao exportar PDF:', error);
                          alert('Ocorreu um erro ao exportar o fluxograma em PDF. Por favor, tente novamente.');
                        });
                      }, 50);
                    };
                    
                    // Configurar evento de clique para exportar em Texto
                    exportTextButton.onclick = (event) => {
                      event.stopPropagation();
                      event.preventDefault();
                      
                      // Remover o menu de exportação sem fechar o modal principal
                      const exportMenu = document.getElementById('export-options-menu');
                      if (exportMenu) {
                        exportMenu.remove();
                      }
                      
                      // Indicador de carregamento no botão
                      exportTextButton.innerHTML = '';
                      
                      // Ícone de loading
                      const loadingIcon = document.createElement('svg');
                      loadingIcon.setAttribute('class', 'animate-spin w-4 h-4 mr-2');
                      loadingIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                      loadingIcon.setAttribute('fill', 'none');
                      loadingIcon.setAttribute('viewBox', '0 0 24 24');
                      
                      const loadingCircle = document.createElement('circle');
                      loadingCircle.setAttribute('class', 'opacity-25');
                      loadingCircle.setAttribute('cx', '12');
                      loadingCircle.setAttribute('cy', '12');
                      loadingCircle.setAttribute('r', '10');
                      loadingCircle.setAttribute('stroke', 'currentColor');
                      loadingCircle.setAttribute('stroke-width', '2');
                      
                      const loadingPath = document.createElement('path');
                      loadingPath.setAttribute('class', 'opacity-75');
                      loadingPath.setAttribute('fill', 'currentColor');
                      loadingPath.setAttribute('d', 'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z');
                      
                      loadingIcon.appendChild(loadingCircle);
                      loadingIcon.appendChild(loadingPath);
                      exportTextButton.appendChild(loadingIcon);
                      
                      // Texto de carregamento
                      const loadingText = document.createTextNode('Exportando...');
                      exportTextButton.appendChild(loadingText);
                      
                      exportTextButton.disabled = true;
                      exportTextButton.className = 'text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
                      
                      // Remover a escuta do evento de clique para evitar fechamento indesejado
                      document.removeEventListener('click', closeMenu);
                      
                      // Criar uma função que executa a exportação sem fechar o modal principal
                      setTimeout(() => {
                        // Exportar como texto estruturado
                        exportAsText().then((success) => {
                          if (!success) {
                            console.error('Falha ao exportar texto');
                          }
                        }).catch(error => {
                          console.error('Erro ao exportar texto:', error);
                          alert('Ocorreu um erro ao exportar o fluxograma como texto. Por favor, tente novamente.');
                        });
                      }, 50);
                    };
                    
                    // Fechar o menu ao clicar fora dele
                    const closeMenu = (event: MouseEvent) => {
                      if (!exportMenu.contains(event.target as Node) && 
                          event.target !== e.currentTarget) {
                        exportMenu.remove();
                        document.removeEventListener('click', closeMenu);
                      }
                    };
                    
                    // Adicionar listener para fechar o menu
                    setTimeout(() => {
                      document.addEventListener('click', closeMenu);
                    }, 100);
                  }}
                  className="h-10 w-10 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
                >
                  <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </Button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Exportar
                </div>
              </div>
              
              <div className="tooltip-container relative group">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-10 w-10 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
                >
                  <Clipboard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </Button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Caderno
                </div>
              </div>
              
              <div className="tooltip-container relative group">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    // Obter o elemento que contém o fluxograma
                    const fluxogramaContainer = document.querySelector('.h-[60vh]');
                    if (fluxogramaContainer) {
                      // Alternar entre tamanho normal e ampliado
                      if (fluxogramaContainer.classList.contains('h-[60vh]')) {
                        fluxogramaContainer.classList.remove('h-[60vh]');
                        fluxogramaContainer.classList.add('h-[90vh]', 'fixed', 'top-[5vh]', 'left-[5vw]', 'right-[5vw]', 'w-[90vw]', 'z-50');
                      } else {
                        fluxogramaContainer.classList.remove('h-[90vh]', 'fixed', 'top-[5vh]', 'left-[5vw]', 'right-[5vw]', 'w-[90vw]', 'z-50');
                        fluxogramaContainer.classList.add('h-[60vh]');
                      }
                      
                      // Ajustar o fluxograma para caber na nova visualização
                      setTimeout(() => {
                        const reactFlowInstance = document.querySelector('.react-flow');
                        if (reactFlowInstance) {
                          // Disparar evento de redimensionamento para atualizar a visualização
                          window.dispatchEvent(new Event('resize'));
                        }
                      }, 100);
                    }
                  }}
                  className="h-10 w-10 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
                >
                  <Maximize2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </Button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Ampliar
                </div>
              </div>
              
              <div className="tooltip-container relative group">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleSaveFluxograma}
                  className="h-10 w-10 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
                >
                  <Save className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </Button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Salvar
                </div>
              </div>
              
              <div className="tooltip-container relative group">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={async () => {
                    // Verificar se o fluxograma está salvo
                    const fluxogramaData = localStorage.getItem('fluxogramaData');
                    if (!fluxogramaData) {
                      alert('É necessário salvar o fluxograma antes de compartilhar.');
                      return;
                    }
                    
                    try {
                      // Obter dados do usuário
                      const userMetadata = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}');
                      const username = userMetadata?.currentSession?.user?.user_metadata?.username || 
                                     localStorage.getItem('username') || 
                                     sessionStorage.getItem('username') || 
                                     'usuario';
                      
                      const userId = userMetadata?.currentSession?.user?.id || 'id_temporario';
                      
                      // Obter título do fluxograma (usar título fixo se não estiver salvo)
                      const savedFluxogramas = JSON.parse(localStorage.getItem('savedFluxogramas') || '[]');
                      const latestFluxograma = savedFluxogramas.length > 0 ? savedFluxogramas[savedFluxogramas.length - 1] : null;
                      
                      // Se não houver fluxograma salvo, perguntar ao usuário
                      let fluxogramaTitle = latestFluxograma?.title || '';
                      if (!fluxogramaTitle) {
                        fluxogramaTitle = prompt('Digite um título para o fluxograma:') || 'fluxograma';
                        
                        // Salvar fluxograma automaticamente com o título fornecido
                        if (fluxogramaTitle) {
                          const newSavedFluxograma = {
                            id: `flux_${Date.now()}`,
                            title: fluxogramaTitle,
                            description: selectedOption === 'manual' ? manualContent.substring(0, 100) + '...' : 'Gerado pela IA',
                            date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }),
                            data: JSON.parse(fluxogramaData)
                          };
                          
                          const updatedFluxogramas = [...savedFluxogramas, newSavedFluxograma];
                          setSavedFluxogramas(updatedFluxogramas);
                          localStorage.setItem('savedFluxogramas', JSON.stringify(updatedFluxogramas));
                        }
                      }
                      
                      // Formatar títulos para URL (remover espaços e caracteres especiais)
                      const formattedTitle = fluxogramaTitle.toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/\s+/g, '-');
                      
                      // Criar URL compartilhável
                      const baseUrl = window.location.origin;
                      const shareUrl = `${baseUrl}/fluxograma/${formattedTitle}/${username}/${userId}`;
                      
                      // Salvar dados no localStorage para acesso pela página compartilhada
                      const shareData = {
                        fluxogramaData: JSON.parse(fluxogramaData),
                        title: fluxogramaTitle,
                        username,
                        userId,
                        timestamp: Date.now()
                      };
                      
                      localStorage.setItem(`shared_fluxograma_${formattedTitle}_${userId}`, JSON.stringify(shareData));
                      
                      // Copiar URL para área de transferência
                      await navigator.clipboard.writeText(shareUrl);
                      alert(`URL do fluxograma copiada para a área de transferência:\n${shareUrl}`);
                      
                      // Abrir nova página
                      const openInNewTab = confirm('URL copiada! Deseja abrir a página compartilhada em uma nova aba?');
                      if (openInNewTab) {
                        window.open(shareUrl, '_blank');
                      }
                    } catch (error) {
                      console.error('Erro ao compartilhar fluxograma:', error);
                      alert('Ocorreu um erro ao compartilhar o fluxograma.');
                    }
                  }}
                  className="h-10 w-10 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
                >
                  <Share2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </Button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Compartilhar
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ScrollArea className="h-[50vh] pr-4">
          <div className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-4 border border-blue-100/80 dark:border-blue-800/30 mb-4 backdrop-blur-sm">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Selecione abaixo como deseja gerar o fluxograma.
            </p>
          </div>

          {!showManualInput ? (
            <div className="space-y-4">
              <Button
                onClick={() => handleGenerateFlowchart('ia')}
                className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all border border-blue-500/20 rounded-xl group relative overflow-hidden flex items-center justify-center"
                disabled={isLoading || showManualInput}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400/10 to-indigo-400/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                <span className="relative flex items-center justify-center">
                  <FileDown className="h-5 w-5 mr-2 transform group-hover:translate-y-px transition-transform" />
                  <span className="font-medium">Usar conteúdo da IA acima</span>
                </span>
              </Button>

              <Button
                onClick={() => handleGenerateFlowchart('manual')}
                variant="outline"
                className="w-full py-6 bg-white/80 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700/70 shadow-sm border border-gray-200 dark:border-gray-700 rounded-xl backdrop-blur-sm group relative overflow-hidden flex items-center justify-center"
                disabled={isLoading || showManualInput}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700/30 dark:to-gray-800/30 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                <span className="relative flex items-center justify-center">
                  <PenLine className="h-5 w-5 mr-2 transform group-hover:translate-y-px transition-transform" />
                  <span className="font-medium">Inserir meu próprio conteúdo</span>
                </span>
              </Button>
              
              {/* Card de Pré-visualização, Processamento, ou Fluxograma Gerado */}
              {isLoading ? (
                <div className="mt-6 bg-[#131A2B] rounded-xl p-6 shadow-lg flex flex-col items-center justify-center max-w-xl mx-auto">
                  <div className="mb-4">
                    <div className="h-16 w-16 rounded-full bg-[#2C3E87] flex items-center justify-center">
                      <svg className="animate-spin h-8 w-8 text-[#6B8AFF]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </div>
                  <h4 className="text-lg font-medium text-white mb-2">Processando o Fluxograma</h4>
                  <p className="text-sm text-gray-300 text-center mb-6">
                    Estamos analisando o conteúdo e construindo um fluxograma visual para facilitar sua compreensão.
                  </p>
                  <div className="w-full bg-[#1E2A45] rounded-full h-2.5 overflow-hidden">
                    <div className="bg-[#4C78FF] h-2.5 rounded-full animate-progress"></div>
                  </div>
                </div>
              ) : fluxogramaGerado ? (
                <div className="mt-6 bg-[#131A2B] rounded-xl p-6 shadow-lg flex flex-col items-center justify-center max-w-xl mx-auto">
                  <div className="mb-4">
                    <div className="h-16 w-16 rounded-full bg-[#19332b] flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  <h4 className="text-lg font-medium text-white mb-2">Fluxograma Gerado!</h4>
                  <p className="text-sm text-gray-300 text-center mb-4">
                    Seu fluxograma foi criado com base no conteúdo da {selectedOption === 'ia' ? 'IA' : 'personalizado'}.
                  </p>
                  <Button 
                    onClick={handleVisualizarFluxograma}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center justify-center"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    <span>Visualizar Fluxograma</span>
                  </Button>
                </div>
              ) : (
                <div className="w-full mt-6 p-6 bg-white/80 dark:bg-gray-800/80 border border-blue-200/80 dark:border-blue-800/30 rounded-2xl shadow-lg backdrop-blur-xl relative overflow-hidden group hover:shadow-xl transition-all duration-500 hover:border-blue-300 dark:hover:border-blue-700">
                  {/* Efeitos decorativos */}
                  <div className="absolute -right-12 -top-12 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-indigo-400/20 dark:from-blue-400/5 dark:to-indigo-400/10 rounded-full blur-md"></div>
                  <div className="absolute -left-12 -bottom-12 w-24 h-24 bg-gradient-to-tr from-purple-400/10 to-pink-400/20 dark:from-purple-500/5 dark:to-pink-500/10 rounded-full blur-md"></div>
                  
                  {/* Cabeçalho */}
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                        <Eye className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg tracking-tight">Pré-visualização</h4>
                        <p className="text-xs text-blue-600/80 dark:text-blue-400/80 font-medium">Fluxograma interativo</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></span>
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse animate-delay-150"></span>
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse animate-delay-300"></span>
                    </div>
                  </div>
                  
                  {/* Área de animação do fluxograma - Modernizada e Melhorada */}
                  <div className="h-[220px] w-full relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/40 dark:from-gray-900/90 dark:via-blue-950/40 dark:to-indigo-950/30 flex items-center justify-center shadow-inner border border-blue-100/50 dark:border-blue-900/30 group-hover:border-blue-200 dark:group-hover:border-blue-800/50 transition-all duration-500" id="flow-preview-container">
                    {/* Fundo com padrão de pontos (estilo ReactFlow) */}
                    <div className="absolute inset-0">
                      {/* Grade de pontos animados - Pontos menores */}
                      <div className="absolute inset-0 grid grid-cols-12 grid-rows-8">
                        {Array.from({ length: 96 }).map((_, index) => (
                          <div key={index} className="relative flex items-center justify-center">
                            <div 
                              className={`w-0.5 h-0.5 rounded-full bg-blue-400/15 dark:bg-blue-500/15 absolute animate-pulse-slow ${
                                index % 3 === 0 ? 'animate-delay-100' : index % 3 === 1 ? 'animate-delay-200' : 'animate-delay-300'
                              }`}
                            ></div>
                          </div>
                        ))}
                      </div>
                      <div className="absolute inset-0 bg-[url('/images/pattern-grid.svg')] bg-center opacity-5 dark:opacity-10"></div>
                    </div>
                    
                    {/* Nós e conexões animadas - Versão interativa e moderna com conexões melhoradas */}
                    <div className="relative w-full h-full flex justify-center items-center z-10">
                      {/* Canvas interativo para os nós */}
                      <div className="relative w-full max-w-xs h-full flex flex-col items-center justify-center" id="flow-interactive-preview">
                        {/* Layout em camadas para organização correta das linhas */}
                        <div className="relative w-full flex flex-col items-center justify-between h-[170px]">
                          {/* Camada 1: Nó principal/conceito - Menor */}
                          <div className="draggable-node cursor-move w-20 h-8 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-md flex items-center justify-center text-white text-xs font-medium shadow-md hover:shadow-lg hover:shadow-blue-400/20 dark:hover:shadow-blue-500/10 transition-all duration-300 animate-float scale-90 hover:scale-100 transform-gpu z-20"
                              style={{touchAction: 'none'}}>
                            <span className="flex flex-col items-center">
                              <span className="text-[7px] uppercase tracking-wider opacity-70">Conceito</span>
                              <span className="font-semibold text-[9px]">Principal</span>
                            </span>
                          </div>
                          
                          {/* Conexões verticais estáticas (do principal para os do meio) */}
                          <div className="absolute top-[27px] left-1/2 transform -translate-x-1/2 w-0 h-[37px]">
                            <div className="absolute left-0 w-0 h-full border-l-2 border-dashed border-blue-400 dark:border-blue-500 static-dashed"></div>
                          </div>
                          
                          {/* Camada 2: Nós do meio com conexões laterais - Blocos menores */}
                          <div className="flex items-center justify-center space-x-20 z-20 relative mb-2">
                            {/* Nó de contexto (esquerda) - Menor */}
                            <div className="draggable-node cursor-move w-16 h-7 bg-gradient-to-r from-indigo-400 to-indigo-500 dark:from-indigo-500 dark:to-indigo-600 rounded-md flex items-center justify-center text-white text-xs font-medium shadow-sm hover:shadow-md hover:shadow-indigo-400/20 dark:hover:shadow-indigo-500/10 transition-all duration-300 animate-float-delayed-100 scale-90 hover:scale-100 transform-gpu"
                                style={{touchAction: 'none'}}>
                              <span className="font-medium text-[9px]">Contexto</span>
                            </div>
                            
                            {/* Nó de detalhes (direita) - Menor */}
                            <div className="draggable-node cursor-move w-16 h-7 bg-gradient-to-r from-purple-400 to-purple-500 dark:from-purple-500 dark:to-purple-600 rounded-md flex items-center justify-center text-white text-xs font-medium shadow-sm hover:shadow-md hover:shadow-purple-400/20 dark:hover:shadow-purple-500/10 transition-all duration-300 animate-float-delayed-200 scale-90 hover:scale-100 transform-gpu"
                                style={{touchAction: 'none'}}>
                              <span className="font-medium text-[9px]">Detalhes</span>
                            </div>
                          </div>
                          
                          {/* Conexão horizontal entre os nós do meio - Estática */}
                          <div className="absolute top-[73px] w-[72px] left-1/2 transform -translate-x-1/2 -translate-y-[1px]">
                            <div className="absolute h-[2px] w-full border-t-2 border-dashed border-indigo-400 dark:border-indigo-500 static-dashed"></div>
                          </div>
                          
                          {/* Conexões verticais dos nós do meio para o nó de conclusão - Estáticas */}
                          <div className="absolute top-[85px] left-[calc(50%-50px)] w-0 h-[40px]">
                            <div className="absolute left-0 w-0 h-full border-l-2 border-dashed border-indigo-400 dark:border-indigo-500 static-dashed"></div>
                          </div>
                          <div className="absolute top-[85px] left-[calc(50%+50px)] w-0 h-[40px]">
                            <div className="absolute left-0 w-0 h-full border-l-2 border-dashed border-purple-400 dark:border-purple-500 static-dashed"></div>
                          </div>
                          
                          {/* Camada 3: Nó de conclusão - Menor */}
                          <div className="draggable-node cursor-move w-20 h-8 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 rounded-md flex items-center justify-center text-white text-xs font-medium shadow-md hover:shadow-lg hover:shadow-green-400/20 dark:hover:shadow-green-500/10 transition-all duration-300 animate-float-delayed-300 scale-90 hover:scale-100 transform-gpu z-20"
                              style={{touchAction: 'none'}}>
                            <span className="flex flex-col items-center">
                              <span className="text-[7px] uppercase tracking-wider opacity-70">Síntese</span>
                              <span className="font-semibold text-[9px]">Conclusão</span>
                            </span>
                          </div>
                        </div>
                        
                        {/* Partículas flutuantes para efeito de movimento adicional */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                          {Array.from({ length: 8 }).map((_, index) => (
                            <div 
                              key={`particle-${index}`}
                              className={`absolute w-1 h-1 rounded-full bg-blue-400/30 dark:bg-blue-500/30 animate-floating-node`}
                              style={{
                                top: `${20 + Math.random() * 60}%`,
                                left: `${20 + Math.random() * 60}%`,
                                animationDelay: `${index * 0.5}s`,
                                animationDuration: `${5 + Math.random() * 5}s`
                              }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Rodapé com a mensagem do fluxograma */}
                  <div className="mt-4 flex justify-center items-center">
                    <div className="bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-full shadow-md backdrop-blur-sm border border-blue-100/50 dark:border-blue-900/30">
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center">
                        <span className="animate-blink mr-2 h-2 w-2 rounded-full bg-blue-500"></span>
                        O fluxograma gerado aparecerá aqui!
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <Button
                onClick={() => setShowSavedFluxogramas(!showSavedFluxogramas)}
                variant="outline"
                className="w-full py-4 mt-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/40 dark:to-emerald-900/40 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/60 dark:hover:to-emerald-900/60 shadow-sm border border-green-200 dark:border-green-800 rounded-xl backdrop-blur-sm group relative overflow-hidden flex items-center justify-center"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-100/50 to-emerald-100/50 dark:from-green-800/30 dark:to-emerald-800/30 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                <span className="relative flex items-center justify-center">
                  <Save className="h-5 w-5 mr-2 transform group-hover:translate-y-px transition-transform text-green-600 dark:text-green-400" />
                  <span className="font-medium text-green-700 dark:text-green-300">{showSavedFluxogramas ? "Ocultar fluxogramas salvos" : "Ver fluxogramas salvos"}</span>
                </span>
              </Button>
              
              {showSavedFluxogramas && (
                <div className="mt-4 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-200/70 dark:border-gray-700/50 p-5 shadow-sm backdrop-blur-sm">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <Save className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                    Fluxogramas Salvos
                  </h4>
                  
                  {savedFluxogramas.length > 0 ? (
                    <div className="space-y-3">
                      {savedFluxogramas.map((fluxograma, index) => {
                        return (
                          <FluxogramaItem
                            key={index}
                            fluxograma={fluxograma}
                            index={index}
                            onLoadFluxograma={handleLoadSavedFluxograma}
                            onUpdateTitle={(index, newTitle) => {
                              const updatedFluxogramas = [...savedFluxogramas];
                              updatedFluxogramas[index].title = newTitle;
                              setSavedFluxogramas(updatedFluxogramas);
                              localStorage.setItem('savedFluxogramas', JSON.stringify(updatedFluxogramas));
                            }}
                            onDeleteFluxograma={handleDeleteFluxograma}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 px-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                        <FileLineChart className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                      </div>
                      <h5 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Nenhum fluxograma salvo</h5>
                      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                        Crie e salve seus fluxogramas para acessá-los posteriormente nesta seção.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-200/70 dark:border-gray-700/50 p-5 shadow-sm backdrop-blur-sm">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Insira seu conteúdo para gerar o fluxograma</h4>
              <Textarea 
                value={manualContent}
                onChange={(e) => setManualContent(e.target.value)}
                placeholder="Insira aqui o conteúdo sobre o qual você deseja gerar um fluxograma..."
                className="min-h-[200px] resize-none"
              />
              <div className="flex justify-end space-x-2 mt-2">
                <Button
                  onClick={handleCancelManualInput}
                  variant="outline"
                  className="flex items-center"
                >
                  <X className="h-4 w-4 mr-2" />
                  <span>Cancelar</span>
                </Button>
                <Button
                  onClick={handleSubmitManualContent}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center"
                >
                  <SendHorizonal className="h-4 w-4 mr-2" />
                  <span>Gerar Fluxograma</span>
                </Button>
              </div>
            </div>
          )}

          {/* Card de processamento agora está integrado diretamente na visualização condicional acima */}

          {/* Removido cards redundantes de fluxograma gerado, pois agora está integrado no card principal */}
        </ScrollArea>
      )}

      {showDetailModal && selectedNode && (
        <FluxogramaDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          node={selectedNode}
        />
      )}
    </div>
  );
};

export default GerarFluxograma;