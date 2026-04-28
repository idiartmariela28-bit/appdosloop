import React, { useState, useEffect, useMemo } from 'react';
import {
    AlertTriangle,
    ArrowRight,
    History,
    PieChart as ChartIcon,
    X,
    CheckCircle2,
    Brain,
    ChevronRight,
    Clock,
    Trash2,
    Info,
    Zap,
    MessageSquare,
    Ghost,
    DoorOpen,
    Mic,
    ShieldAlert,
    Lightbulb,
    Target,
    Activity,
    Wind,
    Heart,
    Sparkles,
    Stars,
    Timer,
    Flame,
    Compass,
    ShieldCheck
} from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis
} from 'recharts';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

// --- CONSTANTES PSICOLÓGICAS ---

const PSYCH_INSIGHTS = {
    "Anticipando algo que no pasó": "Esto es 'Ansiedad Anticipatoria'. Tu mente intenta controlar el futuro mediante el miedo para que 'nada te tome por sorpresa'. Es una ilusión de seguridad que consume tu energía vital del presente.",
    "Repasando algo que ya pasó": "Se conoce como 'Rumiación'. Tu cerebro intenta 'editar' una película que ya se estrenó. La culpa es el pegamento de este loop; soltar significa aceptar que no podés controlar el pasado.",
    "Dudando de una decisión": "Es 'Parálisis por Análisis'. El miedo a la pérdida es mayor que el deseo de ganar. Recordá: no decidir también es una decisión, y suele ser la que más angustia genera.",
    "Imaginando un problema": "Estás en una 'Simulación Catastrófica'. Tu cuerpo está respondiendo con cortisol real a una amenaza ficticia. Tu sistema nervioso no sabe que es un ensayo mental, por eso te duele.",
    "Enviar mensaje": "Buscás una 'Descarga de Tensión'. Al enviar el mensaje, creés que la ansiedad pasará a la otra persona. En realidad, solo creás una nueva espera (el 'visto') que alimentará el loop.",
    "Decir todo": "Es un 'Desborde Reactivo'. Tu neocórtex se apagó y tu cerebro reptiliano tomó el control. Gritar es un alivio físico momentáneo seguido de un costo relacional y emocional alto.",
    "Irme / Esconderme": "Respuesta de Evitación. Al huir, le confirmás a tu cerebro que la situación es 'peligrosa', reforzando el miedo para la próxima vez que ocurra algo similar.",
    "Default": "Todo pensamiento repetitivo es un hábito neuronal. Interrumpirlo es un acto de voluntad que requiere práctica constante."
};

const LOOP_CONCLUSIONS = [
    {
        title: "La Apertura",
        text: "Frenar no es solo detenerse, es elegirse. Al hacerte consciente de lo que pasa en tu mente, has dejado de ser un pasajero para convertirte en el guía.",
        sub: "Al observar tu mente sin juzgarla, has plantado la semilla de una vida más libre y liviana."
    },
    {
        title: "Soberanía Ganada",
        text: "Has transformado el ruido en silencio consciente. Este es el primer paso hacia una versión de vos que ya no se sabotea por hábito.",
        sub: "Tu conciencia se expande cada vez que decidís no creerle ciegamente a tus miedos."
    },
    {
        title: "Paz en la Conciencia",
        text: "Al observar tu mente, dejaste de ser el pensamiento para ser quien lo observa. En esa distancia sagrada reside tu verdadera libertad.",
        sub: "Lo que viene ahora nace de un lugar de presencia, no de reacción. Confía en tu nueva claridad."
    }
];

const IMPULSE_CONCLUSIONS = [
    {
        title: "Dominio Biológico",
        text: "La descarga química ya salió de tu torrente sanguíneo. Has vencido a la biología pura al no alimentar el fuego con más pensamientos.",
        sub: "Hoy te has dado el regalo de no arrepentirte mañana. Eso es amor propio en acción."
    },
    {
        title: "Soberanía Emocional",
        text: "Permitiste que la ola pasara sin ahogarte en ella. Ahora que la química bajó, tu claridad es tu mejor aliada.",
        sub: "Elegiste la conciencia sobre la reacción visceral. Estás elevando tu nivel de respuesta ante la vida."
    },
    {
        title: "El Poder del Silencio",
        text: "El impulso era una llama. Al no darle 'leña' con rumiación, la llama se apagó sola. Disfruta de la calma que acabas de proteger.",
        sub: "Tu fuerza no está en gritar, sino en la capacidad de contenerte hasta que el guía interno regrese."
    }
];

const COGNITIVE_DISTORTIONS = [
    { id: "Catastrofismo", label: "Catastrofismo", desc: "Pensar que lo peor va a pasar sí o sí." },
    { id: "Lectura de Mente", label: "Lectura de Mente", desc: "Creer que sabés lo que los demás piensan de vos." },
    { id: "Todo o Nada", label: "Todo o Nada", desc: "Si no es perfecto, es un fracaso total." },
    { id: "Personalización", label: "Personalización", desc: "Creer que todo lo malo es por tu culpa." },
    { id: "Filtro Negativo", label: "Filtro Negativo", desc: "Solo ves lo malo e ignorás lo bueno." }
];

const EMOTIONS = ["Ansiedad", "Miedo", "Ira", "Culpa", "Tristeza", "Frustración"];

export default function App() {
    const [view, setView] = useState('home');
    const [entries, setEntries] = useState([]);
    const [currentEntry, setCurrentEntry] = useState(null);
    const [randomIdx, setRandomIdx] = useState(0);
    const [timeLeft, setTimeLeft] = useState(90);
   
    // Persistencia
    useEffect(() => {
        const saved = localStorage.getItem('cortando_el_loop_data');
        if (saved) {
            try {
                setEntries(JSON.parse(saved));
            } catch (e) { console.error(e); }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cortando_el_loop_data', JSON.stringify(entries));
    }, [entries]);

    // Lógica del Timer de 90 segundos
    useEffect(() => {
        let timer;
        if (view === 'impulse_step_2' && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [view, timeLeft]);

    // Handlers
    const startLoop = () => {
        setCurrentEntry({
            id: Date.now(),
            type: 'loop',
            timestamp: new Date().toISOString(),
            loop_type: '',
            emotion: '',
            distortion: '',
            is_real: false,
            cost: '',
            action: '',
            optional_text: ''
        });
        setRandomIdx(Math.floor(Math.random() * LOOP_CONCLUSIONS.length));
        setView('loop_step_1');
    };

    const startImpulse = () => {
        setCurrentEntry({
            id: Date.now(),
            type: 'impulse',
            timestamp: new Date().toISOString(),
            impulse_type: '',
            consequence_check: false,
            optional_text: ''
        });
        setTimeLeft(90);
        setRandomIdx(Math.floor(Math.random() * IMPULSE_CONCLUSIONS.length));
        setView('impulse_step_1');
    };

    const saveEntry = () => {
        setEntries([currentEntry, ...entries]);
        setView('home');
        setCurrentEntry(null);
    };

    const deleteEntry = (id) => {
        setEntries(entries.filter(e => e.id !== id));
    };

    const stats = useMemo(() => {
        if (entries.length === 0) return null;
        const loops = entries.filter(e => e.type === 'loop');
        const typeCounts = entries.reduce((acc, e) => {
            const label = e.type === 'loop' ? e.loop_type : e.impulse_type;
            if (label) acc[label] = (acc[label] || 0) + 1;
            return acc;
        }, {});
        const sortedTypes = Object.entries(typeCounts).sort((a,b) => b[1] - a[1]);
        return {
            total: entries.length,
            loopCount: loops.length,
            impulseCount: entries.length - loops.length,
            mostCommonType: sortedTypes[0]?.[0],
            typeData: sortedTypes.map(([name, value]) => ({ name, value }))
        };
    }, [entries]);

    const Header = ({ title, showBack = true }) => (
        <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-4">
                {showBack && (
                    <button onClick={() => setView('home')} className="p-2 bg-slate-100 rounded-full text-slate-600 active:scale-90 transition-transform">
                        <X className="w-5 h-5" />
                    </button>
                )}
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
            </div>
        </div>
    );

    // --- RENDER VISTAS ---

    if (view === 'home') {
        return (
            <div className="max-w-md mx-auto min-h-[600px] p-6 flex flex-col animate-fade-in">
                <div className="flex-1 flex flex-col items-center justify-center space-y-8 py-10 text-center">
                    <div className="relative">
                        <div className="w-20 h-20 bg-violet-600 rounded-[2.2rem] flex items-center justify-center shadow-2xl shadow-violet-200">
                            <Compass className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-teal-400 rounded-full border-4 border-white shadow-sm"></div>
                    </div>
                   
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Cortando el Loop</h2>
                        <p className="text-slate-500 font-medium px-6 text-sm leading-relaxed">Entrenamiento de soberanía mental e inteligencia emocional profunda.</p>
                    </div>

                    <div className="w-full space-y-4">
                        <button onClick={startLoop} className="group w-full p-6 bg-white border-2 border-violet-100 hover:border-violet-500 rounded-3xl transition-all shadow-sm hover:shadow-md flex items-center gap-5 active:scale-95">
                            <div className="p-4 bg-violet-100 text-violet-600 rounded-2xl group-hover:bg-violet-600 group-hover:text-white transition-colors">
                                <Activity className="w-7 h-7" />
                            </div>
                            <div className="text-left">
                                <p className="font-black text-slate-900 text-lg uppercase leading-tight">Interrumpir Loop</p>
                                <p className="text-slate-500 text-xs font-medium">Frenar el pensamiento automático.</p>
                            </div>
                        </button>
                       
                        <button onClick={startImpulse} className="group w-full p-6 bg-white border-2 border-teal-100 hover:border-teal-500 rounded-3xl transition-all shadow-sm hover:shadow-md flex items-center gap-5 active:scale-95">
                            <div className="p-4 bg-teal-100 text-teal-600 rounded-2xl group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                <Zap className="w-7 h-7" />
                            </div>
                            <div className="text-left">
                                <p className="font-black text-slate-900 text-lg uppercase leading-tight">Frenar Impulso</p>
                                <p className="text-slate-500 text-xs font-medium">Dominar la urgencia reactiva.</p>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                    <button onClick={() => setView('history')} className="flex items-center justify-center gap-2 p-4 bg-slate-50 rounded-2xl text-slate-600 font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-all">
                        <History className="w-4 h-4" /> Bitácora
                    </button>
                    <button onClick={() => setView('patterns')} className="flex items-center justify-center gap-2 p-4 bg-slate-50 rounded-2xl text-slate-600 font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-all">
                        <Target className="w-4 h-4" /> Patrones
                    </button>
                </div>
            </div>
        );
    }

    // --- FLUJO LOOP ---
    if (view.startsWith('loop_step')) {
        return (
            <div className="max-w-md mx-auto p-6 animate-fade-in">
                {view === 'loop_step_1' && (
                    <>
                        <Header title="Identificar Patrón" />
                        <p className="text-xl font-black text-slate-900 mb-6">¿Qué laberinto te atrapó?</p>
                        <div className="space-y-3">
                            {["Anticipando algo que no pasó", "Repasando algo que ya pasó", "Dudando de una decisión", "Imaginando un problema"].map(t => (
                                <button key={t} onClick={() => { setCurrentEntry({...currentEntry, loop_type: t}); setView('loop_step_2'); }}
                                    className="w-full p-5 text-left bg-white border-2 border-slate-100 rounded-2xl hover:border-violet-500 transition-all flex items-center justify-between shadow-sm active:scale-[0.98]">
                                    <span className="font-bold text-slate-700">{t}</span>
                                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-violet-500" />
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {view === 'loop_step_2' && (
                    <>
                        <Header title="Sentir" />
                        <p className="text-xl font-black text-slate-900 mb-2 text-center">¿Qué sentís en el cuerpo?</p>
                        <p className="text-slate-500 text-sm mb-8 text-center italic font-medium px-4 leading-tight">Ponerle nombre a la emoción reduce la actividad de la amígdala.</p>
                        <div className="grid grid-cols-2 gap-3">
                            {EMOTIONS.map(e => (
                                <button key={e} onClick={() => { setCurrentEntry({...currentEntry, emotion: e}); setView('loop_step_3'); }}
                                    className="p-5 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-700 hover:border-violet-500 active:scale-95 transition-all shadow-sm">
                                    {e}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {view === 'loop_step_3' && (
                    <>
                        <Header title="Detectar Trampa" />
                        <p className="text-xl font-black text-slate-900 mb-6 text-center">¿Cómo te está engañando tu mente?</p>
                        <div className="space-y-3">
                            {COGNITIVE_DISTORTIONS.map(d => (
                                <button key={d.id} onClick={() => { setCurrentEntry({...currentEntry, distortion: d.id}); setView('loop_step_4'); }}
                                    className="w-full p-5 text-left bg-white border-2 border-slate-100 rounded-2xl hover:border-violet-500 transition-all shadow-sm active:scale-[0.98]">
                                    <p className="font-black text-violet-600 uppercase text-[10px] tracking-widest mb-1">{d.id}</p>
                                    <p className="text-sm text-slate-600 font-semibold leading-snug">{d.desc}</p>
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {view === 'loop_step_4' && (
                    <div className="text-center space-y-10 flex flex-col justify-center min-h-[500px]">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-black text-slate-900 leading-tight">Auditoría de Realidad</h2>
                            <p className="text-slate-500 text-sm font-medium px-4">Si esto fuera una prueba científica: ¿Es un hecho físico o una historia de tu mente?</p>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => { setCurrentEntry({...currentEntry, is_real: true}); setView('loop_step_5'); }}
                                    className="p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 hover:border-teal-500 text-slate-800 font-black transition-all active:scale-95 shadow-sm">
                                    ES UN HECHO
                                </button>
                                <button onClick={() => { setCurrentEntry({...currentEntry, is_real: false}); setView('loop_step_5'); }}
                                    className="p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 hover:border-violet-500 text-slate-800 font-black transition-all active:scale-95 shadow-sm">
                                    ES UN RELATO
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'loop_step_5' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="p-7 bg-violet-50 rounded-[2.5rem] border-2 border-violet-100 relative shadow-sm">
                            <div className="absolute -top-4 left-6 p-3 bg-violet-600 text-white rounded-2xl shadow-lg">
                                <Lightbulb className="w-6 h-6" />
                            </div>
                            <div className="mt-4 space-y-4">
                                <p className="font-black text-violet-900 uppercase text-[10px] tracking-widest">Espejo Psicológico</p>
                                <p className="text-slate-800 font-semibold text-lg leading-relaxed italic">"{PSYCH_INSIGHTS[currentEntry.loop_type] || PSYCH_INSIGHTS.Default}"</p>
                                <div className="pt-4 border-t border-violet-200 text-xs text-violet-700 font-bold leading-relaxed">
                                    Tu mente está usando '{currentEntry.distortion}' para manejar tu '{currentEntry.emotion}'. No es la realidad, es tu software de defensa.
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-slate-900">¿Qué te cuesta seguir rumiando esto?</h3>
                            {["Perder mi paz", "Drenar mi energía", "Dañar mis vínculos"].map(cost => (
                                <button key={cost} onClick={() => { setCurrentEntry({...currentEntry, cost}); setView('loop_step_6'); }}
                                    className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-700 hover:border-violet-500 transition-all text-left flex justify-between shadow-sm active:scale-[0.98]">
                                    {cost} <ChevronRight className="w-4 h-4 text-slate-300" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {view === 'loop_step_6' && (
                    <div className="flex flex-col min-h-[500px]">
                        <Header title="El Quiebre" />
                        <div className="bg-teal-50 p-6 rounded-3xl border-2 border-teal-100 mb-6 flex items-center gap-4 shadow-sm">
                            <div className="p-3 bg-teal-500 text-white rounded-full shadow-lg shadow-teal-100"><Wind className="w-6 h-6" /></div>
                            <p className="text-teal-900 text-sm font-bold leading-tight italic">Hacé una pausa. Respirá profundamente 3 veces. Soltá el aire con calma.</p>
                        </div>
                        <p className="text-slate-700 font-black mb-4 text-lg">¿Cuál es la verdad madura de este pensamiento?</p>
                        <textarea
                            className="w-full flex-1 p-5 bg-white border-2 border-slate-100 rounded-[2rem] focus:border-violet-500 focus:ring-4 focus:ring-violet-50 outline-none resize-none text-slate-800 shadow-inner font-medium text-lg leading-relaxed"
                            placeholder="Ej: 'Me asusta el futuro, pero estoy haciendo lo mejor que puedo hoy'..."
                            value={currentEntry.optional_text}
                            onChange={(e) => setCurrentEntry({...currentEntry, optional_text: e.target.value})}
                        />
                        <button onClick={() => setView('loop_step_7')} className="mt-6 w-full py-5 bg-violet-600 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 flex items-center justify-center gap-2 transition-all">
                            CONTINUAR <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {view === 'loop_step_7' && (
                    <div className="flex flex-col justify-center min-h-[600px] text-center space-y-10 animate-fade-in">
                        <div className="space-y-6">
                            <div className="inline-flex p-6 bg-violet-50 text-violet-600 rounded-full relative">
                                <Heart className="w-12 h-12 fill-violet-500 opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150" />
                                <Sparkles className="w-12 h-12 relative z-10" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-3xl font-black text-slate-900 leading-tight">{LOOP_CONCLUSIONS[randomIdx].title}</h2>
                                <p className="text-lg text-slate-600 leading-relaxed px-4 font-medium italic">
                                    {LOOP_CONCLUSIONS[randomIdx].text}
                                </p>
                                <div className="p-6 bg-violet-50 rounded-[2rem] border-2 border-violet-100 text-violet-900 font-bold text-sm leading-relaxed shadow-sm">
                                    {LOOP_CONCLUSIONS[randomIdx].sub}
                                </div>
                            </div>
                        </div>
                        <button onClick={saveEntry} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all hover:bg-slate-800">
                            FINALIZAR Y SOLTAR
                        </button>
                    </div>
                )}
            </div>
        );
    }

    // --- FLUJO IMPULSO ---
    if (view.startsWith('impulse_step')) {
        return (
            <div className="max-w-md mx-auto p-6 animate-fade-in">
                {view === 'impulse_step_1' && (
                    <>
                        <Header title="Frenar Impulso" />
                        <p className="text-xl font-black text-slate-800 mb-6">¿Qué reacción urgente detectaste?</p>
                        <div className="space-y-3">
                            {[
                                { id: "Enviar mensaje", label: "Enviar un mensaje", sub: "Buscando alivio reactivo o ataque." },
                                { id: "Decir todo", label: "Decir todo lo que molesta", sub: "Descarga emocional sin filtro racional." },
                                { id: "Gritar", label: "Gritar / Explotar", sub: "Colapso del sistema de regulación interna." },
                                { id: "Irme / Esconderme", label: "Irme o esconderme", sub: "Respuesta de huida por desborde." }
                            ].map(i => (
                                <button key={i.id} onClick={() => { setCurrentEntry({...currentEntry, impulse_type: i.id}); setView('impulse_step_2'); }}
                                    className="w-full p-5 text-left bg-white border-2 border-slate-100 rounded-2xl hover:border-teal-500 transition-all active:scale-[0.98] shadow-sm">
                                    <p className="font-black text-slate-900 leading-tight">{i.label}</p>
                                    <p className="text-xs text-slate-500 mt-1 font-medium">{i.sub}</p>
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {view === 'impulse_step_2' && (
                    <div className="text-center space-y-8 flex flex-col justify-center min-h-[550px]">
                        <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
                            <svg className="absolute w-full h-full -rotate-90">
                                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-teal-50" />
                                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent"
                                    className="text-teal-500 transition-all duration-1000"
                                    strokeDasharray={364}
                                    strokeDashoffset={364 - (364 * timeLeft) / 90}
                                />
                            </svg>
                            <div className="text-3xl font-black text-teal-600">{timeLeft}s</div>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-3xl font-black text-slate-900 leading-tight">La Regla de los 90s</h2>
                            <p className="text-slate-600 font-semibold px-4 leading-relaxed">
                                Científicamente, la respuesta química de una emoción dura solo <span className="text-teal-600">90 segundos</span>.
                            </p>
                            <div className="p-6 bg-teal-50 border-2 border-teal-100 rounded-[2.5rem] text-left space-y-4 shadow-sm">
                                <p className="text-sm text-teal-900 font-bold leading-snug">
                                    Si después de minuto y medio seguís sintiendo el impulso, es porque estás <span className="underline">alimentando el fuego</span> con tus pensamientos.
                                </p>
                                <p className="text-xs text-teal-700 italic font-medium leading-relaxed">
                                    Observá la química salir de tu cuerpo. No le des más leña (ideas) al impulso. Dejalo morir solo.
                                </p>
                            </div>
                        </div>
                        <button disabled={timeLeft > 0} onClick={() => setView('impulse_step_3')}
                            className={cn(
                                "w-full py-5 rounded-2xl font-black text-lg transition-all",
                                timeLeft > 0 ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-teal-500 text-white shadow-lg shadow-teal-100 hover:bg-teal-600 active:scale-95"
                            )}>
                            {timeLeft > 0 ? "DESACTIVANDO QUÍMICA..." : "LA OLA PASÓ. CONTINUAR."}
                        </button>
                    </div>
                )}

                {view === 'impulse_step_3' && (
                    <div className="flex flex-col min-h-[600px]">
                        <Header title="Vaciado Seguro" />
                        <div className="mb-4 space-y-1">
                            <div className="flex items-center gap-2 text-teal-600 font-black text-lg uppercase tracking-tight">
                                <Flame className="w-5 h-5" /> Zona de Catarsis
                            </div>
                            <p className="text-sm text-slate-500 leading-snug font-medium italic">
                                Escribí sin filtros. Descargá el veneno acá. Al ponerlo en palabras dentro de este espacio, dejás de rumiarlo y evitás alimentar el impulso de nuevo.
                            </p>
                        </div>
                        <textarea
                            className="w-full flex-1 p-6 bg-slate-900 text-teal-400 font-mono border-none rounded-[2rem] focus:ring-4 focus:ring-teal-100 outline-none resize-none text-base shadow-2xl"
                            placeholder="DESCÁRGATE TOTALMENTE ACÁ... NO ALIMENTES MÁS EL FUEGO."
                            value={currentEntry.optional_text}
                            onChange={(e) => setCurrentEntry({...currentEntry, optional_text: e.target.value})}
                        />
                        <button onClick={() => setView('impulse_step_4')} className="mt-6 w-full py-5 bg-teal-600 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all">
                            CONTINUAR <ArrowRight className="w-5 h-5 ml-2 inline" />
                        </button>
                    </div>
                )}

                {view === 'impulse_step_4' && (
                    <div className="flex flex-col justify-center min-h-[600px] text-center space-y-10 animate-fade-in">
                        <div className="space-y-6">
                            <div className="inline-flex p-6 bg-teal-50 text-teal-600 rounded-full relative">
                                <Stars className="w-12 h-12 relative z-10" />
                                <div className="w-16 h-16 bg-teal-400/20 absolute rounded-full animate-ping"></div>
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-3xl font-black text-slate-900 leading-tight">{IMPULSE_CONCLUSIONS[randomIdx].title}</h2>
                                <p className="text-lg text-slate-600 leading-relaxed px-4 font-medium italic">
                                    {IMPULSE_CONCLUSIONS[randomIdx].text}
                                </p>
                                <div className="p-6 bg-teal-50 rounded-[2rem] border-2 border-teal-100 text-teal-900 font-bold text-sm leading-relaxed shadow-sm">
                                    {IMPULSE_CONCLUSIONS[randomIdx].sub}
                                </div>
                            </div>
                        </div>
                        <button onClick={saveEntry} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all hover:bg-slate-800">
                            FINALIZAR Y CERRAR
                        </button>
                    </div>
                )}
            </div>
        );
    }

    // --- BITÁCORA ---
    if (view === 'history') {
        return (
            <div className="max-w-md mx-auto p-6 pb-24 animate-fade-in">
                <Header title="Bitácora Mental" />
                <div className="space-y-4">
                    {entries.length === 0 ? (
                        <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No hay registros aún.</div>
                    ) : (
                        entries.map(e => (
                            <div key={e.id} className="p-6 bg-white rounded-[2.2rem] border border-slate-100 shadow-sm space-y-3 relative group transition-all hover:shadow-md">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-wrap gap-2">
                                        <span className={cn(
                                            "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                                            e.type === 'impulse' ? "bg-teal-100 text-teal-700" : "bg-violet-100 text-violet-700"
                                        )}>
                                            {e.type === 'impulse' ? "Impulso" : "Loop"}
                                        </span>
                                        {e.emotion && <span className="bg-slate-50 text-slate-500 px-2 py-0.5 rounded text-[10px] font-black uppercase">{e.emotion}</span>}
                                        {e.distortion && <span className="bg-slate-50 text-violet-400 px-2 py-0.5 rounded text-[10px] font-black uppercase">{e.distortion}</span>}
                                    </div>
                                    <button onClick={() => deleteEntry(e.id)} className="p-1 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="font-black text-slate-900 text-sm leading-tight">{e.loop_type || e.impulse_type}</p>
                                <p className="text-slate-600 text-xs italic bg-slate-50 p-4 rounded-2xl border-l-4 border-slate-200 font-medium leading-relaxed">
                                    "{e.optional_text || 'Procesado con éxito.'}"
                                </p>
                                <div className="text-[9px] text-slate-300 font-black tracking-widest uppercase">{new Date(e.timestamp).toLocaleString()}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    }

    // --- PATRONES ---
    if (view === 'patterns') {
        return (
            <div className="max-w-md mx-auto p-6 pb-24 space-y-6 animate-fade-in">
                <Header title="Análisis Profundo" />
                {!stats ? (
                    <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs italic">Bitácora vacía. Seguí registrando para mapear tus patrones.</div>
                ) : (
                    <>
                        <div className="p-8 bg-slate-900 rounded-[3rem] text-white space-y-5 shadow-2xl relative overflow-hidden border border-slate-800">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl"></div>
                            <div className="flex items-center gap-3 text-teal-400">
                                <ShieldAlert className="w-6 h-6" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Soberanía Mental</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Patrón dominante:</p>
                                <h3 className="text-2xl font-black text-white leading-tight">{stats.mostCommonType}</h3>
                            </div>
                            <div className="p-5 bg-white/5 rounded-3xl text-sm text-slate-300 italic leading-relaxed border border-white/10 font-medium">
                                {PSYCH_INSIGHTS[stats.mostCommonType] || PSYCH_INSIGHTS.Default}
                            </div>
                        </div>

                        <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <h4 className="font-black text-slate-900 mb-6 text-[10px] uppercase tracking-widest text-center">Tus Desafíos Principales</h4>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.typeData} layout="vertical" margin={{ left: -10, right: 30 }}>
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={140} style={{ fontSize: '9px', fontWeight: 'bold', fill: '#94a3b8' }} />
                                        <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}} />
                                        <Bar dataKey="value" fill="#8b5cf6" radius={[0, 10, 10, 0]} barSize={28}>
                                            {stats.typeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.name.includes("mensaje") || entry.name.includes("Gritar") ? '#14b8a6' : '#8b5cf6'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-7 bg-violet-50 rounded-[2.2rem] text-center border-2 border-violet-100 shadow-sm transition-all hover:bg-violet-100">
                                <p className="text-4xl font-black text-violet-600 leading-none">{stats.loopCount}</p>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Loops</p>
                            </div>
                            <div className="p-7 bg-teal-50 rounded-[2.2rem] text-center border-2 border-teal-100 shadow-sm transition-all hover:bg-teal-100">
                                <p className="text-4xl font-black text-teal-600 leading-none">{stats.impulseCount}</p>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Impulsos</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }

    return null;
}

