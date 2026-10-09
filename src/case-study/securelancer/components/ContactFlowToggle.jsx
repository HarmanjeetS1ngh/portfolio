import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { Player } from '@lottiefiles/react-lottie-player';

// Import all 8 local Lottie JSON files
import confusedFace from '../emoji/confused_face.json';
import explodingHead from '../emoji/exploding_head.json';
import neutralFace from '../emoji/neutral_face.json';
import partyingFace from '../emoji/partying_face.json';
import relievedFace from '../emoji/relieved_face.json';
import slightlySmilingFace from '../emoji/slightly_smiling_face.json';
import smilingFaceWithSunglasses from '../emoji/smiling_face_with_sunglasses.json';
import tiredFace from '../emoji/tired_face.json';

const EmojiTraveler = ({ stepSpacing, isAfter = false, emojiList }) => {
  const [step, setStep] = useState(0);

  // Keep a ref to the latest emojiList so the interval below never reads a
  // stale array. Without this, the interval closure captured whatever
  // emojiList was at mount time; if the list reference changed (new array
  // literal on every parent render) the displayed emoji could drift out of
  // sync with `step` right as it reached the final index — which is why the
  // "Before" flow showed the wrong emoji specifically on step 4.
  const emojiListRef = useRef(emojiList);
  emojiListRef.current = emojiList;

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % emojiListRef.current.length);
    }, 1800);
    return () => clearInterval(interval);
    // Empty deps: subscribe once. We read emojiListRef.current inside the
    // tick instead of depending on emojiList/emojiList.length, so the timer
    // never restarts (and never desyncs) across re-renders.
  }, []);

  return (
    <motion.div
      className={`absolute left-0 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-lg border-2 z-20 text-xl ${
        isAfter ? 'border-emerald-200' : 'border-gray-100'
      }`}
      style={{ top: 0 }}
      animate={{ y: step * stepSpacing }}
      transition={{ type: 'tween', duration: 0.45, ease: 'easeInOut' }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.5, rotate: 15 }}
          transition={{ duration: 0.15 }}
          className="absolute w-6 h-6 flex items-center justify-center"
        >
          <Player
            src={emojiList[step]}
            autoplay
            loop
            style={{ height: '100%', width: '100%' }}
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

const BeforeView = () => {
  const stepSpacing = 72;
  const steps = [
    { title: 'Personal & company details', extra: '(5 fields)' },
    { title: 'Unguided Service Selection' },
    { title: 'Have to answer more specific questions' },
    { title: "No clear sense of what's next" },
  ];

  // Sequence for the Before flow
  const beforeEmojis = [neutralFace, confusedFace, tiredFace, explodingHead];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full h-full"
    >
      <div className="mb-8 flex items-center font-mono-ui text-xs font-bold tracking-[0.06em] text-ink-3 uppercase">
        <X className="mr-2 h-4 w-4" />
        Before
      </div>

      <div className="relative" style={{ height: (steps.length - 1) * stepSpacing + 32 }}>
        <div
          className="absolute left-[15px] top-[16px] w-[2px] bg-line"
          style={{ height: (steps.length - 1) * stepSpacing }}
        />

        <EmojiTraveler stepSpacing={stepSpacing} isAfter={false} emojiList={beforeEmojis} />

        {steps.map((step, i) => (
          <div
            key={i}
            className="absolute left-0 flex h-8 w-full items-center"
            style={{ top: i * stepSpacing }}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-line bg-white font-semibold text-sm text-ink-3">
              {i + 1}
            </div>
            <div className="ml-5 min-w-0 text-[15px] leading-none">
              <span className="font-medium text-ink-2">{step.title}</span>
              {step.extra && (
                <span className="ml-1.5 font-mono-ui text-sm text-ink-3">{step.extra}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const AfterView = () => {
  const stepSpacing = 72;
  const steps = [
    { title: 'Basic details' },
    { title: 'Pick a service — or select "I need guidance"' },
    { title: 'Short description & timeline' },
    { title: 'Straight into live availability' },
  ];

  // Sequence for the After flow using the rest of your emojis
  const afterEmojis = [slightlySmilingFace, relievedFace, partyingFace, smilingFaceWithSunglasses];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -15 },
    show: { opacity: 1, x: 0, transition: { type: 'tween', ease: 'easeOut', duration: 0.3 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full h-full"
    >
      <div className="mb-8 flex items-center font-mono-ui text-xs font-bold tracking-[0.06em] text-good uppercase">
        <Check className="mr-2 h-4 w-4 stroke-[3]" />
        After
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative"
        style={{ height: (steps.length - 1) * stepSpacing + 32 }}
      >
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: (steps.length - 1) * stepSpacing }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute left-[15px] top-[16px] w-[2px] bg-good/25"
        />

        <EmojiTraveler stepSpacing={stepSpacing} isAfter={true} emojiList={afterEmojis} />

        {steps.map((step, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="absolute left-0 flex h-8 w-full items-center"
            style={{ top: i * stepSpacing }}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-good text-sm font-bold text-white shadow-sm ring-4 ring-good-bg">
              {i + 1}
            </div>
            <div className="ml-5 min-w-0 text-[15px] leading-none font-medium text-ink">
              {step.title}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default function ContactFlowToggle() {
  const [showAfter, setShowAfter] = useState(false);

  return (
    <figure className="flex flex-col gap-4">
      <div className="mx-auto inline-flex items-center gap-0.5 rounded-full border border-line-soft bg-line/50 p-1.5 shadow-inner relative">
        <button
          type="button"
          onClick={() => setShowAfter(false)}
          aria-pressed={!showAfter}
          className={`relative z-10 rounded-full px-5 py-2 font-body text-sm font-semibold transition-colors duration-300 ${
            !showAfter ? 'text-ink' : 'text-ink-3 hover:text-ink-2'
          }`}
        >
          Before
        </button>
        <button
          type="button"
          onClick={() => setShowAfter(true)}
          aria-pressed={showAfter}
          className={`relative z-10 rounded-full px-5 py-2 font-body text-sm font-semibold transition-colors duration-300 ${
            showAfter ? 'text-ink' : 'text-ink-3 hover:text-ink-2'
          }`}
        >
          After
        </button>
        <motion.div
          className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-full border border-line-soft bg-white shadow-sm z-0"
          animate={{ left: showAfter ? 'calc(50% + 3px)' : '6px' }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        />
      </div>

      <div className="mx-auto w-full max-w-lg overflow-hidden rounded-lg border border-line-soft bg-placeholder p-6 md:p-10">
        <AnimatePresence mode="wait">
          {showAfter ? <AfterView key="after" /> : <BeforeView key="before" />}
        </AnimatePresence>
      </div>
    </figure>
  );
}