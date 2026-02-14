
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SoundProvider, useSound } from './contexts/SoundContext';
import { SoundType } from './types';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CyberParticles from './components/animations/CyberParticles';
import LoadingScreen from './components/animations/LoadingScreen';
import CyberButton from './components/ui/CyberButton';
import GlitchText from './components/ui/GlitchText';
import StoryTimeline from './components/features/StoryTimeline';
import LettersArchive from './components/features/LettersArchive';
import ReasonsList from './components/features/ReasonsList';
import FutureVision from './components/features/FutureVision';
import LoveQuiz from './components/features/LoveQuiz';
import DailyNote from './components/features/DailyNote';
import SecretArchive from './components/features/SecretArchive';
import NeonCard from './components/ui/NeonCard';
import SectionDivider from './components/ui/SectionDivider';
import ProgressCircle from './components/ui/ProgressCircle';
import LoveCounter from './components/ui/LoveCounter';
import HeartAnimation from './components/ui/HeartAnimation';
import Modal from './components/ui/Modal';
import GlowText from './components/ui/GlowText';
import MoodSelector from './components/features/MoodSelector';
import { FaHeart, FaBolt, FaStar, FaInfinity, FaArrowDown, FaEnvelopeOpenText, FaHistory, FaFingerprint, FaGamepad, FaCalendarDay, FaLock } from 'react-icons/fa';

const MainExperience = () => {
  const { playSfx, startBgMusic, setMute } = useSound();
  const [isLoading, setIsLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [activeSector, setActiveSector] = useState('DASHBOARD');
  const [heartBurst, setHeartBurst] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState<string | null>(null);
  const [mood, setMood] = useState<'HAPPY' | 'SAD' | 'STRESSED' | 'MISSING_YOU'>('HAPPY');
  const [logoClicks, setLogoClicks] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const saved = localStorage.getItem('lyra_daily_clicks');
    const savedDate = localStorage.getItem('lyra_daily_clicks_date');
    const today = new Date().toLocaleDateString();
    
    if (saved && savedDate === today) {
      return parseInt(saved);
    }
    return 0;
  });
  
  // Ref for strict mode visit counting
  const visitLogged = useRef(false);

  // Visit tracking
  useEffect(() => {
    if (started && !visitLogged.current) {
      visitLogged.current = true;
      const visits = parseInt(localStorage.getItem('lyra_visits') || '0');
      const newCount = visits + 1;
      localStorage.setItem('lyra_visits', newCount.toString());
      
      if (newCount === 1) setShowMilestoneModal("Welcome, my love! This world is built entirely for you. ❤️");
      else if (newCount === 10) setShowMilestoneModal("Double digits! You've visited our world 10 times! 💕");
      else if (newCount === 50) setShowMilestoneModal("50 visits?! You truly are my most frequent user. I love you! ✨");
    }
  }, [started]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = useCallback(() => {
    // Force sound ON when user enters
    setMute(false);
    
    setStarted(true);
    
    // Play entrance sound effects
    playSfx(SoundType.SUCCESS);
    playSfx(SoundType.ENTRANCE);
    
    // Trigger visual burst
    triggerLoveBurst();
    
    // Start background music
    startBgMusic();
  }, [setMute, setStarted, startBgMusic, playSfx]);

  const triggerLoveBurst = () => {
    setHeartBurst(true);
    playSfx(SoundType.CHIME);
    setTimeout(() => setHeartBurst(false), 100);
  };

  const navigate = (sector: string) => {
    playSfx(SoundType.UI_CLICK);
    setActiveSector(sector);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoClick = () => {
    setLogoClicks(prev => {
      const next = prev + 1;
      
      // Persist daily clicks
      localStorage.setItem('lyra_daily_clicks', next.toString());
      localStorage.setItem('lyra_daily_clicks_date', new Date().toLocaleDateString());

      if (next % 10 === 0) {
        navigate('SECRET');
        playSfx(SoundType.ENTRANCE);
      }
      return next;
    });
  };

  return (
    <div className={`relative min-h-screen w-full bg-[#0A0E27] transition-colors duration-1000 mood-${mood.toLowerCase()}`}>
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      {!isLoading && (
        <main className="relative w-full flex flex-col items-center">
          <CyberParticles />
          <HeartAnimation trigger={heartBurst} />
          
          <AnimatePresence>
            {!started ? (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-6"
              >
                <NeonCard glowColor="pink" className="max-w-md w-full text-center p-12">
                   <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                     <FaEnvelopeOpenText size={60} className="text-[#FF0080] mx-auto mb-6" />
                   </motion.div>
                   <h2 className="font-orbitron text-3xl font-black text-white mb-2 tracking-tighter uppercase">
                     For Your Eyes Only
                   </h2>
                   <p className="font-rajdhani text-gray-400 mb-8 text-lg">
                     A digital soul-sync created by <span className="text-[#00F0FF]">Yuki</span> specifically for <span className="text-[#FF0080]">Lyraa</span>.
                   </p>
                   <div className="mb-8 flex justify-center">
                     <ProgressCircle 
                       percentage={100} 
                       size={80}
                       strokeWidth={6}
                       label="Soul Connection"
                     />
                   </div>
                   <CyberButton onClick={handleStart} variant="yukiToLyraa" size="lg">
                     Enter Our World
                   </CyberButton>
                </NeonCard>
              </motion.section>
            ) : (
              <>
                <Navbar 
                  onNavigate={navigate} 
                  currentSector={activeSector} 
                  onLogoClick={handleLogoClick}
                  extraContent={<MoodSelector currentMood={mood} onMoodChange={setMood} />}
                />
                
                <div className="w-full pt-32 pb-24">
                  <AnimatePresence mode="wait">
                    {activeSector === 'DASHBOARD' && (
                      <motion.div key="dash" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        {/* HERO SECTION */}
                        <section id="hero" className="min-h-[80vh] w-full flex flex-col items-center justify-center px-6 relative">
                          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.2 }} className="text-center z-10">
                            <GlowText intensity="high" lyraMode animated="pulse" className="text-8xl md:text-[12rem] font-black leading-none tracking-tighter mb-4 select-none">
                              LYRAA
                            </GlowText>
                            <div className="h-8 mb-4">
                              <GlitchText text="DECODING_YUKIS_LOVE_FOR_YOU..." speed={80} className="font-orbitron text-[#00F0FF] text-sm md:text-lg tracking-[0.4em] uppercase" />
                            </div>
                            <p className="font-rajdhani text-xl md:text-3xl text-white/80 max-w-2xl mx-auto italic mb-12">
                              "You're not just my girlfriend, you're my entire universe. This is for you, from the bottom of my heart."
                            </p>
                            <div className="flex flex-wrap justify-center gap-6">
                              <CyberButton variant="yukiToLyraa" size="lg" onClick={() => navigate('STORY')}>
                                See Our Story <FaHeart className="ml-2 animate-heartbeat" />
                              </CyberButton>
                              <CyberButton variant="secondary" size="lg" onClick={() => navigate('LETTERS')}>
                                Read My Letters 💌
                              </CyberButton>
                            </div>
                          </motion.div>
                          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-10 flex flex-col items-center text-gray-500 gap-2">
                            <span className="font-orbitron text-[8px] tracking-[0.5em] uppercase">Explore More</span>
                            <FaArrowDown />
                          </motion.div>
                        </section>

                        <section className="w-full max-w-6xl px-6 mx-auto">
                          <SectionDivider text="SYSTEM_STATUS_LOVED" />
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                             <div className="lg:col-span-2">
                                <DailyNote />
                             </div>
                             <div className="flex flex-col gap-8">
                                <LoveCounter />
                                <NeonCard glowColor="purple">
                                  <FaFingerprint className="text-[#B026FF] text-4xl mb-4" />
                                  <h4 className="font-orbitron text-xl font-bold mb-4 text-[#B026FF]">VISIT_LOG</h4>
                                  <p className="font-rajdhani text-white text-3xl font-black">
                                     {localStorage.getItem('lyra_visits')} <span className="text-xs font-orbitron text-gray-500">SIGNALS_RECEIVED</span>
                                  </p>
                                  <p className="font-rajdhani text-gray-400 text-sm mt-2 italic">"Every visit makes my core heart beat faster."</p>
                                </NeonCard>
                                
                                <NeonCard glowColor="cyan">
                                  <FaCalendarDay className="text-[#00F0FF] text-4xl mb-4" />
                                  <h4 className="font-orbitron text-xl font-bold mb-4 text-[#00F0FF]">DAILY_COUNT</h4>
                                  <p className="font-rajdhani text-white text-3xl font-black">
                                     {logoClicks} <span className="text-xs font-orbitron text-gray-500">CLICKS_TODAY</span>
                                  </p>
                                  <p className="font-rajdhani text-gray-400 text-sm mt-2 italic">"Your interactions keep our connection alive."</p>
                                </NeonCard>
                             </div>
                             
                             <NeonCard glowColor="cyan" className="cursor-pointer" onClick={() => navigate('GAME')}>
                                <FaGamepad className="text-[#00F0FF] text-4xl mb-4" />
                                <h4 className="font-orbitron text-xl font-bold mb-4 text-[#00F0FF]">THE_SYNC_QUIZ</h4>
                                <p className="font-rajdhani text-gray-300 italic">"How well do you know Yuki? Test your synchronization index here."</p>
                             </NeonCard>
                             
                             <NeonCard glowColor="purple" className="cursor-pointer" onClick={() => navigate('STORY')}>
                                <FaStar className="text-[#B026FF] text-4xl mb-4" />
                                <h4 className="font-orbitron text-xl font-bold mb-4 text-[#B026FF]">MILESTONES</h4>
                                <p className="font-rajdhani text-gray-300 italic">"Our shining moments and beautiful memories together."</p>
                             </NeonCard>
                             <NeonCard forLyraa>
                                <FaBolt className="text-[#FF0080] text-4xl mb-4" />
                                <h4 className="font-orbitron text-xl font-bold mb-4 text-[#FF0080]">ENERGY_BOOST</h4>
                                <p className="font-rajdhani text-gray-300 italic">"Thinking of you gives me infinite energy and motivation."</p>
                                <CyberButton variant="pink" size="sm" className="mt-6 w-full" onClick={() => navigate('REASONS')}>
                                   Why I Love You
                                </CyberButton>
                             </NeonCard>
                             <NeonCard glowColor="purple" onClick={() => navigate('FUTURE')}>
                                <FaInfinity className="text-[#B026FF] text-4xl mb-4" />
                                <h4 className="font-orbitron text-xl font-bold mb-4 text-[#B026FF]">THE_HORIZON</h4>
                                <p className="font-rajdhani text-gray-300 italic">"What does our tomorrow look like? Access our future data-logs."</p>
                             </NeonCard>
                             
                             <NeonCard glowColor="cyan" className="cursor-pointer" onClick={() => navigate('LETTERS')}>
                                <FaHistory className="text-[#00F0FF] text-4xl mb-4" />
                                <h4 className="font-orbitron text-xl font-bold mb-4 text-[#00F0FF]">MEMORY_ARCHIVE</h4>
                                <p className="font-rajdhani text-gray-300 italic">"Relive our beautiful moments and cherished memories together."</p>
                             </NeonCard>
                             
                             <NeonCard glowColor="purple" className="cursor-pointer" onClick={() => navigate('SECRET')}>
                                <FaLock className="text-[#B026FF] text-4xl mb-4" />
                                <h4 className="font-orbitron text-xl font-bold mb-4 text-[#B026FF]">SECURE_VAULT</h4>
                                <p className="font-rajdhani text-gray-300 italic">"Access our most private and encrypted memories together."</p>
                             </NeonCard>
                          </div>
                        </section>
                      </motion.div>
                    )}

                    {activeSector === 'STORY' && (
                      <motion.div key="story" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="text-center mb-12">
                           <GlowText intensity="high" lyraMode className="text-5xl font-black uppercase tracking-tighter">Our Love Story</GlowText>
                        </div>
                        <StoryTimeline />
                      </motion.div>
                    )}

                    {activeSector === 'LETTERS' && (
                      <motion.div key="letters" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="text-center mb-12">
                           <GlowText intensity="high" lyraMode className="text-5xl font-black uppercase tracking-tighter">Encrypted Letters</GlowText>
                        </div>
                        <LettersArchive />
                      </motion.div>
                    )}

                    {activeSector === 'REASONS' && (
                      <motion.div key="reasons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <ReasonsList />
                      </motion.div>
                    )}

                    {activeSector === 'FUTURE' && (
                      <motion.div key="future" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <FutureVision />
                      </motion.div>
                    )}

                    {activeSector === 'GAME' && (
                      <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <LoveQuiz />
                      </motion.div>
                    )}

                    {activeSector === 'SECRET' && (
                      <motion.div key="secret" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <SecretArchive onNavigateHome={() => setActiveSector('DASHBOARD')} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Footer />
                
                <Modal isOpen={!!showMilestoneModal} onClose={() => setShowMilestoneModal(null)} romantic size="sm">
                   <div className="text-center">
                      <FaHeart className="text-[#FF0080] text-4xl mx-auto mb-6 animate-heartbeat" />
                      <h3 className="font-orbitron text-2xl font-bold text-white mb-4 uppercase">System Milestone</h3>
                      <p className="font-rajdhani text-xl text-gray-300 italic mb-8">{showMilestoneModal}</p>
                      <CyberButton variant="pink" onClick={() => setShowMilestoneModal(null)}>Dismiss</CyberButton>
                   </div>
                </Modal>
              </>
            )}
          </AnimatePresence>
        </main>
      )}
    </div>
  );
};

const App = () => {
  return (
    <SoundProvider>
      <MainExperience />
    </SoundProvider>
  );
};

export default App;
