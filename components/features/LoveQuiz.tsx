import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaTrophy, FaRedo, FaPlus, FaCheck, FaTrash } from 'react-icons/fa';
import { QUIZ_QUESTIONS } from '../../lib/constants';
import NeonCard from '../ui/NeonCard';
import CyberButton from '../ui/CyberButton';
import ProgressCircle from '../ui/ProgressCircle';
import Modal from '../ui/Modal';
import AnimatedInput from '../ui/AnimatedInput';
import PasswordModal from '../ui/PasswordModal';
import { useSound } from '../../contexts/SoundContext';
import { SoundType } from '../../types';

interface Question {
  question: string;
  options: string[];
  answer: string;
  context: string;
}

const LoveQuiz: React.FC = () => {
  const { playSfx } = useSound();
  const [questions, setQuestions] = useState<Question[]>(QUIZ_QUESTIONS);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; msg: string } | null>(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQ, setNewQ] = useState({
    question: '',
    opt1: '',
    opt2: '',
    opt3: '',
    opt4: '',
    correctIndex: 0,
    context: ''
  });

  // Delete state
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('lyra_quiz_questions');
    if (saved) {
      setQuestions(JSON.parse(saved));
    } else {
      // Initialize with constants if no local storage
      setQuestions(QUIZ_QUESTIONS);
    }
  }, []);

  const handleAnswer = (option: string) => {
    const isCorrect = option === questions[step].answer;
    if (isCorrect) {
      setScore(s => s + 1);
      playSfx(SoundType.SUCCESS);
    } else {
      playSfx(SoundType.ERROR);
    }
    setFeedback({ correct: isCorrect, msg: questions[step].context });
  };

  const nextQuestion = () => {
    setFeedback(null);
    if (step + 1 < questions.length) {
      setStep(s => s + 1);
    } else {
      setShowResult(true);
    }
  };

  const reset = () => {
    setStep(0);
    setScore(0);
    setShowResult(false);
    setFeedback(null);
  };

  const handleAddQuestion = () => {
    if (!newQ.question || !newQ.opt1 || !newQ.opt2 || !newQ.opt3 || !newQ.opt4 || !newQ.context) return;

    const options = [newQ.opt1, newQ.opt2, newQ.opt3, newQ.opt4];
    const newQuestionObj: Question = {
      question: newQ.question,
      options,
      answer: options[newQ.correctIndex],
      context: newQ.context
    };

    const updatedQuestions = [...questions, newQuestionObj];
    setQuestions(updatedQuestions);
    localStorage.setItem('lyra_quiz_questions', JSON.stringify(updatedQuestions));
    
    setIsModalOpen(false);
    setNewQ({
      question: '',
      opt1: '',
      opt2: '',
      opt3: '',
      opt4: '',
      correctIndex: 0,
      context: ''
    });
    playSfx(SoundType.SUCCESS);
  };

  const confirmDelete = () => {
    if (deleteIndex === null) return;
    
    const updatedQuestions = questions.filter((_, i) => i !== deleteIndex);
    setQuestions(updatedQuestions);
    localStorage.setItem('lyra_quiz_questions', JSON.stringify(updatedQuestions));
    
    // Reset quiz if current question was deleted or if index shifts
    if (step >= updatedQuestions.length) {
      setStep(Math.max(0, updatedQuestions.length - 1));
    }
    
    setDeleteIndex(null);
    playSfx(SoundType.SUCCESS);
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <NeonCard glowColor="cyan" className="p-10 relative group">
              <div className="flex justify-between items-center mb-8">
                <span className="font-orbitron text-[10px] text-gray-500 uppercase tracking-widest">Question {step + 1}/{questions.length}</span>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <FaHeart className="text-[#FF0080] animate-heartbeat" />
                    <span className="font-orbitron text-[10px] text-[#FF0080] uppercase tracking-widest">Score: {score}</span>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteIndex(step);
                      playSfx(SoundType.UI_CLICK);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-[#FF0080] p-1"
                    title="Delete this question"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <h3 className="font-orbitron text-2xl font-bold text-white mb-10 text-center uppercase tracking-tighter">
                {questions[step]?.question}
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {questions[step]?.options.map((opt) => (
                  <CyberButton
                    key={opt}
                    variant="secondary"
                    className="w-full text-left justify-start"
                    onClick={() => !feedback && handleAnswer(opt)}
                    disabled={!!feedback}
                  >
                    {opt}
                  </CyberButton>
                ))}
              </div>

              {feedback && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 bg-white/5 border border-white/10 text-center">
                  <p className={`font-orbitron text-sm mb-2 ${feedback.correct ? 'text-green-400' : 'text-[#FF0080]'}`}>
                    {feedback.correct ? 'SYNC_SUCCESSFUL' : 'SYNC_MISMATCH'}
                  </p>
                  <p className="font-rajdhani text-gray-300 italic mb-6">"{feedback.msg}"</p>
                  <CyberButton variant="pink" onClick={nextQuestion}>Continue</CyberButton>
                </motion.div>
              )}
            </NeonCard>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <NeonCard forLyraa className="p-12">
              <FaTrophy className="text-[#00F0FF] text-6xl mx-auto mb-6 glow-cyan" />
              <h2 className="font-orbitron text-4xl font-black text-white mb-4 uppercase">Sync Analysis</h2>
              <div className="flex justify-center my-10">
                <ProgressCircle percentage={(score / questions.length) * 100} label="Yuki-Sync Index" size={160} />
              </div>
              <p className="font-rajdhani text-xl text-gray-300 italic mb-10">
                {score === questions.length
                  ? "You know me perfectly, Lyraa. You are my soul's mirror."
                  : "Every day is a new chance to learn more about our world."}
              </p>
              <CyberButton variant="yukiToLyraa" icon={<FaRedo />} onClick={reset}>Try Again</CyberButton>
            </NeonCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 flex justify-center">
        <CyberButton variant="yukiToLyraa" icon={<FaPlus />} onClick={() => setIsModalOpen(true)}>
          Add New Question
        </CyberButton>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
        <h2 className="font-orbitron text-2xl font-bold text-[#00F0FF] mb-6 text-center uppercase">Add New Challenge</h2>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <AnimatedInput
            label="Question"
            value={newQ.question}
            onChange={(e) => setNewQ({ ...newQ, question: e.target.value })}
            placeholder="What do you want to ask?"
            autoFocus
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((num, idx) => (
              <div key={num} className="relative group">
                <AnimatedInput
                  label={`Option ${num}`}
                  value={newQ[`opt${num}` as keyof typeof newQ] as string}
                  onChange={(e) => setNewQ({ ...newQ, [`opt${num}`]: e.target.value })}
                  placeholder={`Option ${num}`}
                />
                <button 
                  onClick={() => setNewQ({ ...newQ, correctIndex: idx })}
                  className={`absolute top-0 right-0 z-20 px-3 py-1 text-[10px] font-orbitron uppercase transition-all rounded border cursor-pointer ${
                    newQ.correctIndex === idx 
                      ? 'bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.2)]' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {newQ.correctIndex === idx ? <FaCheck className="inline mr-1" /> : <div className="inline-block w-2 h-2 rounded-full border border-current mr-1" />}
                  {newQ.correctIndex === idx ? 'Correct Answer' : 'Mark as Correct'}
                </button>
              </div>
            ))}
          </div>

          <AnimatedInput
            label="Context / Explanation"
            value={newQ.context}
            onChange={(e) => setNewQ({ ...newQ, context: e.target.value })}
            placeholder="What does this mean for us?"
          />

          <div className="flex justify-end gap-4 pt-4">
            <CyberButton variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </CyberButton>
            <CyberButton variant="pink" size="sm" onClick={handleAddQuestion}>
              Save Challenge
            </CyberButton>
          </div>
        </div>
      </Modal>

      <PasswordModal 
        isOpen={deleteIndex !== null}
        onClose={() => setDeleteIndex(null)}
        onSuccess={confirmDelete}
        title="Delete Question"
        actionLabel="Delete Forever"
      />
    </div>
  );
};

export default LoveQuiz;
