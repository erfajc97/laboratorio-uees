import { useState } from 'react'
import {
  BarChart3,
  Bell,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Database,
  FolderTree,
  GitBranch,
  Mail,
  MessageSquare,
  Monitor,
  Server,
  Settings,
} from 'lucide-react'

interface Section {
  id: string
  title: string
  icon: React.ReactNode
  content: React.ReactNode
}

export default function Documentation() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['overview']),
  )
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedSections(newExpanded)
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const CodeBlock = ({
    code,
    language = 'typescript',
    id,
  }: {
    code: string
    language?: string
    id: string
  }) => (
    <div className="relative">
      <button
        onClick={() => copyToClipboard(code, id)}
        className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs flex items-center gap-1"
      >
        {copiedCode === id ? (
          <>
            <Check size={14} /> Copiado
          </>
        ) : (
          <>
            <Copy size={14} /> Copiar
          </>
        )}
      </button>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )

  const MermaidDiagram = ({ code, title }: { code: string; title: string }) => (
    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
        <button
          onClick={() => copyToClipboard(code, `mermaid-${title}`)}
          className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1"
        >
          <Copy size={12} /> Copiar código Mermaid
        </button>
      </div>
      <pre className="bg-white p-3 rounded border text-xs overflow-x-auto">
        <code>{code}</code>
      </pre>
      <p className="text-xs text-gray-500 mt-2">
        Nota: Puedes copiar este código y renderizarlo en{' '}
        <a
          href="https://mermaid.live"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          mermaid.live
        </a>
      </p>
    </div>
  )

  const sections: Array<Section> = [
    {
      id: 'overview',
      title: 'Descripción General',
      icon: <BookOpen size={20} />,
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Objetivo del Proyecto
            </h3>
            <p className="text-gray-700">
              Sistema de gestión de agendamiento judicial con notificaciones
              automáticas mediante Telegram y Email. El sistema permite
              gestionar juicios, participantes y enviar notificaciones en tiempo
              real, incluyendo un módulo completo de métricas y experimentos
              para evaluar el rendimiento del sistema.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Stack Tecnológico</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Backend</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>NestJS 11.0.1</li>
                  <li>TypeScript 5.7.3</li>
                  <li>PostgreSQL</li>
                  <li>Prisma 6.19.0</li>
                  <li>Axios 1.13.2</li>
                  <li>class-validator</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Frontend</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>React 19.2.0</li>
                  <li>TypeScript 5.7.2</li>
                  <li>TanStack Router 1.132.0</li>
                  <li>TanStack Query 5.66.5</li>
                  <li>Tailwind CSS 4.0.6</li>
                  <li>Recharts 3.5.1</li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Características Principales
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Gestión completa de juicios y participantes</li>
              <li>Notificaciones automáticas vía Telegram y Email</li>
              <li>Sistema de métricas en tiempo real</li>
              <li>Experimentos controlados para evaluación de rendimiento</li>
              <li>Dashboard de visualización de datos</li>
              <li>Análisis de impacto económico</li>
              <li>Sistema de auditoría de errores</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'backend-architecture',
      title: 'Arquitectura del Backend (NestJS)',
      icon: <Server size={20} />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Estructura Modular</h3>
            <p className="text-gray-700 mb-4">
              El backend sigue una arquitectura modular basada en NestJS, donde
              cada módulo encapsula una funcionalidad específica.
            </p>
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-semibold mb-2">Módulos Principales:</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>
                  <strong>JuiciosModule</strong>: Gestión CRUD de juicios
                </li>
                <li>
                  <strong>ParticipantesModule</strong>: Gestión de participantes
                  del sistema judicial
                </li>
                <li>
                  <strong>TelegramModule</strong>: Integración con Telegram Bot
                  API
                </li>
                <li>
                  <strong>NotificacionesModule</strong>: Servicio de
                  notificaciones
                </li>
                <li>
                  <strong>EmailModule</strong>: Servicio de envío de emails
                </li>
                <li>
                  <strong>MetricsModule</strong>: Registro y consulta de
                  métricas
                </li>
                <li>
                  <strong>ExperimentsModule</strong>: Ejecución de experimentos
                </li>
                <li>
                  <strong>AuditoriaModule</strong>: Registro de errores y
                  eventos
                </li>
                <li>
                  <strong>PrismaModule</strong>: Configuración de base de datos
                </li>
              </ul>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Diagrama de Módulos</h3>
            <MermaidDiagram
              code={`graph TB
    AppModule[AppModule]
    PrismaModule[PrismaModule]
    JuiciosModule[JuiciosModule]
    ParticipantesModule[ParticipantesModule]
    TelegramModule[TelegramModule]
    NotificacionesModule[NotificacionesModule]
    EmailModule[EmailModule]
    MetricsModule[MetricsModule]
    ExperimentsModule[ExperimentsModule]
    AuditoriaModule[AuditoriaModule]
    
    AppModule --> PrismaModule
    AppModule --> JuiciosModule
    AppModule --> ParticipantesModule
    AppModule --> TelegramModule
    AppModule --> NotificacionesModule
    AppModule --> EmailModule
    AppModule --> MetricsModule
    AppModule --> ExperimentsModule
    AppModule --> AuditoriaModule
    
    NotificacionesModule --> TelegramModule
    NotificacionesModule --> EmailModule
    NotificacionesModule --> MetricsModule
    NotificacionesModule --> AuditoriaModule
    
    ExperimentsModule --> MetricsModule
    ExperimentsModule --> EmailModule
    ExperimentsModule --> TelegramModule
    
    JuiciosModule --> NotificacionesModule
    JuiciosModule --> PrismaModule
    ParticipantesModule --> PrismaModule`}
              title="Arquitectura de Módulos NestJS"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Código: AppModule</h3>
            <CodeBlock
              id="app-module"
              code={`import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { JuiciosModule } from './juicios/juicios.module';
import { ParticipantesModule } from './participantes/participantes.module';
import { TelegramModule } from './telegram/telegram.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { AuditoriaModule } from './auditoria/auditoria.module';
import { EmailModule } from './email/email.module';
import { MetricsModule } from './metrics/metrics.module';
import { ExperimentsModule } from './experiments/experiments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    JuiciosModule,
    ParticipantesModule,
    TelegramModule,
    NotificacionesModule,
    AuditoriaModule,
    EmailModule,
    MetricsModule,
    ExperimentsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}`}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'frontend-architecture',
      title: 'Arquitectura del Frontend (React)',
      icon: <Monitor size={20} />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Arquitectura por Features
            </h3>
            <p className="text-gray-700 mb-4">
              El frontend está organizado por features, donde cada feature
              contiene todos los componentes, hooks, servicios y tipos
              relacionados.
            </p>
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-semibold mb-2">Features Principales:</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>
                  <strong>juicios</strong>: Gestión de juicios (listado, CRUD)
                </li>
                <li>
                  <strong>participantes</strong>: Gestión de participantes
                </li>
                <li>
                  <strong>agendamiento</strong>: Formulario de agendamiento
                  rápido
                </li>
                <li>
                  <strong>auditoria</strong>: Visualización de eventos y errores
                </li>
                <li>
                  <strong>metrics</strong>: Dashboard de métricas y experimentos
                </li>
              </ul>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Enrutamiento con TanStack Router
            </h3>
            <p className="text-gray-700 mb-4">
              Las rutas se definen como archivos en la carpeta{' '}
              <code className="bg-gray-100 px-1 rounded">src/routes/</code> y
              TanStack Router las genera automáticamente.
            </p>
            <CodeBlock
              id="routes-example"
              code={`// src/routes/juicios.tsx
import { createFileRoute } from '@tanstack/react-router'
import JuiciosPage from '../app/features/juicios/JuiciosPage'

export const Route = createFileRoute('/juicios')({
  component: JuiciosPage,
})`}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Gestión de Estado con TanStack Query
            </h3>
            <p className="text-gray-700 mb-4">
              TanStack Query maneja el estado del servidor, caché y
              sincronización automática.
            </p>
            <CodeBlock
              id="query-example"
              code={`import { useQuery } from '@tanstack/react-query'
import { juiciosKeys } from '../queries/juicios.queries'
import { juiciosService } from './services/juicios.service'

export function useJuicios(search?: string) {
  return useQuery({
    queryKey: juiciosKeys.list(search),
    queryFn: () => juiciosService.findAll(search),
  })
}`}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Estructura de Carpetas
            </h3>
            <MermaidDiagram
              code={`graph TD
    src[src/]
    app[app/]
    features[features/]
    juicios[juicios/]
    components[components/]
    hooks[hooks/]
    services[services/]
    types[types/]
    routes[routes/]
    api[api/]
    
    src --> app
    src --> routes
    src --> components
    app --> features
    app --> api
    features --> juicios
    juicios --> components
    juicios --> hooks
    juicios --> services
    juicios --> types`}
              title="Estructura de Carpetas Frontend"
            />
          </div>
        </div>
      ),
    },
    {
      id: 'database',
      title: 'Base de Datos',
      icon: <Database size={20} />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Esquema Prisma</h3>
            <p className="text-gray-700 mb-4">
              La base de datos utiliza PostgreSQL con Prisma como ORM. El
              esquema define los modelos principales del sistema.
            </p>
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <h4 className="font-semibold mb-2">Modelos Principales:</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>
                  <strong>Juicio</strong>: Información de juicios programados
                </li>
                <li>
                  <strong>Participante</strong>: Participantes del sistema
                  judicial
                </li>
                <li>
                  <strong>Notificacion</strong>: Registro de notificaciones
                  enviadas
                </li>
                <li>
                  <strong>NotificationMetricEvent</strong>: Eventos de métricas
                  de notificaciones
                </li>
                <li>
                  <strong>ExperimentRun</strong>: Ejecuciones de experimentos
                </li>
                <li>
                  <strong>ExperimentSeriesPoint</strong>: Puntos de serie
                  temporal de experimentos
                </li>
                <li>
                  <strong>Auditoria</strong>: Registro de errores y eventos
                </li>
              </ul>
            </div>
            <CodeBlock
              id="schema-example"
              code={`model Juicio {
  id          String       @id @default(uuid())
  numeroCaso  String       @unique
  tipoJuicio  String
  fecha       DateTime
  hora        String
  sala        String
  descripcion String?
  estado      EstadoJuicio @default(PROGRAMADO)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  participantes  JuicioParticipante[]
  notificaciones Notificacion[]

  @@map("juicios")
}

model Participante {
  id             String           @id @default(uuid())
  nombre         String
  email          String?
  telefono       String?
  tipo           TipoParticipante
  telegramChatId String?
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt

  juicios        JuicioParticipante[]
  notificaciones Notificacion[]

  @@map("participantes")
}`}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Diagrama de Relaciones (ER)
            </h3>
            <MermaidDiagram
              code={`erDiagram
    Juicio ||--o{ JuicioParticipante : tiene
    Participante ||--o{ JuicioParticipante : participa
    Juicio ||--o{ Notificacion : genera
    Participante ||--o{ Notificacion : recibe
    ExperimentRun ||--o{ NotificationMetricEvent : contiene
    ExperimentRun ||--o{ ExperimentSeriesPoint : genera
    
    Juicio {
      string id PK
      string numeroCaso UK
      datetime fecha
      string estado
    }
    
    Participante {
      string id PK
      string nombre
      string telegramChatId
    }
    
    Notificacion {
      string id PK
      string juicioId FK
      string participanteId FK
      enum tipo
      enum estado
    }
    
    NotificationMetricEvent {
      string id PK
      enum channel
      enum status
      int latencyMs
      string experimentRunId FK
    }
    
    ExperimentRun {
      string id PK
      string name
      enum scenario
      enum status
    }`}
              title="Diagrama Entidad-Relación"
            />
          </div>
        </div>
      ),
    },
    {
      id: 'telegram-integration',
      title: 'Integración con Telegram API',
      icon: <MessageSquare size={20} />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Configuración del Bot
            </h3>
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li>Crear bot con @BotFather en Telegram</li>
              <li>Obtener el token del bot</li>
              <li>
                Configurar variable de entorno:{' '}
                <code className="bg-gray-100 px-1 rounded">
                  TELEGRAM_BOT_TOKEN
                </code>
              </li>
              <li>Configurar webhook para recibir actualizaciones</li>
            </ol>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Servicio de Telegram</h3>
            <CodeBlock
              id="telegram-service"
              code={`@Injectable()
export class TelegramService {
  private readonly botToken: string;
  private readonly apiUrl: string;

  constructor(private configService: ConfigService) {
    this.botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN') || '';
    this.apiUrl = \`https://api.telegram.org/bot\${this.botToken}\`;
  }

  async sendMessage(
    chatId: string,
    message: string,
    keyboard?: { inline_keyboard?: Array<Array<{ text: string; callback_data: string }>> }
  ): Promise<{ success: boolean; messageId?: number }> {
    if (!this.botToken) {
      this.logger.warn('TELEGRAM_BOT_TOKEN no configurado');
      return { success: false };
    }

    try {
      const payload = {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        ...(keyboard && { reply_markup: keyboard }),
      };

      const response = await axios.post(\`\${this.apiUrl}/sendMessage\`, payload);
      const responseData = response.data as { ok: boolean; result?: { message_id: number } };

      if (responseData.ok && responseData.result) {
        return {
          success: true,
          messageId: responseData.result.message_id,
        };
      }

      return { success: false };
    } catch (error) {
      this.logger.error(\`Error enviando mensaje a \${chatId}:\`, error);
      return { success: false };
    }
  }
}`}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Webhook Handler</h3>
            <CodeBlock
              id="telegram-controller"
              code={`@Controller('telegram')
export class TelegramController {
  @Post('webhook')
  async handleWebhook(@Body() update: TelegramUpdate) {
    // Procesar callback queries (botones inline)
    if (update.callback_query) {
      const chatId = update.callback_query.from.id.toString();
      const callbackData = update.callback_query.data;

      // Procesar confirmación de lectura
      if (callbackData.startsWith('confirmar_lectura_')) {
        const notificacionId = callbackData.replace('confirmar_lectura_', '');
        await this.notificacionesService.marcarComoLeido(notificacionId);
        return { ok: true, message: 'Lectura confirmada' };
      }

      // Procesar selección de tipo de participante
      if (callbackData.startsWith('tipo_')) {
        const tipoSeleccionado = callbackData.replace('tipo_', '');
        await this.participantesService.create({
          nombre: \`\${from.first_name} \${from.last_name || ''}\`.trim(),
          tipo: tipoSeleccionado,
          telegramChatId: chatId,
        });
        return { ok: true, message: 'Usuario registrado' };
      }
    }

    // Procesar mensajes del bot (/start, /help)
    if (update.message && update.message.text) {
      const chatId = update.message.chat.id.toString();
      const text = update.message.text.trim();

      if (text === '/start' || text.startsWith('/start')) {
        // Registrar usuario o mostrar botones de selección
        // ...
      }
    }

    return { ok: true };
  }
}`}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Flujo de Notificaciones Telegram
            </h3>
            <MermaidDiagram
              code={`sequenceDiagram
    participant User as Usuario
    participant Bot as Telegram Bot
    participant API as Backend API
    participant DB as Base de Datos
    participant Metrics as Metrics Service

    User->>Bot: /start
    Bot->>API: POST /telegram/webhook
    API->>DB: Crear/Actualizar Participante
    API->>Bot: Enviar mensaje de bienvenida

    Note over API: Crear Juicio
    API->>DB: Guardar Juicio
    API->>Metrics: recordPendingEvent()
    API->>Bot: sendMessage(chatId, mensaje)
    Bot->>User: Notificación recibida
    Bot->>API: Callback (confirmar_lectura)
    API->>DB: Actualizar estado a LEIDO
    API->>Metrics: updateToDelivered()`}
              title="Flujo de Notificaciones Telegram"
            />
          </div>
        </div>
      ),
    },
    {
      id: 'email-integration',
      title: 'Integración con Email',
      icon: <Mail size={20} />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Servicio de Email</h3>
            <p className="text-gray-700 mb-4">
              El servicio de email soporta dos modos: <strong>stub</strong>{' '}
              (simulación) y <strong>SMTP real</strong> (configurable).
            </p>
            <CodeBlock
              id="email-service"
              code={`@Injectable()
export class EmailService {
  private readonly stubMode: boolean;
  private readonly smtpEnabled: boolean;

  constructor(private configService: ConfigService) {
    this.smtpEnabled =
      this.configService.get<string>('SMTP_HOST') !== undefined &&
      this.configService.get<string>('SMTP_HOST') !== '';
    this.stubMode = !this.smtpEnabled;
  }

  async sendEmail(dto: SendEmailDto): Promise<SendEmailResult> {
    if (this.stubMode) {
      return this.sendEmailStub(dto);
    }
    // Implementación SMTP real aquí
  }

  private async sendEmailStub(dto: SendEmailDto): Promise<SendEmailResult> {
    // Simular latencia de red
    await new Promise((resolve) =>
      setTimeout(resolve, 50 + Math.random() * 100),
    );

    // Simular tasa de éxito del 95%
    const success = Math.random() > 0.05;

    if (success) {
      const messageId = \`stub-\${Date.now()}-\${Math.random().toString(36).substring(7)}\`;
      return {
        success: true,
        messageId,
      };
    } else {
      return {
        success: false,
        errorCode: 'SMTP_ERROR',
        errorMessage: 'Simulated error',
      };
    }
  }
}`}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'notifications-system',
      title: 'Sistema de Notificaciones',
      icon: <Bell size={20} />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Flujo Completo de Notificaciones
            </h3>
            <p className="text-gray-700 mb-4">
              El sistema de notificaciones se activa automáticamente cuando se
              crea o actualiza un juicio. Las notificaciones se envían a todos
              los participantes asignados al juicio.
            </p>
            <MermaidDiagram
              code={`flowchart TD
    Start[Crear/Actualizar Juicio] --> GetParticipants[Obtener Participantes]
    GetParticipants --> CheckChannel{¿Canal?}
    CheckChannel -->|EMAIL| SendEmail[Enviar Email]
    CheckChannel -->|TELEGRAM| SendTelegram[Enviar Telegram]
    CheckChannel -->|BOTH| SendBoth[Enviar Ambos]
    
    SendEmail --> RecordPending[Record PENDING Event]
    SendTelegram --> RecordPending
    SendBoth --> RecordPending
    
    RecordPending --> SendToProvider[Enviar a Provider]
    SendToProvider --> Success{¿Éxito?}
    
    Success -->|Sí| UpdateACKED[Update to ACKED]
    Success -->|No| UpdateFAILED[Update to FAILED]
    
    UpdateACKED --> Wait1Min[Esperar 1 minuto]
    Wait1Min --> UpdateDELIVERED[Update to DELIVERED]
    
    UpdateFAILED --> Retry{¿Reintentar?}
    Retry -->|Sí| SendToProvider
    Retry -->|No| End[Fin]`}
              title="Flujo de Notificaciones"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Estados de Notificación
            </h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <ul className="space-y-2">
                <li>
                  <strong>PENDING</strong>: Evento creado, esperando envío
                </li>
                <li>
                  <strong>SENT</strong>: Enviado al provider, esperando ACK
                </li>
                <li>
                  <strong>ACKED</strong>: Provider confirmó recepción
                </li>
                <li>
                  <strong>DELIVERED</strong>: Entregado al destinatario
                </li>
                <li>
                  <strong>FAILED</strong>: Error en el envío
                </li>
              </ul>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Código: Registro de Métricas
            </h3>
            <CodeBlock
              id="notifications-metrics"
              code={`async sendTelegramWithMetrics(
  chatId: string,
  message: string,
  template: string,
  experimentRunId?: string,
): Promise<{ success: boolean; correlationId: string }> {
  const recipientHash = this.hashRecipient(chatId);
  const sentAt = new Date();

  // Registrar evento PENDING
  const correlationId = await this.metricsRecorder.recordPendingEvent({
    channel: NotificationChannel.TELEGRAM,
    template,
    recipientHash,
    experimentRunId,
  });

  try {
    const result = await this.telegramService.sendMessage(chatId, message);

    if (result.success && result.messageId) {
      // Actualizar a ACKED con latencia
      const providerAckAt = new Date();
      const latencyMs = providerAckAt.getTime() - sentAt.getTime();

      await this.metricsRecorder.updateToAcked({
        correlationId,
        status: MetricStatus.ACKED,
        providerAckAt,
        latencyMs,
      });

      // Programar actualización a DELIVERED después de 1 minuto
      setTimeout(() => {
        void this.metricsRecorder.updateToDelivered(correlationId);
      }, 60000);

      return { success: true, correlationId };
    } else {
      await this.metricsRecorder.updateToFailed(
        correlationId,
        'TELEGRAM_SEND_ERROR',
        'Failed to send message',
      );
      return { success: false, correlationId };
    }
  } catch (error) {
    await this.metricsRecorder.updateToFailed(
      correlationId,
      'TELEGRAM_API_ERROR',
      error.message,
    );
    return { success: false, correlationId };
  }
}`}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'metrics-experiments',
      title: 'Sistema de Métricas y Experimentos',
      icon: <BarChart3 size={20} />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Arquitectura del Módulo
            </h3>
            <p className="text-gray-700 mb-4">
              El módulo de métricas permite registrar, consultar y visualizar
              métricas de rendimiento del sistema de notificaciones. Los
              experimentos permiten ejecutar pruebas controladas.
            </p>
            <MermaidDiagram
              code={`graph TB
    MetricsModule[MetricsModule]
    ExperimentsModule[ExperimentsModule]
    MetricsService[MetricsService]
    MetricsRecorderService[MetricsRecorderService]
    ExperimentsService[ExperimentsService]
    ExperimentsRunnerService[ExperimentsRunnerService]
    
    MetricsModule --> MetricsService
    MetricsModule --> MetricsRecorderService
    ExperimentsModule --> ExperimentsService
    ExperimentsModule --> ExperimentsRunnerService
    
    ExperimentsRunnerService --> MetricsRecorderService
    ExperimentsRunnerService --> EmailService
    ExperimentsRunnerService --> TelegramService
    NotificacionesService --> MetricsRecorderService`}
              title="Arquitectura de Métricas"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Flujo de Registro de Métricas
            </h3>
            <CodeBlock
              id="metrics-recorder"
              code={`@Injectable()
export class MetricsRecorderService {
  async recordPendingEvent(dto: RecordMetricEventDto): Promise<string> {
    const correlationId = dto.correlationId || randomUUID();
    const sentAt = new Date();

    await this.prisma.notificationMetricEvent.create({
      data: {
        channel: dto.channel,
        template: dto.template,
        recipientHash: dto.recipientHash,
        correlationId,
        status: MetricStatus.PENDING,
        sentAt,
        experimentRunId: dto.experimentRunId,
      },
    });

    return correlationId;
  }

  async updateToAcked(dto: UpdateMetricEventDto): Promise<void> {
    await this.prisma.notificationMetricEvent.updateMany({
      where: { correlationId: dto.correlationId },
      data: {
        status: MetricStatus.ACKED,
        providerAckAt: dto.providerAckAt,
        latencyMs: dto.latencyMs,
      },
    });
  }
}`}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Sistema de Experimentos
            </h3>
            <p className="text-gray-700 mb-4">
              Los experimentos permiten ejecutar pruebas controladas con
              diferentes escenarios (latencia, throughput, inyección de
              errores).
            </p>
            <CodeBlock
              id="experiments-runner"
              code={`async runExperiment(
  experiment: ExperimentRun,
  dryRun: boolean,
): Promise<void> {
  const limit = pLimit(experiment.concurrency);
  const ratePerSec = experiment.ratePerSec || 10;
  const delayBetweenBatches = 1000 / ratePerSec;

  const sendMessage = async (index: number): Promise<void> => {
    const channel = this.getChannelForTarget(experiment.channelTarget, index);
    const correlationId = await this.metricsRecorder.recordPendingEvent({
      channel,
      template: \`experiment-\${experiment.scenario}\`,
      recipientHash: this.hashRecipient(\`test-\${experiment.id}-\${index}\`),
      experimentRunId: experiment.id,
    });

    if (dryRun) {
      // Simular envío
      await new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 100));
      const success = Math.random() > 0.05;
      if (success) {
        await this.metricsRecorder.updateToAcked({
          correlationId,
          status: MetricStatus.ACKED,
          providerAckAt: new Date(),
          latencyMs: 50 + Math.random() * 200,
        });
      }
    } else {
      // Envío real
      if (channel === NotificationChannel.EMAIL) {
        const result = await this.emailService.sendEmail({ /* ... */ });
        // Actualizar métricas según resultado
      }
    }
  };

  // Ejecutar con control de concurrencia y rate limiting
  for (let i = 0; i < experiment.totalMessages; i++) {
    tasks.push(limit(() => sendMessage(i)));
    if (i % ratePerSec === 0) {
      await new Promise((resolve) => setTimeout(resolve, delayBetweenBatches));
    }
  }

  await Promise.all(tasks);
}`}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'env-variables',
      title: 'Variables de Entorno',
      icon: <Settings size={20} />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Backend (.env)</h3>
            <CodeBlock
              id="backend-env"
              language="env"
              code={`# Base de datos
DATABASE_URL="postgresql://usuario:password@localhost:5432/gestorjudicial?schema=public"

# Telegram
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz

# Servidor
PORT=3001

# Email (opcional - si no se configura, usa modo stub)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=usuario@example.com
SMTP_PASSWORD=password

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:3000`}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Frontend (.env)</h3>
            <CodeBlock
              id="frontend-env"
              language="env"
              code={`# URL del backend API
VITE_API_URL=http://localhost:3001`}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'folder-structure',
      title: 'Arquitectura de Carpetas',
      icon: <FolderTree size={20} />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Backend</h3>
            <CodeBlock
              id="backend-structure"
              language="text"
              code={`gestorjudicial/
├── src/
│   ├── app.module.ts          # Módulo raíz
│   ├── main.ts                # Punto de entrada
│   ├── juicios/               # Módulo de juicios
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── juicios.controller.ts
│   │   ├── juicios.service.ts
│   │   └── juicios.module.ts
│   ├── participantes/         # Módulo de participantes
│   ├── notificaciones/        # Servicio de notificaciones
│   ├── telegram/              # Integración Telegram
│   │   ├── telegram.service.ts
│   │   ├── telegram.controller.ts
│   │   └── telegram.module.ts
│   ├── email/                 # Servicio de email
│   ├── metrics/               # Módulo de métricas
│   │   ├── metrics.service.ts
│   │   ├── metrics-recorder.service.ts
│   │   └── metrics.controller.ts
│   ├── experiments/           # Módulo de experimentos
│   ├── auditoria/             # Sistema de auditoría
│   └── prisma/                # Configuración Prisma
├── prisma/
│   ├── schema.prisma          # Esquema de base de datos
│   └── migrations/           # Migraciones
└── package.json`}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Frontend</h3>
            <CodeBlock
              id="frontend-structure"
              language="text"
              code={`Gestor de agendamiento judicial/
├── src/
│   ├── app/
│   │   ├── api/                    # Configuración de API
│   │   │   ├── axios.config.ts
│   │   │   └── endpoints.ts
│   │   ├── features/               # Módulos de funcionalidades
│   │   │   ├── juicios/
│   │   │   │   ├── components/     # Componentes específicos
│   │   │   │   ├── hooks/         # Custom hooks
│   │   │   │   ├── mutations/     # Mutaciones
│   │   │   │   ├── services/      # Servicios de API
│   │   │   │   └── types/         # Tipos TypeScript
│   │   │   ├── participantes/
│   │   │   ├── agendamiento/
│   │   │   ├── auditoria/
│   │   │   └── metrics/
│   │   │       ├── components/
│   │   │       ├── services/
│   │   │       └── types/
│   │   └── queries/                # Query keys
│   ├── components/                 # Componentes compartidos
│   ├── routes/                     # Rutas (TanStack Router)
│   └── integrations/              # Integraciones
└── package.json`}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'flow-diagrams',
      title: 'Diagramas de Flujo',
      icon: <GitBranch size={20} />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Flujo de Creación de Juicio y Notificación
            </h3>
            <MermaidDiagram
              code={`sequenceDiagram
    participant Client as Cliente Frontend
    participant API as Backend API
    participant DB as Base de Datos
    participant Notif as NotificacionesService
    participant Telegram as TelegramService
    participant Metrics as MetricsService

    Client->>API: POST /juicios
    API->>DB: Crear Juicio
    DB-->>API: Juicio creado
    API->>Notif: notificarCreacionJuicio(juicioId)
    Notif->>DB: Obtener participantes
    Notif->>Metrics: recordPendingEvent()
    Metrics->>DB: Guardar evento PENDING
    Notif->>Telegram: sendMessage(chatId, mensaje)
    Telegram->>Telegram: API de Telegram
    Telegram-->>Notif: { success: true, messageId }
    Notif->>Metrics: updateToAcked()
    Metrics->>DB: Actualizar a ACKED
    Notif->>DB: Crear Notificacion
    API-->>Client: Juicio creado`}
              title="Flujo de Creación de Juicio"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Flujo de Registro de Usuario en Telegram
            </h3>
            <MermaidDiagram
              code={`sequenceDiagram
    participant User as Usuario
    participant Bot as Telegram Bot
    participant API as Backend API
    participant DB as Base de Datos

    User->>Bot: /start
    Bot->>API: POST /telegram/webhook
    API->>DB: Buscar participante por chatId
    alt Participante no existe
        API->>DB: Crear nuevo participante
        API->>Bot: Enviar mensaje de bienvenida
        Bot->>User: Mostrar botones de tipo
        User->>Bot: Seleccionar tipo (callback)
        Bot->>API: Callback query
        API->>DB: Actualizar tipo de participante
        API->>Bot: Confirmar registro
        Bot->>User: Registro exitoso
    else Participante existe
        API->>Bot: Mensaje de ya registrado
        Bot->>User: Información actual
    end`}
              title="Flujo de Registro de Usuario"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Flujo de Experimentos
            </h3>
            <MermaidDiagram
              code={`flowchart TD
    Start[Crear Experimento] --> Config[Configurar parámetros]
    Config --> Run[Ejecutar Experimento]
    Run --> Init[Inicializar contadores]
    Init --> Loop[Loop: totalMessages]
    Loop --> GetChannel[Determinar canal]
    GetChannel --> RecordPending[Record PENDING]
    RecordPending --> Send{¿Dry Run?}
    Send -->|Sí| Simulate[Simular envío]
    Send -->|No| RealSend[Enviar real]
    Simulate --> UpdateMetrics[Actualizar métricas]
    RealSend --> UpdateMetrics
    UpdateMetrics --> CheckLimit{¿Rate limit?}
    CheckLimit -->|Sí| Wait[Esperar delay]
    CheckLimit -->|No| Next[Próximo mensaje]
    Wait --> Next
    Next --> More{¿Más mensajes?}
    More -->|Sí| Loop
    More -->|No| Aggregate[Agregar series]
    Aggregate --> Calculate[Calcular resumen]
    Calculate --> Save[Guardar resultados]
    Save --> End[Fin]`}
              title="Flujo de Experimentos"
            />
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-6">
        <h2 className="text-xl font-bold text-blue-900 mb-2">
          📚 Documentación Técnica del Proyecto
        </h2>
        <p className="text-blue-800">
          Esta sección contiene toda la documentación técnica del sistema de
          gestión de agendamiento judicial, incluyendo arquitectura,
          tecnologías, integraciones y flujos de trabajo.
        </p>
      </div>

      <div className="space-y-2">
        {sections.map((section) => (
          <div
            key={section.id}
            className="bg-white border border-gray-200 rounded-md shadow"
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-gray-600">{section.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {section.title}
                </h3>
              </div>
              {expandedSections.has(section.id) ? (
                <ChevronDown size={20} className="text-gray-500" />
              ) : (
                <ChevronRight size={20} className="text-gray-500" />
              )}
            </button>
            {expandedSections.has(section.id) && (
              <div className="border-t border-gray-200 p-6">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
